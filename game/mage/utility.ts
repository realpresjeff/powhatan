import { Spell } from './models';

const substitutionSpell: Spell = {
    name: "Substitution",
    element: "Air",
    type: "Utility",
    effect: "Swap places with an object or another player to escape danger or confuse enemies.",
    drain: 35,
    cooldown: 15,
    duration: 0, // Instant effect
    statusEffects: ["Teleported"],
    description: "Teleport the caster to a nearby object or another player, making it useful for quick escapes or tricking opponents.",
};

// Levitation Spell Object
const levitation: Spell = {
    name: "Levitation",
    element: "Air",
    type: "Utility",
    effect: "Temporarily lifts a target (either caster or enemy) into the air. The higher the magic spent, the longer the levitation lasts.",
    drain: 20,
    duration: 5,
    cooldown: 10,
    statusEffects: ["Levitate"],
    scaling: {
        level1: {
            duration: 5,
            height: 10, // Height in meters
        },
        level2: {
            duration: 10,
            height: 15,
        },
        level3: {
            duration: 15,
            height: 20,
        },
    },
    description: "Levitate a target into the air for a limited time. The higher the level, the longer the duration and the greater the height. Wind boosts levitation effects.",
};

export const utility = [
    substitutionSpell,
    levitation
]