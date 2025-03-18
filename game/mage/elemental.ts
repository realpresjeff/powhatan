const fireArrow = {
    name: "Fire Arrow",
    element: "Fire",
    type: "Direct",
    effect: "Shoots an arrow imbued with fire magic that can deal burn damage over time.",
    drain: 20,
    cooldown: 3,
    duration: 0,
    chargeable: true,
    charge_levels: {
        level_1: {
            damage: 30,
            burn_effect: 5,
            burn_duration: 5
        },
        level_2: {
            damage: 50,
            burn_effect: 10,
            burn_duration: 7,
            stun_duration: 1
        },
        level_3: {
            damage: 80,
            burn_effect: 20,
            burn_duration: 10,
            shock_effect: true
        }
    },
    charge_consumption: {
        level_1: 10,
        level_2: 20,
        level_3: 30
    },
    special_attack_bar: true,
    status_effects: [
        "Stun",
        "Burn",
        "Shock"
    ],
    aoe: false,
    elemental_interactions: {
        Water: {
            effect: "Creates steam, reducing visibility",
            function: "create_steam_effect"
        },
        Wind: {
            effect: "Blows the fire away, reducing damage",
            function: "reduce_fire_damage"
        },
        Earth: {
            effect: "Fire spreads slower on dirt or rocky terrain",
            function: "slow_fire_spread"
        }
    }
};

const flameWave = {
    name: "Flame Wave",
    element: "Fire",
    type: "AoE",
    effect: "Unleashes a wave of flame in a cone in front of the caster, burning enemies.",
    drain: 30,
    cooldown: 4,
    statusEffects: ["Burn"],
    elementalInteractions: {
        Water: "Dampens the wave, reducing damage",
        Wind: "Increases the spread and damage of the flame wave"
    }
};

const infernoBurst = {
    name: "Inferno Burst",
    element: "Fire",
    type: "Direct",
    effect: "Explodes a massive burst of fire centered on a single target. Deals massive damage in an area.",
    drain: 50,
    cooldown: 5,
    statusEffects: ["Burn"],
    elementalInteractions: {
        Water: "Reduces damage, creates a steam effect",
        Wind: "Increases the blast radius and intensity"
    }
};

// Water Spells
const waterJet = {
    name: "Water Jet",
    element: "Water",
    type: "Direct",
    effect: "Shoots a powerful jet of water at enemies, pushing them back and causing minor water damage.",
    drain: 20,
    chargeable: true,
    chargeLevels: [
        { level: 1, damage: 25, pushback: "Light" },
        { level: 2, damage: 40, pushback: "Moderate" },
        { level: 3, damage: 60, pushback: "Heavy" }
    ],
    elementalInteractions: {
        Fire: "Quenches flames, reducing fire damage in the area",
        Wind: "Increases the spread and range of the jet"
    }
};

const waterShield = {
    name: "Water Shield",
    element: "Water",
    type: "Defensive",
    effect: "Creates a water barrier that absorbs a portion of incoming damage.",
    drain: 30,
    duration: 6,
    elementalInteractions: {
        Fire: "Water shield absorbs more damage from fire-based attacks",
        Earth: "Water shield reduces the impact of earth-based projectiles"
    }
};

const tidalWave = {
    name: "Tidal Wave",
    element: "Water",
    type: "AoE",
    effect: "Creates a massive wave that crashes forward, knocking enemies down and dealing water damage.",
    drain: 40,
    cooldown: 6,
    statusEffects: ["Knockdown"],
    elementalInteractions: {
        Fire: "Dampens fire, reducing damage",
        Wind: "Increases the size and impact of the wave"
    }
};

// Earth Spells
const stoneFist = {
    name: "Stone Fist",
    element: "Earth",
    type: "Direct",
    effect: "Unleashes a large stone fist from the ground to strike a single target with immense physical damage.",
    drain: 25,
    chargeable: true,
    chargeLevels: [
        { level: 1, damage: 40 },
        { level: 2, damage: 60, stunDuration: 2 },
        { level: 3, damage: 100, stunDuration: 3 }
    ],
    elementalInteractions: {
        Water: "Weakens stone, reducing damage",
        Wind: "Increases stone fist's speed and force"
    }
};

