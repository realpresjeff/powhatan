let dictionary = {};

// Fetch the dictionary data from JSON
fetch('./dictionary.json')
    .then(response => response.json())
    .then(data => {
        dictionary = data;
    })
    .catch(error => console.error('Error loading dictionary:', error));

// Function to search by Chinese character (simplified or traditional)
function searchCharacter() {
    const searchValue = document.getElementById('search').value;
    const result = dictionary[searchValue];

    if (result) {
        displayResult(searchValue, result);
    } else {
        displayNoResult();
    }
}

// Function to search by English meaning
function searchByEnglish() {
    const searchValue = document.getElementById('englishSearch').value.toLowerCase();
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
    const searchValue = document.getElementById('powhatanSearch').value.toLowerCase();
    let foundEntry = null;
    let foundKey = null;

    // Iterate over the dictionary to find the corresponding Powhatan definition
    for (const key in dictionary) {
        const powhatanDefinition = dictionary[key].powhatan || '';
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

// Function to display a result
function displayResult(character, result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    // Build the result HTML
    let resultHTML = `
        <div class="result">
            <p><strong>Character:</strong> ${character}</p>
            <p><strong>Simplified:</strong> ${result.simplified}</p>
            <p><strong>Traditional:</strong> ${result.traditional}</p>
            <p><strong>Pinyin:</strong> ${result.pinyin.join(', ')}</p>
            <p><strong>Definitions:</strong></p>
            <ul>
    `;

    // Add each pinyin and its definition
    result.pinyin.forEach(pinyin => {
        resultHTML += `<li><strong>${pinyin}:</strong> ${result.definitions[pinyin]}</li>`;
    });

    // Add Powhatan definition if available
    resultHTML += `</ul><p><strong>Powhatan Definition:</strong> ${result.powhatan || 'Not available'}</p>`;

    // Add Maya image if available
    if (result.maya) {
        resultHTML += `<p><strong>Maya Image:</strong></p><img src="${result.maya}" alt="Maya image for ${character}" style="max-width: 200px;">`;
    } else {
        resultHTML += `<p><strong>Maya Image:</strong> Not available</p>`;
    }
    
    resultHTML += `</div><hr>`;
    resultsDiv.innerHTML = resultHTML;
}

function displayResult(character, result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    // Build the result HTML
    let resultHTML = `
        <div class="result">
            <p><strong>Character:</strong> ${character}</p>
            <p><strong>Simplified:</strong> ${result.simplified}</p>
            <p><strong>Traditional:</strong> ${result.traditional}</p>
            <p><strong>Pinyin:</strong> ${result.pinyin.join(', ')}</p>
            <p><strong>Definitions:</strong></p>
            <ul>
    `;

    // Add each pinyin and its definition
    result.pinyin.forEach(pinyin => {
        resultHTML += `<li><strong>${pinyin}:</strong> ${result.definitions[pinyin]}</li>`;
    });

    // Add Powhatan definition if available
    resultHTML += `</ul><p><strong>Powhatan Definition:</strong> ${result.powhatan || 'Not available'}</p>`;

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

    resultHTML += `</div><hr>`;
    resultsDiv.innerHTML = resultHTML;
}

// Function to update Powhatan definition
function updatePowhatan() {
    const character = document.getElementById('character').value;
    const powhatanDefinition = document.getElementById('powhatanDefinition').value;

    // Check if the character exists in the dictionary
    if (dictionary[character]) {
        dictionary[character].powhatan = powhatanDefinition;

        // Display updated result
        displayResult(character, dictionary[character]);

        alert('Powhatan definition updated successfully.');
    } else {
        alert('Character not found in the dictionary.');
    }
}

// Function to update Maya image link
function updateMaya() {
    const character = document.getElementById('mayaCharacter').value;
    const mayaImageLink = document.getElementById('mayaImageLink').value;
    const mayaImageText = document.getElementById('mayaImageText').value;

    // Check if the character exists in the dictionary
    if (dictionary[character]) {
        dictionary[character].maya = mayaImageLink;
        dictionary[character].maya = {
            image: mayaImageLink,
            text: mayaImageText
        };

        // Display updated result
        displayResult(character, dictionary[character]);

        alert('Maya image updated successfully.');
    } else {
        alert('Character not found in the dictionary.');
    }
}
