// zero dependency, node v12 web scraper

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load the dictionary file
const dictionaryPath = path.join(__dirname, 'dictionary.json');
const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

// Function to fetch subcomponents for a given English meaning from HanziHero using https
async function getSubcomponentsFromHanziHero(englishMeaning) {
    return new Promise((resolve, reject) => {
        const url = `https://hanzihero.com/simplified/components/${encodeURIComponent(englishMeaning)}`;

        https.get(url, (response) => {
            let data = '';

            // Collect response data
            response.on('data', chunk => {
                data += chunk;
            });

            // When the response is complete
            response.on('end', () => {
                try {
                    // Regular expressions to match subcomponents
                    const originalCharacterMeaningRegex = /<h2 class="text-3xl text-slate-600 sm:text-5xl">([^<]+)<\/h2>/;
                    const characterRegex = /<span lang="zh-Hans" class="text-3xl h-12 w-12 font-noto-sc  flex items-center justify-center text-center text-white">([^<]+)<\/span>/g;
                    const englishRegex = /<span class="pl-1 text-xl font-light capitalize text-slate-500">([^<]+)<\/span>/g;

                    // Extract original character meaning
                    const originalCharacterMeaningMatch = originalCharacterMeaningRegex.exec(data);
                    const originalCharacterMeaning = originalCharacterMeaningMatch ? originalCharacterMeaningMatch[1].trim() : null;

                    let subcomponents = [];
                    let characterMatch, englishMatch;

                    // Extract subcomponents
                    while ((characterMatch = characterRegex.exec(data)) && (englishMatch = englishRegex.exec(data))) {
                        const characterText = characterMatch[1].trim();
                        const englishText = englishMatch[1].trim();

                        subcomponents.push({ character: characterText, english: englishText });
                    }

                    const result = {
                        originalCharacterMeaning,
                        subcomponents
                    }

                    console.log(result);
                    resolve(result);
                } catch (error) {
                    reject(`Error parsing data for ${englishMeaning}: ${error.message}`);
                }
            });

        }).on('error', (error) => {
            reject(`Error fetching subcomponents for ${englishMeaning}: ${error.message}`);
        });
    });
}

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
updateDictionary("heaven");
