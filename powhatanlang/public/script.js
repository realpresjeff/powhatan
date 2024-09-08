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
    
    resultHTML += `</div><hr>`;
    resultsDiv.innerHTML = resultHTML;
}

// Function to handle no result found
function displayNoResult() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>No results found</p>';
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
