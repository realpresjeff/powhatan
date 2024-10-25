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

function searchHanziByEnglish(englishTerm, callback) {
  // scrapes html from english search.
  const searchValue = englishTerm
    ? englishTerm
    : document.getElementById("englishSearch").value.toLowerCase();

  showLoadingIndicator(true);

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
      showLoadingIndicator(false);
    })
    .catch((error) => console.error("Error saving dictionary:", error));
}

function getSubcomponents(char) {
  const subcomponents = document.getElementById("web-results-subcomponents");
  subcomponents.innerHTML = "";
  // Send updated dictionary to the server
  fetch(`/api/subcomponents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ char }),
  })
    .then((response) => response.json())
    .then((data) => {
      subcomponents.innerHTML = data.subcomponents;
    })
    .catch((error) => console.error("Error fetching subcomponents:", error));
}

function searchCharacter(character) {
  // Function to search by Chinese character (simplified or traditional)
  const result = dictionary[character];

  if (result) {
    displayResult(character, result);
    return result;
  } else {
    // displayNoResult();
  }
}

let englishwordsprocessed = 0;
// Function to search by English meaning
function searchByEnglish(query) {
  const searchValue = query
    ? query
    : document.getElementById("englishSearch").value.toLowerCase();

  searchHanziByEnglish(searchValue, (data) => {
    const character = document
      .querySelector("#web-results .font-noto-sc")
      .textContent.trim();
    const sentence = document.getElementById("chineseSentence");

    if (translating) {
      sentence.value = sentence.value += character;
    } else {
      sentence.value = character;
    }

    if (!translating) {
      processChineseSentence();
    }

    englishwordsprocessed++;

    if (englishwordsprocessed == indexProcessed) {
      processChineseSentence();
    }
  });
}

function searchEnglishLocal() {
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
    displaySentenceCharacters(foundKey);
  } else {
    // displayNoResult();
  }
}

// Function to search by Powhatan meaning
function searchByPowhatan(word) {
  const searchValue = word
    ? word
    : document.getElementById("powhatanSearch").value.toLowerCase();
  let foundEntry = null;
  let foundKey = null;

  // Iterate over the dictionary to find the corresponding Powhatan definition
  // loop 1
  for (const key in dictionary) {
    const powhatanDefinition = dictionary[key].powhatan || "";
    if (powhatanDefinition.toLowerCase() === searchValue) {
      foundEntry = dictionary[key];
      foundKey = key;
      break;
    }
  }

  if (!foundKey) {
    // loop 2
    for (const key in dictionary) {
      const powhatanDefinition = dictionary[key].powhatan || "";
      if (powhatanDefinition.toLowerCase().includes(searchValue)) {
        foundEntry = dictionary[key];
        foundKey = key;
        break;
      }
    }
  }

  if (foundEntry) {
    displayResult(foundKey, foundEntry);
    displaySentenceCharacters(foundKey);
  } else {
    // displayNoResult();
  }
}

let translating;
let indexProcessed = 0;
function processSentence(mode) {
  // english or powhatan
  if (sentenceCharacters.length) {
    sentenceCharacters = [];
  }

  let searchValue;

  if (mode === "powhatan") {
    searchValue = document.getElementById("powhatanSearch").value.toLowerCase();
  } else {
    searchValue = document.getElementById("englishSearch").value.toLowerCase();
  }

  translating = true;
  const words = searchValue.split(" ");

  words.forEach((word, index) => {
    if (mode === "powhatan") {
      searchByPowhatan(word);
    } else {
      searchByEnglish(word);
    }

    indexProcessed++;
  });
}

// Function to display a result with Powhatan data
function displayResult(character, result) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Build the result HTML
  let resultHTML = `
          <div class="result">
              <p id="chinese-simplified-character"><strong>Character:</strong> ${character}</p>
              <p><strong>Simplified:</strong> ${result.simplified}</p>
              <p><strong>Traditional:</strong> ${result.traditional}</p>
              <p><strong>Pinyin:</strong> ${
                result.pinyin ? result.pinyin.join(", ") : null
              }</p>
              <p><strong>Definitions:</strong></p>
              <ul>
      `;

  // Add each pinyin and its definition
  result.pinyin &&
    result.pinyin.forEach((pinyin) => {
      resultHTML += `<li><strong>${pinyin}:</strong> ${result.definitions[pinyin]}</li>`;
    });

  // Add Powhatan fields if available
  resultHTML += `</ul><p class="editable" id="powhatanDefinition" data-key="definition"><strong>Powhatan Definition:</strong> ${
    result.powhatan || "Not available"
  }</p>`;
  resultHTML += `<p class="editable" id="powhatanOrigin" data-key="origin"><strong>Powhatan Origin:</strong> ${
    result.powhatanOrigin || "Not available"
  }</p>`;
  resultHTML += `<p class="editable" id="powhatanSource" data-key="source"><strong>Powhatan Source:</strong> ${
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

  // Function to turn <p> content into an input field
  function makeEditable(event) {
    let spanElement = event.target;
    let key = spanElement.getAttribute("data-key");
    let fullText = spanElement.innerText;

    // Extract the text after the colon (":")
    let valueAfterColon = fullText.split(":")[1].trim();
    let textBeforeColon = fullText.split(":")[0].trim();

    // Create input element
    let input = document.createElement("input");
    input.type = "text";

    // Check if it's a valid URL
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const sourceUrl = fullText.match(urlPattern)
      ? fullText.match(urlPattern)[0]
      : null;

    if (sourceUrl) {
      input.value = sourceUrl;
    } else {
      input.value = valueAfterColon;
    }

    // Replace the span with the input
    let parentP = spanElement.parentNode;
    parentP.replaceChild(input, spanElement);

    // Focus the input
    input.focus();

    // When the input field loses focus (onblur), save the new value
    input.onblur = function () {
      // Function to convert text to camelCase
      function toCamelCase(str) {
        return str
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
      }

      let updatedValue = input.value;

      // Create a new <span> with the updated value
      let newSpan = document.createElement("p");
      newSpan.className = "editable";
      newSpan.setAttribute("data-key", key);

      newSpan.innerText = fullText.split(":")[0] + ": " + updatedValue;

      // Convert the text before the colon to camelCase and set it as the id
      newSpan.id = toCamelCase(textBeforeColon);

      // Replace input with the new <span>
      parentP.replaceChild(newSpan, input);

      // Add event listener to new span for editing again
      newSpan.addEventListener("click", makeEditable);

      updatePowhatan();
    };
  }

  // Add event listeners to all editable spans
  document.querySelectorAll(".editable").forEach((span) => {
    span.addEventListener("click", makeEditable);
  });
}

// Function to update Powhatan definition with new fields
function updatePowhatan() {
  const character = document
    .getElementById("chinese-simplified-character")
    .innerText.split(":")[1]
    .trim();
  const powhatanDefinition = document
    .getElementById("powhatanDefinition")
    .innerText.split(":")[1]
    .trim();
  const powhatanOrigin = document
    .getElementById("powhatanOrigin")
    .innerText.split(":")[1]
    .trim();
  const powhatanSource = document.getElementById("powhatanSource").innerText;
  // Check if it's a valid URL
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const sourceUrl = powhatanSource.match(urlPattern)
    ? powhatanSource.match(urlPattern)[0]
    : null;

  // Check if the character exists in the dictionary
  if (dictionary[character]) {
    // Update the Powhatan fields
    dictionary[character] = {
      ...dictionary[character],
      simplified: character,
      powhatan: powhatanDefinition
        ? powhatanDefinition
        : dictionary[character].powhatanDefinition,
      powhatanOrigin: powhatanOrigin
        ? powhatanOrigin
        : dictionary[character].powhatanOrigin,
      powhatanSource: sourceUrl
        ? sourceUrl
        : dictionary[character].powhatanSource,
    };

    alert("Powhatan definition updated successfully.");
  } else {
    dictionary[character] = {
      simplified: character,
      powhatan: powhatanDefinition,
      powhatanOrigin: powhatanOrigin,
      powhatanSource: sourceUrl,
    };

    alert("Character not found in the dictionary.");
  }

  updateDictionary(character, dictionary[character]);
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

// Function to process the pasted sentence
function processChineseSentence() {
  translating = false;
  const sentence = document.getElementById("chineseSentence").value.trim();

  if (!sentence) {
    alert("Please paste a Chinese sentence.");
    return;
  }

  // Split sentence into individual characters
  const characters = sentence.split("");

  // Call the function to display each character in a carousel
  displaySentenceCharacters(characters);
}

let currentCharacterIndex = 0;
let sentenceCharacters = [];

// Function to display the full sentence and enlarge the selected character
function displaySentenceCharacters(characters) {
  if (translating) {
    sentenceCharacters.push(characters);
  } else {
    sentenceCharacters = characters;
  }

  currentCharacterIndex = 0; // Reset the index
  updateCarousel(); // Initial update to show the sentence
  onClickCharacter();
}

// Function to update the displayed sentence in the carousel
function updateCarousel() {
  const carouselDiv = document.getElementById("carousel");
  carouselDiv.innerHTML = ""; // Clear previous sentence

  // Loop through the sentence characters and display them
  sentenceCharacters.forEach((char, index) => {
    const container = document.createElement("div");

    const powhatanDiv = document.createElement("div");
    powhatanDiv.className = "powhatan-translation";
    powhatanDiv.innerHTML = ""; // Clear previous Powhatan translation

    // Get the Powhatan translation for the selected character (assuming from dictionary)
    const powhatanTranslation = searchCharacter(char);

    // Display the Powhatan translation above the carousel
    if (powhatanTranslation) {
      powhatanDiv.innerText = `${powhatanTranslation.powhatan}`;
    } else {
      powhatanDiv.innerText = "";
    }

    // Create a span for each character
    const charSpan = document.createElement("span");
    charSpan.innerText = char;

    // If the character is the selected one, enlarge its font size
    if (index === currentCharacterIndex) {
      charSpan.style.fontSize = "72px"; // Enlarged font size for selected character
      charSpan.style.color = "red"; // Optional: Change color for emphasis
    } else {
      charSpan.style.fontSize = "24px"; // Default font size for other characters
    }

    // Set an onclick event to trigger local or web search
    charSpan.onclick = () => onClickCharacter(char, index);

    // Add the character span to the carousel div
    container.appendChild(powhatanDiv);
    container.appendChild(charSpan);
    carouselDiv.appendChild(container);

    // Add some spacing between characters
    if (index < sentenceCharacters.length - 1) {
      carouselDiv.appendChild(document.createTextNode(" ")); // Add space between characters
    }
  });
}

function onClickCharacter(char, index) {
  localSearch(char ? char : sentenceCharacters[currentCharacterIndex]);
  getSubcomponents(char ? char : sentenceCharacters[currentCharacterIndex]);

  if (typeof index === "number") {
    currentCharacterIndex = index;
    updateCarousel();
    onClickCharacter();
  }
}

// Function to navigate to the previous character
function prevCharacter() {
  if (currentCharacterIndex > 0) {
    currentCharacterIndex--;
    updateCarousel(); // Update the carousel view
    onClickCharacter();
  }
}

// Function to navigate to the next character
function nextCharacter() {
  if (currentCharacterIndex < sentenceCharacters.length - 1) {
    currentCharacterIndex++;
    updateCarousel(); // Update the carousel view
    onClickCharacter();
  }
}

// Function for local dictionary search
function localSearch(character) {
  if (dictionary[character]) {
    // Display the character info from the dictionary
    displayResult(character, dictionary[character]);
  } else {
    alert("Character not found in the dictionary.");
  }
}

document
  .getElementById("imageFile")
  .addEventListener("change", async function (e) {
    e.preventDefault();
    const fileInput = this;
    if (fileInput.files && fileInput.files.length > 0) {
      // Automatically submit the form as soon as a file is selected
      const formData = new FormData();
      const imageFile = document.getElementById("imageFile").files[0];

      if (!imageFile) {
        alert("Please select an image file.");
        return;
      }

      formData.append("imageFile", imageFile);

      try {
        const response = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