const earthquake = {
    name: "Earthquake",
    element: "Earth",
    type: "AoE",
    effect: "Causes the ground to tremble and crack, stunning all nearby enemies and dealing area damage.",
    drain: 50,
    cooldown: 8,
    statusEffects: ["Stun"],
    elementalInteractions: {
        Water: "Weakens earthquake's force",
        Fire: "Fire can cause cracks in the ground to erupt with lava"
    }
};

const boulderToss = {
    name: "Boulder Toss",
    element: "Earth",
    type: "Direct",
    effect: "Throws a massive boulder at a target, dealing high physical damage.",
    drain: 30,
    cooldown: 4,
    elementalInteractions: {
        Water: "Slows down the boulder",
        Wind: "Increases boulder velocity"
    }
};

// Air Spells
const windGust = {
    name: "Wind Gust",
    element: "Air",
    type: "Direct",
    effect: "Creates a gust of wind that knocks back enemies and deals wind damage.",
    drain: 15,
    chargeable: true,
    chargeLevels: [
        { level: 1, damage: 20, knockback: "Light" },
        { level: 2, damage: 40, knockback: "Moderate" },
        { level: 3, damage: 60, knockback: "Heavy" }
    ],
    elementalInteractions: {
        Fire: "Strengthens fire by increasing heat intensity",
        Earth: "Increases the spread of dust or sand in the area"
    }
};

const tornado = {
    name: "Tornado",
    element: "Air",
    type: "AoE",
    effect: "Summons a whirlwind that pulls in enemies and deals damage over time.",
    drain: 40,
    cooldown: 5,
    statusEffects: ["Knockdown"],
    elementalInteractions: {
        Fire: "Increases damage to fire-based enemies",
        Water: "Weakens the tornado, reducing damage"
    }
};

const cycloneStrike = {
    name: "Cyclone Strike",
    element: "Air",
    type: "Direct",
    effect: "Creates a concentrated cyclone that strikes a single target, dealing massive wind damage.",
    drain: 35,
    cooldown: 6,
    elementalInteractions: {
        Fire: "Increases damage dealt",
        Water: "Reduces effectiveness of cyclone"
    }
};

// Lightning Spells
const lightningBolt = {
    name: "Lightning Bolt",
    element: "Lightning",
    type: "Direct",
    effect: "Strikes a single target with a powerful bolt of lightning, dealing high damage and stunning.",
    drain: 25,
    chargeable: true,
    chargeLevels: [
        { level: 1, damage: 40, stunDuration: 2 },
        { level: 2, damage: 60, stunDuration: 3 },
        { level: 3, damage: 90, stunDuration: 4 }
    ],
    elementalInteractions: {
        Water: "Increases damage due to conductivity",
        Earth: "Reduces damage from electrical resistance"
    }
};

const chainLightning = {
    name: "Chain Lightning",
    element: "Lightning",
    type: "AoE",
    effect: "Hits one target, and then arcs to additional nearby targets, dealing lightning damage to each.",
    drain: 30,
    cooldown: 4,
    statusEffects: ["Stun"],
    elementalInteractions: {
        Water: "Increases damage, arcing to more targets",
        Wind: "Increases lightning spread"
    }
};

const thunderstorm = {
    name: "Thunderstorm",
    element: "Lightning",
    type: "AoE",
    effect: "Calls down a storm that deals periodic lightning damage to enemies in a large area.",
    drain: 50,
    cooldown: 10,
    statusEffects: ["Stun"],
    elementalInteractions: {
        Water: "Amplifies damage",
        Earth: "Dampens lightning damage"
    }
};

export const elemental = [
    fireArrow,
    flameWave,
    infernoBurst,
    waterJet,
    waterShield,
    tidalWave,
    stoneFist,
    earthquake,
    boulderToss,
    windGust,
    tornado,
    cycloneStrike,
    lightningBolt,
    chainLightning,
    thunderstorm
]