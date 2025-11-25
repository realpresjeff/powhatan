// text-to-leet.js
const readline = require('readline');

// Basic leet mapping
const leetMap = {
    A: '4',
    B: ['8', '13'],
    C: '(',
    D: '[)',
    E: '3',
    F: '|=',
    G: '6',
    H: ['#', '|-|'],
    I: ['1', '|'],
    J: ['.]'],
    K: '|<',
    L: '1',
    M: '|Y|',
    N: '/\\/',
    O: '0',
    P: '|>',
    Q: 'O,',
    R: '12',
    S: '5',
    T: ['7', '+'],
    U: '|_|',
    V: '\\/',
    W: "\\v/",
    X: '}{',
    Y: '`/',
    Z: '2'
};

// Function to convert text to leet
function textToLeet(text) {
    return text
        .toUpperCase()
        .split('')
        .map(char => {
            const leetChar = leetMap[char] || char;
            // If it's an array, pick a random element
            if (Array.isArray(leetChar)) {
                return leetChar[Math.floor(Math.random() * leetChar.length)];
            }
            return leetChar;
        })
        .join('');
}


// Check if user passed text as command line argument
const inputText = process.argv.slice(2).join(' ');

if (inputText) {
    console.log('Leet version:', textToLeet(inputText));
} else {
    // Otherwise, ask for input interactively
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter text to convert to leet: ', input => {
        console.log('Leet version:', textToLeet(input));
        rl.close();
    });
}