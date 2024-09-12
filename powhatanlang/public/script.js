let dictionary = {};

// Fetch the dictionary data from JSON
fetch("./dictionary.json")
  .then((response) => response.json())
  .then((data) => {
    dictionary = data;
  })
  .catch((error) => console.error("Error loading dictionary:", error));

function showLoadingIndicator(show) {
  const loadingIndicator = document.getElementById("loading");

  if (show) {
    loadingIndicator.style.display = "block"; // Show the loading indicator
  } else {
    loadingIndicator.style.display = "none"; // Hide the loading indicator
  }
}

function updateDictionary(character, data) {
  // Send updated dictionary to the server
  fetch(`/api/dictionary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  })
    .then((response) => response.json())
    .then((data) => {
      // document.getElementById('message').innerText = data.message;
    })
    .catch((error) => console.error("Error saving dictionary:", error));
}

function searchCharacter(character) {
  // Function to search by Chinese character (simplified or traditional)
  const searchValue = character
    ? character
    : document.getElementById("search").value;
  const result = dictionary[searchValue];

  if (result) {
    displayResult(searchValue, result);
  } else {
    displayNoResult();
  }
}

// Function to search by a sentence in English
async function searchBySentence(targetLanguage) {
  const sentence = document
    .getElementById(
      targetLanguage === "zh" ? "sentenceSearch" : "chineseSearch"
    )
    .value.toLowerCase();

  fetch(`/api/translate/${targetLanguage}/${sentence}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //   callback(data);
    })
    .catch((error) => console.error("Error saving dictionary:", error));
}

// Function to process each word in the sentence
function processSentence(sentence) {
  const characters = [];
  const words = sentence.split(" "); // Split the sentence into individual words
  chinese = [];
  words.forEach((word) => {
    searchHanziByEnglish(word, (html) => {
      displayFoundCharacters();
    });
    // Call searchHanziByEnglish for each word
  });
  return characters;
}

