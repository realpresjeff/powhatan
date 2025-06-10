const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { StringDecoder } = require("string_decoder");
// const { Translate } = require("@google-cloud/translate").v2;

const dictionaryFilePath = path.join(__dirname, "dictionary.json");

// Path to the cache file
const cacheFilePath = path.join(__dirname, "cache.json");

const uploadDir = path.join(__dirname, "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// const vision = require("@google-cloud/vision");

async function copy_text_from_image(filepath) {
  console.log(filepath);
  // Creates a client
  const client = new vision.ImageAnnotatorClient({ apiKey: "" });

  // Performs text detection on the local file
  const [result] = await client.textDetection(filepath);
  const detections = result.textAnnotations;
  console.log("Text:");
  detections.forEach((text) => console.log(text));
  console.log(detections);
  let str = "";
  detections.map((text) => (str += text));
  console.log(str);
  return str;
}

function detectLanguage(text) {
  let englishCount = 0;
  let chineseCount = 0;

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);

    // Check for English characters (A-Z, a-z)
    if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ) {
      englishCount++;
    }
    // Check for Chinese characters (Unicode range for CJK Unified Ideographs)
    else if (charCode >= 0x4e00 && charCode <= 0x9fff) {
      chineseCount++;
    }

    // Stop checking if we have 2 characters from either language
    if (chineseCount >= 2) {
      return "Chinese";
    }
  }

  return "English";
}

// Extract boundary for multipart form data
function getBoundary(contentType) {
  const boundaryPrefix = "boundary=";
  const boundaryIndex = contentType.indexOf(boundaryPrefix);
  if (boundaryIndex === -1) {
    return null;
  }
  let boundary = contentType.slice(boundaryIndex + boundaryPrefix.length);
  return boundary.trim();
}

// Parse the file upload from the stream
function parseFormData(req, boundary) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    let decoder = new StringDecoder("utf8");
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      const parts = body.split(`--${boundary}`);

      parts.forEach((part) => {
        // Find the part that contains file data
        if (
          part.indexOf("Content-Disposition: form-data;") !== -1 &&
          part.indexOf("filename=") !== -1
        ) {
          const fileName = part.match(/filename="(.+)"/)[1];
          const fileData = part.split("\r\n\r\n")[1].split("\r\n--")[0]; // Extract the file content

          // Write the file to the upload directory
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, fileData, "binary");

          resolve(filePath); // Resolve with the path to the saved file
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

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

async function englishtohanzi(query) {
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

async function getHanziSubcomponents(query) {
  return new Promise((resolve, reject) => {
    const url = `https://hanzihero.com/simplified/characters/${encodeURIComponent(
      query
    )}`;

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

  if (req.method === "POST" && req.url.includes("/api/subcomponents")) {
    let body = [];

    // Collect the buffer data chunks
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", async () => {
      const data = Buffer.concat(body);
      const { char } = JSON.parse(utf8Decode(data));

      // Read the cache
      let cache = readCache();

      // Check if the search value is in the cache
      if (cache[char]) {
        // Return the cached result as JSON
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cache[char]));
      } else {
        const subcomponents = await getHanziSubcomponents(char);

        const response = {
          subcomponents,
        };

        // Update the cache with the new result
        cache[char] = response;
        writeCache(cache);

        // Set the response headers and return the subcomponents as JSON
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      }
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
      const html = await englishtohanzi(searchValue);

      const response = {
        html,
      };

      // Update the cache with the new result
      cache[searchValue] = response;
      writeCache(cache);

      // Set the response headers and return the subcomponents as JSON
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    }
  }

  // if (
  //   req.method === "POST" &&
  //   req.headers["content-type"].includes("multipart/form-data") &&
  //   req.url === "/api/image"
  // ) {
  //   const boundary = getBoundary(req.headers["content-type"]);

  //   if (!boundary) {
  //     res.writeHead(400, { "Content-Type": "text/plain" });
  //     res.end("Bad Request: No boundary in multipart/form-data");
  //     return;
  //   }

  //   try {
  //     // Parse and save the file
  //     const filePath = await parseFormData(req, boundary);

  //     const text = copy_text_from_image(filePath);

  //     // Respond with success and file path
  //     res.writeHead(200, { "Content-Type": "application/json" });
  //     res.end(
  //       JSON.stringify({
  //         text,
  //         language: detectLanguage(text),
  //       })
  //     );
  //   } catch (error) {
  //     res.writeHead(500, { "Content-Type": "application/json" });
  //     res.end(JSON.stringify({ error: "File upload failed" }));
  //   }
  // }

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
              // res.writeHead(404);
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
