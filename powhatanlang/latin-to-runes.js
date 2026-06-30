#!/usr/bin/env node
/**
 * english-to-runes.js
 * Usage:
 *   node english-to-runes.js "The quick brown fox"
 *   node english-to-runes.js --mode=futhorc "The quick brown fox"
 *
 * Modes:
 *   elder   = Elder Futhark approximation (default)
 *   futhorc = Anglo-Saxon Futhorc approximation (better for English)
 */

const args = process.argv.slice(2);
const modeArg = args.find(a => a.startsWith("--mode="));
const mode = (modeArg ? modeArg.split("=")[1] : "elder").toLowerCase();
const input = args.filter(a => !a.startsWith("--mode=")).join(" ");

if (!input) {
    console.error(`Usage: node english-to-runes.js [--mode=elder|futhorc] "text"`);
    process.exit(1);
}

// ----------------------
// Rune maps
// ----------------------

// Common runes shared/usable for both modes (we’ll layer mode-specific choices)
const COMMON = {
    // consonants
    b: "ᛒ",
    c: "ᚳ", // treat c as k
    d: "ᛞ",
    f: "ᚠ",
    g: "ᚷ",
    h: "ᚺ",
    j: "ᛃ", // approximate as y/j
    k: "ᚲ",
    l: "ᛚ",
    m: "ᛗ",
    n: "ᚾ",
    p: "ᛈ",
    q: "ᚲᚹ", // kw
    r: "ᚱ",
    s: "ᛊ",
    t: "ᛏ",
    v: "ᚠ",  // v often mapped to f in rune approximations
    w: "ᚹ",
    x: "ᚲᛊ", // ks
    y: "ᛃ",
    z: "ᛉ",

    // vowels (simple)
    a: "ᚨ",
    e: "ᛖ",
    i: "ᛁ",
    o: "ᛟ",
    u: "ᚢ",
};

// Elder Futhark-ish choices
const ELDER = {
    ...COMMON,
    // often people map 'th' to ᚦ even in elder
    thorn: "ᚦ",
    ng: "ᛜ",
    // elder has no dedicated 'æ/ea' like futhorc, approximate:
    ae: "ᚨᛖ",
    ea: "ᛖᚨ",
    io: "ᛁᛟ",
    st: "ᛊᛏ",
};

// Anglo-Saxon Futhorc choices (more English-friendly)
const FUTHORC = {
    ...COMMON,
    thorn: "ᚦ",
    ng: "ᛝ",   // Ing rune often used for /ŋ/
    // extra vowel runes in futhorc:
    ae: "ᚫ",   // Æsc
    ea: "ᛠ",   // Ear (often used in mappings)
    a_long: "ᚪ", // Āc (optional usage)
    y_rounded: "ᚣ", // Ȳr (optional usage)
    io: "ᛡ",   // Īor
    st: "ᛥ",   // Stan (late futhorc)
};

// Select active map
const MAP = mode === "futhorc" ? FUTHORC : ELDER;

// ----------------------
// Replacement rules
// Order matters (longer first)
// ----------------------
const RULES = [
    // common digraphs/trigraphs
    { re: /tion/g, out: "ᛏᛁᛟᚾ" }, // rough approximation
    { re: /th/g, out: MAP.thorn },
    { re: /ng/g, out: MAP.ng },
    { re: /qu/g, out: "ᚲᚹ" },      // kw
    { re: /ck/g, out: "ᚲ" },
    { re: /sh/g, out: "ᛊᚺ" },      // approximate
    { re: /ch/g, out: "ᚳ" },        // if futhorc, ᚳ is cen; in elder this is still OK as an approximation
    { re: /ph/g, out: "ᚠ" },
    { re: /ee/g, out: "ᛁ" },        // long i/ee approximation
    { re: /oo/g, out: "ᚢ" },        // long u/oo approximation

    // futhorc vowel combos
    { re: /ae/g, out: MAP.ae ?? "ᚨᛖ" },
    { re: /ea/g, out: MAP.ea ?? "ᛖᚨ" },
    { re: /io/g, out: MAP.io ?? "ᛁᛟ" },

    // clusters
    { re: /st/g, out: MAP.st ?? "ᛊᛏ" },
];

// ----------------------
// Convert
// ----------------------
function englishToRunes(text) {
    let t = text.toLowerCase();

    // keep punctuation/spaces; we’ll only replace letters
    // apply digraph rules first
    for (const rule of RULES) t = t.replace(rule.re, rule.out);

    // then map remaining single letters
    let out = "";
    for (const ch of t) {
        if (/[a-z]/.test(ch)) {
            out += MAP[ch] ?? ch; // fallback: keep if unknown
        } else {
            out += ch; // spaces, punctuation, numbers
        }
    }
    return out;
}

const result = englishToRunes(input);

console.log(result);
