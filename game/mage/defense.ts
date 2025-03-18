import { Spell } from './models';

const fireCloak: Spell = {
    name: "Fire Cloak",
    element: "Fire",
    type: "Defense",
    effect: "Surrounds the target with a cloak of fire that deals burn damage to nearby enemies.",
    drain: 25,
    cooldown: 20,
    duration: 10, // Cloak lasts for 10 seconds
    statusEffects: ["Burn Damage Over Time"],
    elementalInteractions: {
        Fire: "The fire cloak's power is boosted by the presence of other fire-based effects.",
        Water: "Water weakens the cloak, reducing its damage output and defensive properties.",
        Earth: "Earth absorbs some of the fire, reducing the cloak's overall effect on the target.",
        Wind: "Wind strengthens the cloak, causing it to spread faster and deal more damage.",
    },
    description: "Envelops the target in a fiery cloak, damaging nearby enemies over time. Wind and fire enhance the cloak's effectiveness, while water and earth weaken it.",
};

const woodShield = {
    name: "Wood Shield",
    element: "Earth", // It's a natural, earthy material, so it makes sense to associate it with Earth
    type: "Defensive", // It's a protective spell
    effect: "Summons a large shield made of wood, offering protection against incoming damage and reducing damage taken.",
    drain: 25, // The amount of mana or energy it costs to cast
    duration: 8, // Duration of the shield in seconds
    cooldown: 6, // Cooldown time after usage
    statusEffects: ["Block", "Reduce Damage"], // Effects of the shield
    elementalInteractions: {
        Fire: { fn: (shieldStrength: number) => handleWoodShieldElementalInteraction("Fire", shieldStrength), description: "Wood is highly flammable, reducing the effectiveness of the shield against fire-based attacks by 50%." },
        Water: { fn: (shieldStrength: number) => handleWoodShieldElementalInteraction("Water", shieldStrength), description: "The shield becomes weaker when wet, reducing its damage reduction effectiveness by 30%." },
        Earth: { fn: (shieldStrength: number) => handleWoodShieldElementalInteraction("Earth", shieldStrength), description: "Wood absorbs more damage when in direct contact with stone, increasing its defense by 20%." },
        Wind: { fn: (shieldStrength: number) => handleWoodShieldElementalInteraction("Wind", shieldStrength), description: "Wind may cause the wood to splinter, reducing the shield's effectiveness by 15%." },
    },
    scaling: {
        level1: {
            blockAmount: 40, // Blocks 40% of damage
            damageReduction: 30, // Reduces incoming damage by 30%
        },
        level2: {
            blockAmount: 60, // Blocks 60% of damage
            damageReduction: 50, // Reduces incoming damage by 50%
        },
        level3: {
            blockAmount: 80, // Blocks 80% of damage
            damageReduction: 70, // Reduces incoming damage by 70%
        },
    },
    description: "Summons a wooden shield that provides temporary protection. The shield blocks a significant amount of damage, but its effectiveness may vary depending on elemental factors. The shield lasts for a few seconds or until broken.",
};

export const defense = [
    fireCloak,
    woodShield
]
