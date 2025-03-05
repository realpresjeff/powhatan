// Enum to represent the base race of characters
enum BaseRace {
    NativeAmerican = "Native American",
    European = "European",
    African = "African",
    Asian = "Asian"
  }
  
  // Enum for Pilgrim origins
  enum PilgrimOrigin {
    British = "British",
    Irish = "Irish",
    French = "French",
    Spanish = "Spanish",
    Dutch = "Dutch"
  }
  
  // Types for mixed races using tuple types
  type Mestizo = [BaseRace.European, BaseRace.NativeAmerican];
  type Zambo = [BaseRace.African, BaseRace.NativeAmerican];
  type Mulatto = [BaseRace.European, BaseRace.African];
  type OtherMixedRace = [BaseRace.NativeAmerican, BaseRace.African, BaseRace.European | BaseRace.Asian]; // Example of a more complex mix
  
  // Interface to represent the Race
  interface Race {
    name: string;
    region: string;
    description: string;
    baseRace: BaseRace | Mestizo | Zambo | Mulatto | OtherMixedRace;
    baseStatBoost: string[];
    pilgrimOrigin?: PilgrimOrigin; // Optional for Pilgrims
  }
  
  // Define available skills for boosts
  const skillBoosts: string[] = [
    "Magic", "Archery", "Strength", "Defense", "HP", "Stamina", 
    "Blacksmithing", "Mining", "Construction", "Craft", "Fishing", "Cooking"
  ];
  
  // Define stat boosts based on race
  const raceStatBoosts: { [key: string]: string[] } = {
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
  const pilgrimBoosts: { [key in PilgrimOrigin]: string[] } = {
    [PilgrimOrigin.British]: ["Strength", "Craft", "Archery"], // Reflecting British medieval warfare and history
    [PilgrimOrigin.Irish]: ["Magic", "Craft", "Stamina"], // Reflecting Irish lore and mysticism
    [PilgrimOrigin.French]: ["Cooking", "Fishing", "Defense"], // Reflecting French culinary tradition and military history
    [PilgrimOrigin.Spanish]: ["Strength", "Archery", "Fishing"], // Reflecting Spanish exploration and military culture
    [PilgrimOrigin.Dutch]: ["Blacksmithing", "Mining", "Craft"], // Reflecting Dutch industry and craftsmanship
  };
  
  // Randomly select a stat boost for Mestizo, Zambo, and Mulatto races
  function getRandomBoost(boostList: string[]): string {
    const randomIndex = Math.floor(Math.random() * boostList.length);
    return boostList[randomIndex];
  }
  
  // Create an array of races with their specific stat boosts
  const races: Race[] = [
    {
      name: "Powhatan Indian",
      region: "Virginia, USA",
      description: "Native American group from the Chesapeake Bay area, known for their agricultural practices, fishing, and cultural traditions under the Powhatan Confederacy.",
      baseRace: BaseRace.NativeAmerican,
      baseStatBoost: raceStatBoosts.Powhatan
    },
    {
      name: "Taino (Dominican Republic)",
      region: "Caribbean (Dominican Republic, Puerto Rico, Cuba, Haiti)",
      description: "Indigenous people of the Caribbean, the Taino were the first to encounter Europeans, with a rich culture centered around farming, fishing, and spiritual beliefs.",
      baseRace: BaseRace.NativeAmerican,
      baseStatBoost: ["Fishing", "Cooking", "Defense"]
    },
    {
      name: "Pilgrims (British)",
      region: "North America",
      description: "The British Pilgrims were settlers who arrived in the Americas seeking religious freedom. Known for their endurance and connection to medieval traditions.",
      baseRace: BaseRace.European,
      baseStatBoost: pilgrimBoosts[PilgrimOrigin.British],
      pilgrimOrigin: PilgrimOrigin.British
    },
    {
      name: "Pilgrims (Irish)",
      region: "North America",
      description: "The Irish Pilgrims brought with them rich Celtic folklore and a deep connection to magical traditions.",
      baseRace: BaseRace.European,
      baseStatBoost: pilgrimBoosts[PilgrimOrigin.Irish],
      pilgrimOrigin: PilgrimOrigin.Irish
    },
    {
      name: "Pilgrims (French)",
      region: "North America",
      description: "French Pilgrims who were known for their strong ties to European military history and culinary arts.",
      baseRace: BaseRace.European,
      baseStatBoost: pilgrimBoosts[PilgrimOrigin.French],
      pilgrimOrigin: PilgrimOrigin.French
    },
    {
      name: "Pilgrims (Spanish)",
      region: "North America",
      description: "The Spanish Pilgrims arrived in the Americas with a history of exploration and military influence.",
      baseRace: BaseRace.European,
      baseStatBoost: pilgrimBoosts[PilgrimOrigin.Spanish],
      pilgrimOrigin: PilgrimOrigin.Spanish
    },
    {
      name: "Pilgrims (Dutch)",
      region: "North America",
      description: "Dutch Pilgrims who brought their expertise in craftsmanship, blacksmithing, and trade.",
      baseRace: BaseRace.European,
      baseStatBoost: pilgrimBoosts[PilgrimOrigin.Dutch],
      pilgrimOrigin: PilgrimOrigin.Dutch
    },
    {
      name: "Africans (West Africa, Central Africa, East Africa, Southern Africa)",
      region: "Africa",
      description: "A broad group of ethnicities originating from various parts of Africa, known for their cultural diversity, music, dance, agriculture, and ancestral spiritual practices.",
      baseRace: BaseRace.African,
      baseStatBoost: raceStatBoosts.African
    },
    {
      name: "Mestizo (European and Native American)",
      region: "Latin America",
      description: "A mixed group of European and Native American descent, primarily found in Latin America, representing a blend of European colonial influence and indigenous cultures.",
      baseRace: [BaseRace.European, BaseRace.NativeAmerican],  // This is the tuple type for Mestizo
      baseStatBoost: [
        getRandomBoost(["Archery", "Fishing", "Craft", "Stamina"]), // Random Native American Boost
        getRandomBoost(["Magic", "Strength", "Cooking", "Blacksmithing"]), // Random European Boost
        "Stamina" // Additional boost from the blend
      ]
    },
    {
      name: "Zambo (African and Native American)",
      region: "Latin America",
      description: "A mixed group of African and Native American descent, common in the Americas, especially in parts of Latin America and the Caribbean, with rich cultural and spiritual ties to both ancestries.",
      baseRace: [BaseRace.African, BaseRace.NativeAmerican],  // This is the tuple type for Zambo
      baseStatBoost: [
        getRandomBoost(["Strength", "HP", "Stamina"]), // Random African Boost
        getRandomBoost(["Fishing", "Defense", "Magic"]), // Random Native American Boost
        "Craft" // Additional boost from the blend
      ]
    },
    {
      name: "Mulatto (European and African)",
      region: "Americas",
      description: "A mixed group of African and European descent, common in the Americas, with a unique blend of African and European cultural influences.",
      baseRace: [BaseRace.European, BaseRace.African],  // This is the tuple type for Mulatto
      baseStatBoost: [
        getRandomBoost(["Magic", "Craft", "Stamina"]), // Random European Boost
        getRandomBoost(["Strength", "HP", "Defense"]), // Random African Boost
        "Fishing" // Additional boost from the blend
      ]
    },
    {
      name: "Navajo (Native American)",
      region: "Southwest USA",
      description: "The Navajo are one of the largest Native American tribes, known for their weaving, agriculture, and intricate spiritual beliefs tied to the earth and nature.",
      baseRace: BaseRace.NativeAmerican,
      baseStatBoost: ["Strength", "Archery", "Cooking"]
    }
  ];
  
  