function searchHanziByEnglish(englishTerm, callback) {
  // scrapes html from english search.
  const searchValue = englishTerm
    ? englishTerm
    : document.getElementById("englishSearch").value.toLowerCase();

  fetch(`/api/englishtohanzi/${searchValue}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const webResults = document.getElementById("web-results");
      webResults.innerHTML = data.html;
      callback(data);
    })
    .catch((error) => console.error("Error saving dictionary:", error));
}

// Function to search by English meaning
function searchByEnglish() {
  const searchValue = document
    .getElementById("englishSearch")
    .value.toLowerCase();

  searchHanziByEnglish(searchValue, (data) => {
    searchCharacter(data.updatedCharacter.simplified);
    // find character in local dictionary
  });

  let foundEntry = null;
  let foundKey = null;

  // Iterate over the dictionary to find the corresponding English definition
  for (const key in dictionary) {
    const definitions = dictionary[key].definitions;
    for (const pinyin in definitions) {
      if (definitions[pinyin].toLowerCase().includes(searchValue)) {
        foundEntry = dictionary[key];
        foundKey = key;
        break;
      }
    }
    if (foundEntry) break;
  }

  if (foundEntry) {
    displayResult(foundKey, foundEntry);
  } else {
    displayNoResult();
  }
}

// Function to search by Powhatan meaning
function searchByPowhatan() {
  const searchValue = document
    .getElementById("powhatanSearch")
    .value.toLowerCase();
  let foundEntry = null;
  let foundKey = null;

  // Iterate over the dictionary to find the corresponding Powhatan definition
  for (const key in dictionary) {
    const powhatanDefinition = dictionary[key].powhatan || "";
    if (powhatanDefinition.toLowerCase().includes(searchValue)) {
      foundEntry = dictionary[key];
      foundKey = key;
      break;
    }
  }

  if (foundEntry) {
    displayResult(foundKey, foundEntry);
  } else {
    displayNoResult();
  }
}

// Function to display a result with Powhatan data
function displayResult(character, result) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Build the result HTML
  let resultHTML = `
          <div class="result">
              <p><strong>Character:</strong> ${character}</p>
              <p><strong>Simplified:</strong> ${result.simplified}</p>
              <p><strong>Traditional:</strong> ${result.traditional}</p>
              <p><strong>Pinyin:</strong> ${result.pinyin.join(", ")}</p>
              <p><strong>Definitions:</strong></p>
              <ul>
      `;

  // Add each pinyin and its definition
  result.pinyin.forEach((pinyin) => {
    resultHTML += `<li><strong>${pinyin}:</strong> ${result.definitions[pinyin]}</li>`;
  });

  // Add Powhatan fields if available
  resultHTML += `</ul><p><strong>Powhatan Definition:</strong> ${
    result.powhatanDefinition || "Not available"
  }</p>`;
  resultHTML += `<p><strong>Powhatan Origin:</strong> ${
    result.powhatanOrigin || "Not available"
  }</p>`;
  resultHTML += `<p><strong>Powhatan Source:</strong> ${
    result.powhatanSource || "Not available"
  }</p>`;

  // Add Maya image and text if available
  if (result.maya && result.maya.image) {
    resultHTML += `
              <p><strong>Maya Image:</strong></p>
              <img src="${result.maya.image}" alt="Maya image for ${character}" style="max-width: 200px;">
          `;
    if (result.maya.text) {
      resultHTML += `<p><strong>Maya Image Text:</strong> ${result.maya.text}</p>`;
    }
  } else {
    resultHTML += `<p><strong>Maya Image:</strong> Not available</p>`;
  }

  // Add subcomponents if available
  if (result.subcomponents) {
    resultHTML += `<p><strong>Subcomponents:</strong></p><ul>`;
    result.subcomponents.forEach((subcomponent) => {
      const char = Object.keys(subcomponent)[0]; // Extract the character
      const meaning = subcomponent[char]; // Extract its meaning
      resultHTML += `<li><strong>${char}:</strong> ${meaning}</li>`;
    });
    resultHTML += `</ul>`;
  } else {
    resultHTML += `<p><strong>Subcomponents:</strong> Not available</p>`;
  }

  resultsDiv.innerHTML += resultHTML;
}

// Function to update Powhatan definition with new fields
function updatePowhatan() {
  const character = document.getElementById("character").value;
  const powhatanDefinition =
    document.getElementById("powhatanDefinition").value;
  const powhatanOrigin = document.getElementById("powhatanOrigin").value;
  const powhatanSource = document.getElementById("powhatanSource").value;

  // Check if the character exists in the dictionary
  if (dictionary[character]) {
    // Update the Powhatan fields
    dictionary[character].powhatanDefinition = powhatanDefinition
      ? powhatanDefinition
      : dictionary[character].powhatanDefinition;
    dictionary[character].powhatanOrigin = powhatanOrigin
      ? powhatanOrigin
      : dictionary[character].powhatanOrigin;
    dictionary[character].powhatanSource = powhatanSource
      ? powhatanSource
      : dictionary[character].powhatanSource;

    updateDictionary(character, dictionary[character]);

    // Display updated result
    displayResult(character, dictionary[character]);

    alert("Powhatan definition updated successfully.");
  } else {
    alert("Character not found in the dictionary.");
  }
}

// Function to update Maya image link
function updateMaya() {
  const character = document.getElementById("mayaCharacter").value;
  const mayaImageLink = document.getElementById("mayaImageLink").value;
  const mayaImageText = document.getElementById("mayaImageText").value;

  // Check if the character exists in the dictionary
  if (dictionary[character]) {
    dictionary[character].maya = mayaImageLink;
    dictionary[character].maya = {
      image: mayaImageLink,
      text: mayaImageText,
    };

    updateDictionary(character, dictionary[character]);

    // Display updated result
    displayResult(character, dictionary[character]);

    alert("Maya image updated successfully.");
  } else {
    alert("Character not found in the dictionary.");
  }
}
