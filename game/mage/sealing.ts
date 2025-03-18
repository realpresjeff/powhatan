import { Spell } from './models';

const sealElementIntoObject: Spell = {
    name: "Seal Element into Object",
    element: "Earth",
    type: "Ritual",
    effect: "Seals an elemental effect (Fire, Water, Air, Earth) into an object for later activation. The effect can be released at will by the caster.",
    drain: 50,
    cooldown: 30,
    duration: 0, // The spell is instant, but the effect lasts until activated
    statusEffects: ["Element Sealed"],
    description: "Seals an elemental effect into an object for later use. Once sealed, the object retains the elemental energy until activated by the caster. The object can be used to launch an elemental attack, create a protective effect, or assist in other ways, depending on the element sealed within.",
};


const sealingCircle: Spell = {
    name: "Sealing Circle",
    element: "Earth",
    type: "Control",
    effect: "Creates a magic circle around the target, preventing them from moving or using magic for a short time.",
    drain: 40,
    cooldown: 30,
    duration: 5, // Target is sealed for 5 seconds
    statusEffects: ["Sealed"],
    description: "Creates a barrier around the target, locking them in place and preventing their movement or magic use.",
};

export const sealing = {
    sealElementIntoObject,
    sealingCircle
}