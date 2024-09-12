const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");
// const { Translate } = require("@google-cloud/translate").v2;

const dictionaryFilePath = path.join(__dirname, "dictionary.json");

// Path to the cache file
const cacheFilePath = path.join(__dirname, "cache.json");

// Utility function to read the cache file
function readCache() {
  if (fs.existsSync(cacheFilePath)) {
    const cacheData = fs.readFileSync(cacheFilePath, "utf8");
    return JSON.parse(cacheData);
  }
  return {};
}

// Utility function to write to the cache file
function writeCache(cache) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
}

function utf8Encode(str) {
  const encoder = new TextEncoder("utf-8");
  return encoder.encode(str);
}

function utf8Decode(buffer) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
}

function updateDictionary(character, data) {
  const dictionary = JSON.parse(fs.readFileSync(dictionaryFilePath, "utf8"));
  if (data) {
    dictionary[character] = { ...dictionary[character], ...data };
    fs.writeFileSync(
      dictionaryFilePath,
      JSON.stringify(dictionary, null, 2),
      "utf8"
    );
  } else {
    console.log(`${character} not found`);
  }
}

async function searchhanzihero(query) {
  return new Promise((resolve, reject) => {
    const url = `https://hanzihero.com/simplified/assignments/search?search%5Bquery%5D=${query}`;

    https.get(url, (response) => {
      let html = "";

      // Collect response data
      response.on("data", (chunk) => {
        html += chunk;
      });

      response.on("end", () => {
        resolve(html);
      });
    });
  });
}

async function getSubcomponentsFromHanziHeroAndUpdateDictionary(
  englishMeaning
) {
  return new Promise((resolve, reject) => {
    const urls = [
      `https://hanzihero.com/simplified/components/${encodeURIComponent(
        englishMeaning
      )}`,
      // `https://hanzihero.com/simplified/words/${encodeURIComponent(
      //   englishMeaning
      // )}`,
      `https://hanzihero.com/simplified/characters/${encodeURIComponent(
        englishMeaning
      )}`,
    ];

    function tryFetching(urlIndex) {
      if (urlIndex >= urls.length) {
        reject(`Could not fetch subcomponents for ${englishMeaning}`);
        return;
      }

      const url = urls[urlIndex];

      https
        .get(url, (response) => {
          let data = "";

          // Collect response data
          response.on("data", (chunk) => {
            data += chunk;

            if (data.includes("redirected") && urlIndex + 1 <= 1) {
              // console.log(
              //   `Redirect found, trying next URL: ${urls[urlIndex + 1]}`
              // );
              tryFetching(urlIndex + 1);
              return;
            }
          });

          // When the response is complete
          response.on("end", () => {
            try {
              // Regular expressions to match subcomponents
              const originalCharacterMeaningRegex =
                /<h2 class="text-3xl text-slate-600 sm:text-5xl">([^<]+)<\/h2>/;
              const characterRegex =
                /<span lang="zh-Hans" class="text-3xl h-12 w-12 font-noto-sc  flex items-center justify-center text-center text-white">([^<]+)<\/span>/g;
              const englishRegex =
                /<span class="pl-1 text-xl font-light capitalize text-slate-500">([^<]+)<\/span>/g;

              // Extract original character meaning
              const originalCharacterMeaningMatch =
                originalCharacterMeaningRegex.exec(data);
              const originalCharacterMeaning = originalCharacterMeaningMatch
                ? originalCharacterMeaningMatch[1].trim()
                : null;

              let characters = [];
              let englishTranslations = [];
              let originalCharacter;
              let index = 0;

              // Extract subcomponents
              while ((characterMatch = characterRegex.exec(data))) {
                const characterText = characterMatch[1].trim();
                const englishMatch = englishRegex.exec(data);
                const englishText = englishMatch
                  ? englishMatch[1].trim()
                  : null;

                if (characterText) {
                  characters.push(characterText);
                  englishTranslations.push(englishText);
                }

                index++;
              }

              characters.reverse();
              originalCharacter = characters.pop();
              const originalMeaning = englishTranslations.pop();
              englishTranslations.reverse();
              const subcomponents = characters.map(
                (char, index) =>
                  englishTranslations[index] && {
                    [char]: englishTranslations[index],
                  }
              );

              // Update dictionary
              updateDictionary(originalCharacter, { subcomponents });

              // resolve
              const dictionary = JSON.parse(
                fs.readFileSync(dictionaryFilePath, "utf8")
              );
              resolve({ subcomponents, ...dictionary[originalCharacter] });
            } catch (error) {
              reject(
                `Error parsing data for ${englishMeaning}: ${error.message}`
              );
            }
          });
        })
        .on("error", (error) => {
          reject(
            `Error fetching subcomponents for ${englishMeaning}: ${error.message}`
          );
        });
    }

    tryFetching(0); // Start with the first URL
  });
}

