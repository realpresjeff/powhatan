// Define the structure for Animal stats
interface Animal {
    name: string;
    hp: number;
    stats: {
      magic: number;
      defense: number;
      strength: number;
      archery: number;
    };
    xp: number; // Experience level or equivalent strength
    abilities: string[]; // Abilities the animal has
    drops: string[]; // Items dropped by the animal
  }
  
  // Example animals with various characteristics
  
  const animals: Animal[] = [
    {
      name: "Phoenix",
      hp: 200,
      stats: {
        magic: 10,
        defense: 5,
        strength: 7,
        archery: 0,
      },
      xp: 10000000, // 10M XP (stronger animal)
      abilities: ["Healing", "Fireball", "Rebirth"],
      drops: ["Phoenix Feather", "Ashes of Rebirth"],
    },
    {
      name: "Dire Wolf",
      hp: 150,
      stats: {
        magic: 2,
        defense: 8,
        strength: 12,
        archery: 0,
      },
      xp: 5000000, // 5M XP (mid-tier animal)
      abilities: ["Howl", "Charge"],
      drops: ["Wolf Pelt", "Dire Fang"],
    },
    {
      name: "Dragon",
      hp: 500,
      stats: {
        magic: 15,
        defense: 12,
        strength: 20,
        archery: 5,
      },
      xp: 20000000, // 20M XP (high-tier mythical beast)
      abilities: ["Flame Breath", "Flight", "Roar"],
      drops: ["Dragon Scale", "Dragon Heart", "Dragon Claw"],
    },
    {
      name: "Bear",
      hp: 180,
      stats: {
        magic: 0,
        defense: 10,
        strength: 15,
        archery: 0,
      },
      xp: 4000000, // 4M XP (strong animal)
      abilities: ["Berserk", "Maul"],
      drops: ["Bear Pelt", "Bear Claw", "Honeycomb"],
    },
    {
      name: "Snake",
      hp: 80,
      stats: {
        magic: 3,
        defense: 2,
        strength: 5,
        archery: 0,
      },
      xp: 2000000, // 2M XP (low-tier animal)
      abilities: ["Poison Bite", "Constrict"],
      drops: ["Snake Skin", "Venom Sac"],
    },
    {
      name: "Giant Spider",
      hp: 120,
      stats: {
        magic: 0,
        defense: 4,
        strength: 8,
        archery: 2,
      },
      xp: 3000000, // 3M XP (moderate-tier animal)
      abilities: ["Web Trap", "Poisonous Bite"],
      drops: ["Spider Silk", "Venom Gland", "Giant Spider Leg"],
    },
    {
      name: "Griffin",
      hp: 300,
      stats: {
        magic: 8,
        defense: 10,
        strength: 18,
        archery: 6,
      },
      xp: 15000000, // 15M XP (strong mythical beast)
      abilities: ["Claw Swipe", "Flight", "Beak Attack"],
      drops: ["Griffin Feather", "Griffin Claw", "Golden Beak"],
    },
    {
      name: "Minotaur",
      hp: 400,
      stats: {
        magic: 0,
        defense: 15,
        strength: 25,
        archery: 0,
      },
      xp: 12000000, // 12M XP (high-tier mythical beast)
      abilities: ["Charge", "Smash", "Rage"],
      drops: ["Minotaur Horn", "Minotaur Hide", "Labyrinth Key"],
    },
    {
      name: "Manticore",
      hp: 350,
      stats: {
        magic: 6,
        defense: 12,
        strength: 22,
        archery: 5,
      },
      xp: 16000000, // 16M XP (powerful mythical beast)
      abilities: ["Tail Sting", "Venomous Bite", "Screech"],
      drops: ["Manticore Tail", "Manticore Claw", "Golden Mane"],
    },
    {
      name: "Wolf",
      hp: 100,
      stats: {
        magic: 1,
        defense: 4,
        strength: 8,
        archery: 0,
      },
      xp: 1000000, // 1M XP (low-tier animal)
      abilities: ["Howl", "Pack Tactics"],
      drops: ["Wolf Pelt", "Wolf Fang"],
    },
    {
      name: "Elephant Ghost",
      hp: 600,
      stats: {
        magic: 0,
        defense: 18,
        strength: 30,
        archery: 0,
      },
      xp: 8000000, // 8M XP (large, strong animal)
      abilities: ["Stampede", "Charge"],
      drops: ["Elephant Tusk", "Elephant Hide", "Elephant Meat"],
    }
  ];
  
  