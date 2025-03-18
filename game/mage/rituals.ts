import { Spell } from './models';

const prayerWithBones: Spell = {
    name: "Prayer with Bones",
    element: "Dark",
    type: "Ritual",
    effect: "Offer bones from dead creatures to summon temporary spirits or boost stats.",
    drain: 30,
    cooldown: 30,
    duration: 0, // Instant effect
    statusEffects: ["Summon Spirit", "Stat Boost"],
    description: "Offer bones to summon a temporary spirit or gain a stat boost based on the element of the offering. Higher levels may enhance the effect of the spirit or offer greater boosts.",
};

export const rituals = {
    prayerWithBones
}