// Function to handle translation
async function translateText(text, targetLanguage) {
  // Initialize Google Translate client
  const translate = new Translate();

  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error(`Error translating text: ${error.message}`);
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  // API endpoint to update the dictionary
  if (req.method === "POST" && req.url.includes("/api/dictionary")) {
    let body = [];

    // Collect the buffer data chunks
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const data = Buffer.concat(body);
      const json = JSON.parse(utf8Decode(data));
      updateDictionary(json.simplified, json);
    });
  }

  if (req.method === "GET" && req.url.includes("/api/englishtohanzi")) {
    const parts = req.url.split("/");
    const searchValue = parts[parts.length - 1];
    // Read the cache
    let cache = readCache();

    // Check if the search value is in the cache
    if (cache[searchValue]) {
      // Return the cached result as JSON
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cache[searchValue]));
    } else {
      const html = await searchhanzihero(searchValue);

      const updatedCharacter =
        await getSubcomponentsFromHanziHeroAndUpdateDictionary(searchValue);

      const response = {
        html,
        updatedCharacter,
      };

      // Update the cache with the new result
      cache[searchValue] = response;
      writeCache(cache);

      // const result = await getSubcomponentsFromHanziHeroAndUpdateDictionary(searchValue);
      // Set the response headers and return the subcomponents as JSON
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    }
  }

  // New route to handle translation using Google Translate API
  if (req.method === "GET" && req.url.includes("/api/translate")) {
    const urlParts = req.url.split("/");
    const textToTranslate = decodeURIComponent(urlParts[3]); // Get text from URL
    const targetLanguage = urlParts[2]; // Extract target language from the URL

    // Read the cache
    let cache = readCache();

    // Create a cache key
    const cacheKey = `${textToTranslate}_${targetLanguage}`;

    // Check if the translation is in the cache
    if (cache[cacheKey]) {
      console.log(
        `Cache hit for translation: ${textToTranslate} to ${targetLanguage}`
      );

      // Return the cached translation
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ translation: cache[cacheKey] }));
    } else {
      // Perform translation if not found in cache
      translateText(textToTranslate, targetLanguage)
        .then((translation) => {
          console.log(
            `Translation for ${textToTranslate} to ${targetLanguage}: ${translation}`
          );

          // Update the cache with the new translation
          cache[cacheKey] = translation;
          writeCache(cache);

          // Return the translation as JSON
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ translation }));
        })
        .catch((error) => {
          console.error(`Error translating text: ${error}`);

          // Return an error response
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to translate text" }));
        });
    }
  }

  let pathname = url.parse(req.url).pathname;

  // Map URL paths to file paths in the public directory
  let publicFilePath = path.join(__dirname, "public", pathname);

  // Serve index.html by default if URL ends with '/'
  if (publicFilePath.endsWith("/")) {
    publicFilePath = path.join(publicFilePath, "index.html");
  }

  // Determine file extension
  let extname = path.extname(publicFilePath);
  let contentType = "text/html";

  // Set content type based on file extension
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".ico":
      contentType = "image/x-icon";
      break;
  }

  // Check if file exists in the public directory
  fs.readFile(publicFilePath, (publicErr, publicContent) => {
    if (!publicErr) {
      // Serve the file from the public directory
      res.writeHead(200, { "Content-Type": contentType });
      res.end(publicContent, "utf-8");
    } else {
      // Map URL paths to file paths in the node_modules directory
      let nodeModulesFilePath = path.join(__dirname, "node_modules", pathname);

      // Check if file exists in the node_modules directory
      fs.readFile(nodeModulesFilePath, (nodeModulesErr, nodeModulesContent) => {
        if (!nodeModulesErr) {
          // Serve the file from the node_modules directory
          res.writeHead(200, { "Content-Type": contentType });
          res.end(nodeModulesContent, "utf-8");
        } else {
          // Serve the file by pathname
          fs.readFile(pathname.slice(1), (err, content) => {
            if (err) {
              // File not found, return 404
              res.writeHead(404);
              res.end("404 Not Found");
            } else {
              // Serve the file with appropriate content type
              res.writeHead(200, { "Content-Type": contentType });
              res.end(content, "utf-8");
            }
          });
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
