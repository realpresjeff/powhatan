// Enum to represent the base race of characters
var Base_Race;
(function (Base_Race) {
    Base_Race["Native_American"] = "Native American";
    Base_Race["European"] = "European";
    Base_Race["African"] = "African";
    Base_Race["Asian"] = "Asian";
})(Base_Race || (Base_Race = {}));
// Enum for Pilgrim origins
var Pilgrim_Origin;
(function (Pilgrim_Origin) {
    Pilgrim_Origin["British"] = "British";
    Pilgrim_Origin["Irish"] = "Irish";
    Pilgrim_Origin["French"] = "French";
    Pilgrim_Origin["Spanish"] = "Spanish";
    Pilgrim_Origin["Dutch"] = "Dutch";
})(Pilgrim_Origin || (Pilgrim_Origin = {}));
// Define available skills for boosts
const skill_boosts = [
    "Magic", "Archery", "Strength", "Defense", "HP", "Stamina",
    "Blacksmithing", "Mining", "Construction", "Craft", "Fishing", "Cooking"
];
// Define stat boosts based on race
const race_stat_boosts = {
    Powhatan: ["Archery", "Defense", "Strength"],
    Cherokee: ["Defense", "Archery", "Craft"],
    African: ["Strength", "Defense", "HP"],
    Mestizo: ["Random Native American Boost", "Random European Boost", "Stamina"], // To be randomized
    Zambo: ["Random African Boost", "Random Native American Boost", "Craft"], // To be randomized
    Mulatto: ["Random European Boost", "Random African Boost", "Fishing"], // To be randomized
    Navajo: ["Strength", "Archery", "Cooking"],
    Iroquois: ["Defense", "Craft", "Fishing"],
    Sioux: ["Strength", "Stamina", "Fishing"],
    Apache: ["Stamina", "Stealth", "Blacksmithing"],
    Algonquin: ["Magic", "Defense", "Cooking"]
};
// Define Pilgrim boosts for each origin
const pilgrim_boosts = {
    [Pilgrim_Origin.British]: ["Strength", "Craft", "Archery"], // Reflecting British medieval warfare and history
    [Pilgrim_Origin.Irish]: ["Magic", "Craft", "Stamina"], // Reflecting Irish lore and mysticism
    [Pilgrim_Origin.French]: ["Cooking", "Fishing", "Defense"], // Reflecting French culinary tradition and military history
    [Pilgrim_Origin.Spanish]: ["Strength", "Archery", "Fishing"], // Reflecting Spanish exploration and military culture
    [Pilgrim_Origin.Dutch]: ["Blacksmithing", "Mining", "Craft"], // Reflecting Dutch industry and craftsmanship
};
// Randomly select a stat boost for Mestizo, Zambo, and Mulatto races
function get_random_boost(boost_list) {
    const random_index = Math.floor(Math.random() * boost_list.length);
    return boost_list[random_index];
}
// Create an array of races with their specific stat boosts
const races = [
    {
        name: "Powhatan Indian",
        region: "Virginia, USA",
        description: "Native American group from the Chesapeake Bay area, known for their agricultural practices, fishing, and cultural traditions under the Powhatan Confederacy.",
        base_race: Base_Race.Native_American,
        base_stat_boost: race_stat_boosts.Powhatan
    },
    {
        name: "Taino (Dominican Republic)",
        region: "Caribbean (Dominican Republic, Puerto Rico, Cuba, Haiti)",
        description: "Indigenous people of the Caribbean, the Taino were the first to encounter Europeans, with a rich culture centered around farming, fishing, and spiritual beliefs.",
        base_race: Base_Race.Native_American,
        base_stat_boost: ["Fishing", "Cooking", "Defense"]
    },
    {
        name: "Pilgrims (British)",
        region: "North America",
        description: "The British Pilgrims were settlers who arrived in the Americas seeking religious freedom. Known for their endurance and connection to medieval traditions.",
        base_race: Base_Race.European,
        base_stat_boost: pilgrim_boosts[Pilgrim_Origin.British],
        pilgrim_origin: Pilgrim_Origin.British
    },
    {
        name: "Pilgrims (Irish)",
        region: "North America",
        description: "The Irish Pilgrims brought with them rich Celtic folklore and a deep connection to magical traditions.",
        base_race: Base_Race.European,
        base_stat_boost: pilgrim_boosts[Pilgrim_Origin.Irish],
        pilgrim_origin: Pilgrim_Origin.Irish
    },
    {
        name: "Pilgrims (French)",
        region: "North America",
        description: "French Pilgrims who were known for their strong ties to European military history and culinary arts.",
        base_race: Base_Race.European,
        base_stat_boost: pilgrim_boosts[Pilgrim_Origin.French],
        pilgrim_origin: Pilgrim_Origin.French
    },
    {
        name: "Pilgrims (Spanish)",
        region: "North America",
        description: "The Spanish Pilgrims arrived in the Americas with a history of exploration and military influence.",
        base_race: Base_Race.European,
        base_stat_boost: pilgrim_boosts[Pilgrim_Origin.Spanish],
        pilgrim_origin: Pilgrim_Origin.Spanish
    },
    {
        name: "Pilgrims (Dutch)",
        region: "North America",
        description: "Dutch Pilgrims who brought their expertise in craftsmanship, blacksmithing, and trade.",
        base_race: Base_Race.European,
        base_stat_boost: pilgrim_boosts[Pilgrim_Origin.Dutch],
        pilgrim_origin: Pilgrim_Origin.Dutch
    },
    {
        name: "Africans (West Africa, Central Africa, East Africa, Southern Africa)",
        region: "Africa",
        description: "A broad group of ethnicities originating from various parts of Africa, known for their cultural diversity, music, dance, agriculture, and ancestral spiritual practices.",
        base_race: Base_Race.African,
        base_stat_boost: race_stat_boosts.African
    },
    {
        name: "Mestizo (European and Native American)",
        region: "Latin America",
        description: "A mixed group of European and Native American descent, primarily found in Latin America, representing a blend of European colonial influence and indigenous cultures.",
        base_race: [Base_Race.European, Base_Race.Native_American], // This is the tuple type for Mestizo
        base_stat_boost: [
            get_random_boost(["Archery", "Fishing", "Craft", "Stamina"]), // Random Native American Boost
            get_random_boost(["Magic", "Strength", "Cooking", "Blacksmithing"]), // Random European Boost
            "Stamina" // Additional boost from the blend
        ]
    },
    {
        name: "Zambo (African and Native American)",
        region: "Latin America",
        description: "A mixed group of African and Native American descent, common in the Americas, especially in parts of Latin America and the Caribbean, with rich cultural and spiritual ties to both ancestries.",
        base_race: [Base_Race.African, Base_Race.Native_American], // This is the tuple type for Zambo
        base_stat_boost: [
            get_random_boost(["Strength", "HP", "Stamina"]), // Random African Boost
            get_random_boost(["Fishing", "Defense", "Magic"]), // Random Native American Boost
            "Craft" // Additional boost from the blend
        ]
    },
    {
        name: "Mulatto (European and African)",
        region: "Americas",
        description: "A mixed group of African and European descent, common in the Americas, with a unique blend of African and European cultural influences.",
        base_race: [Base_Race.European, Base_Race.African], // This is the tuple type for Mulatto
        base_stat_boost: [
            get_random_boost(["Magic", "Craft", "Stamina"]), // Random European Boost
            get_random_boost(["Strength", "HP", "Defense"]), // Random African Boost
            "Fishing" // Additional boost from the blend
        ]
    },
    {
        name: "Navajo (Native American)",
        region: "Southwest USA",
        description: "The Navajo are one of the largest Native American tribes, known for their weaving, agriculture, and intricate spiritual beliefs tied to the earth and nature.",
        base_race: Base_Race.Native_American,
        base_stat_boost: ["Strength", "Archery", "Cooking"]
    }
];
