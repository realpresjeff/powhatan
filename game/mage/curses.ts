import { Spell, ElementalSummonSpell } from './models';

const curseOfWeakness: Spell = {
    name: "Curse of Weakness",
    element: "Dark",
    type: "Curse",
    effect: "Lowers the target's strength and agility for a short period.",
    drain: 20,
    cooldown: 15,
    duration: 10, // Affects for 10 seconds
    statusEffects: ["Strength Reduced", "Agility Reduced"],
    description: "Lowers the target's strength and agility temporarily, weakening their attacks and movements.",
};

export const curses = [
    curseOfWeakness
]