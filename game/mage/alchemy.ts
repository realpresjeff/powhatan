import { Spell, ElementalSummonSpell } from './models';

// alchemy
const healingPotion: Spell = {
    name: "Healing Potion",
    element: "Water",
    type: "Alchemy",
    effect: "Creates a potion that heals the target over time.",
    drain: 10,
    cooldown: 5,
    duration: 5, // Heals over 5 seconds
    statusEffects: ["Healing"],
    elementalInteractions: {
        Fire: "Fire-based elemental creatures are harmed by the potion, as it sizzles and burns them.",
        Water: "Water elementals are healed more effectively, their wounds closing faster.",
        Earth: "Earth elementals have a resistance to healing potions, as they require more potent concoctions.",
        Wind: "Wind elementals experience a light healing effect but are difficult to affect with potions."
    },
    description: "Brews a healing potion using water and medicinal plants. Heals the target over time, with stronger effects on water-based creatures."
};

const fireBomb: Spell = {
    name: "Fire Bomb",
    element: "Fire",
    type: "Alchemy",
    effect: "Creates an explosive device that deals fire damage in an area of effect.",
    drain: 30,
    cooldown: 15,
    duration: 0, // Instant effect
    statusEffects: ["Explosion", "Burn"],
    elementalInteractions: {
        Fire: "Amplifies the explosion, causing a stronger burst of flames.",
        Water: "Water makes the explosion weaker, dampening the damage.",
        Earth: "Earth increases the impact, creating a blast radius that causes more physical damage.",
        Wind: "Wind fans the flames, increasing the range of the fire bomb."
    },
    description: "Crafts a fiery explosive that detonates upon impact, dealing fire damage in a burst. Amplified by wind and earth, weakened by water."
};

const manaElixir: Spell = {
    name: "Mana Elixir",
    element: "Water",
    type: "Alchemy",
    effect: "Restores mana or energy to the caster, allowing more spells to be cast.",
    drain: 0,
    cooldown: 10,
    duration: 0, // Instant effect
    statusEffects: ["Mana Restored"],
    elementalInteractions: {
        Fire: "Fire elementals may have their mana restoration reduced due to the volatility of their element.",
        Water: "Water elementals experience a faster restoration of their mana, as water is a key conduit of energy.",
        Earth: "Earth elementals will feel the effects slowly, but the restoration is steady and long-lasting.",
        Wind: "Wind elementals will feel a quick, but short-lasting boost to their mana."
    },
    description: "Creates an elixir to restore mana, especially potent when used by water-based beings."
};

const stoneTransmutation: Spell = {
    name: "Stone Transmutation",
    element: "Earth",
    type: "Alchemy",
    effect: "Transmute an object into a stone or mineral of higher value or durability.",
    drain: 40,
    cooldown: 20,
    duration: 0, // Instant effect
    statusEffects: ["Transmutation"],
    elementalInteractions: {
        Fire: "Fire causes the transmutation to form into molten stone or magma.",
        Water: "Water may cause the stone to become wet, making it harder to work with.",
        Earth: "Earth elementals can influence the type of stone or mineral formed.",
        Wind: "Wind may blow away loose particles during transmutation, weakening the result."
    },
    description: "Turns an object into stone or a precious mineral. The properties of the stone depend on the surrounding elements, like fire turning it into molten lava."
};


const strengthPotion: Spell = {
    name: "Potion of Strength",
    element: "Earth",
    type: "Alchemy",
    effect: "Temporarily boosts the target's strength, increasing their physical power for a duration.",
    drain: 15,
    cooldown: 10,
    duration: 30, // Boost lasts for 30 seconds
    statusEffects: ["Strength Boosted"],
    elementalInteractions: {
        Fire: "The potion burns off more quickly in fire-based creatures, reducing the duration.",
        Water: "Water-based creatures are slightly less affected by the potion, as their strength remains balanced.",
        Earth: "Earth-based creatures benefit greatly from the potion, feeling an immense strength surge.",
        Wind: "Wind elementals see a minor boost in agility rather than strength, making them faster but less powerful."
    },
    description: "Creates a potion that increases strength for a period of time. Earth-based creatures benefit most from this potion."
};

const invisibilityPotion: Spell = {
    name: "Elixir of Invisibility",
    element: "Air",
    type: "Alchemy",
    effect: "Makes the drinker invisible for a short period.",
    drain: 20,
    cooldown: 15,
    duration: 10, // Invisibility lasts for 10 seconds
    statusEffects: ["Invisible"],
    elementalInteractions: {
        Fire: "The potion is less effective for fire-based creatures, as their heat signature is harder to hide.",
        Water: "Water creatures are harder to hide, but the potion still provides partial invisibility.",
        Earth: "Earth-based creatures have a stronger effect, as the potion can blend into natural surroundings.",
        Wind: "Wind-based creatures benefit the most, moving undetected with ease."
    },
    description: "Brews an elixir that grants invisibility for a short time. The potion's effectiveness varies based on the element of the creature."
};

const coalToGold: Spell = {
    name: "Coal to Gold Transmutation",
    element: "Earth",
    type: "Alchemy",
    effect: "Transforms coal into gold through magical transmutation.",
    drain: 50,
    cooldown: 60,
    duration: 0, // Instant effect
    statusEffects: ["Wealth Increase"],
    elementalInteractions: {
        Fire: "Increases gold yield but introduces instability, risking failure or explosion."
    },
    description: "Uses alchemical magic to transmute coal into gold. The process varies based on elemental influences."
};


export const alchemy = [
    healingPotion,
    fireBomb,
    manaElixir,
    stoneTransmutation,
    strengthPotion,
    invisibilityPotion,
    coalToGold
]