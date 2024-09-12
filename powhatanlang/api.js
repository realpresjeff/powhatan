// zero dependency, node v12 web scraper

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load the dictionary file
const dictionaryPath = path.join(__dirname, 'dictionary.json');
const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

// Function to fetch subcomponents for a given English meaning from HanziHero using https


// Function to update each character entry with its subcomponents
async function updateCharacterWithSubcomponents(character, subcomponents) {
    if (subcomponents.length > 0) {
        dictionary[character].subcomponents = subcomponents;
        console.log(`Updated ${character} with subcomponents: ${JSON.stringify(subcomponents)}`);
    } else {
        console.log(`No subcomponents found for ${character}`);
    }
}

async function updateDictionary(englishMeaning) {
    try {
        const { subcomponents } = await getSubcomponentsFromHanziHero(englishMeaning);

        // Assuming you want to update a specific character
        // For demonstration, you may need to update all relevant characters in the dictionary
        // Here, just showing an example of updating a specific character
        const characterToUpdate = '天'; // Example character to update, replace as needed
        await updateCharacterWithSubcomponents(characterToUpdate, subcomponents);

        // Write the updated dictionary back to the file
        fs.writeFileSync(dictionaryPath, JSON.stringify(dictionary, null, 2), 'utf8');
        console.log('Dictionary updated successfully!');
    } catch (error) {
        console.error(error);
    }
}

// Example call
// updateDictionary("heaven");
