import { Spell, ElementalSummonSpell } from './models';

const summonSword: Spell = {
    name: "Summon Sword",
    element: "Earth",
    type: "Summon",
    effect: "Summons a sword made of elemental material (earth, fire, etc.). The sword can be wielded by the caster or dropped to be used as a weapon.",
    drain: 30,
    cooldown: 10,
    duration: 0, // The sword remains until dismissed or the caster chooses to release it
    statusEffects: ["Weapon Summoned"],
    elementalInteractions: {
        Fire: "The sword bursts into flames, causing fire damage on hit.",
        Water: "The sword becomes drenched, causing a slowing effect on enemies it strikes.",
        Earth: "The sword becomes a sturdy, stone-like weapon with increased durability.",
        Wind: "The sword becomes lightweight and faster, dealing more strikes per second.",
    },
    description: "Summons a sword crafted from elemental energy. The type of sword varies based on the element: fire, stone, or air. Each type has its own damage and effects. The sword can be used by the caster or dropped for others to wield."
};

const summonShield: Spell = {
    name: "Summon Shield",
    element: "Earth",
    type: "Summon",
    effect: "Summons a shield made from elemental energy (earth, fire, etc.). The shield can absorb damage and provide protection.",
    drain: 40,
    cooldown: 15,
    duration: 0, // The shield remains until dismissed or the caster releases it
    statusEffects: ["Shield Summoned"],
    elementalInteractions: {
        Fire: "The shield is infused with fire, granting it the ability to reflect fire-based attacks.",
        Water: "The shield is infused with water, reducing damage from fire-based attacks and allowing the caster to heal upon absorbing water magic.",
        Earth: "The shield is made of stone, providing high durability and resistance to physical damage.",
        Wind: "The shield becomes lightweight and able to deflect projectiles with greater ease.",
    },
    description: "Summons a shield made of elemental energy. The shield's properties vary depending on the element: fire for reflection, water for healing, earth for high durability, or wind for deflecting projectiles."
};

const summonBow: Spell = {
    name: "Summon Bow",
    element: "Air",
    type: "Summon",
    effect: "Summons a bow made from elemental air energy. Arrows shot from the bow carry elemental effects and deal damage.",
    drain: 25,
    cooldown: 10,
    duration: 0, // The bow remains until dismissed or the caster chooses to release it
    statusEffects: ["Weapon Summoned"],
    elementalInteractions: {
        Fire: "Arrows fired from the bow are infused with fire, causing explosive damage.",
        Water: "Arrows fired from the bow can freeze enemies on hit, slowing them down.",
        Earth: "Arrows from the bow turn into stone-tipped projectiles, dealing higher physical damage.",
        Wind: "Arrows fired from the bow gain increased speed and range, causing wind-based knockback on impact.",
    },
    description: "Summons a bow made of elemental air energy. The bow's arrows carry elemental effects, such as fire for explosions, water for freezing, earth for stone-tipped damage, and wind for increased range and knockback."
};

const summonSpear: Spell = {
    name: "Summon Spear",
    element: "Earth",
    type: "Summon",
    effect: "Summons a spear made from elemental energy. The spear can be used for both thrusting melee attacks and thrown as a ranged weapon.",
    drain: 35,
    cooldown: 12,
    duration: 0, // The spear remains until dismissed or the caster releases it
    statusEffects: ["Weapon Summoned"],
    elementalInteractions: {
        Fire: "The spear becomes engulfed in flames, causing burning damage on impact.",
        Water: "The spear can freeze enemies upon impact, slowing or freezing them.",
        Earth: "The spear is a sturdy stone weapon with increased impact damage.",
        Wind: "The spear becomes lightweight, increasing the throwing speed and distance.",
    },
    description: "Summons a spear made of elemental energy. The spear has both melee and ranged applications, with varying effects based on the element, such as fire for burn damage, water for freezing, earth for high-impact stone, and wind for increased speed and range."
};

const waterGolem: ElementalSummonSpell = {
    name: "Water Golem",
    element: "Water",
    type: "Summon",
    effect: "Summons a water-based golem created from nearby rivers or lakes. The power depends on magic spent.",
    resourceType: "Water",
    resourceCost: 0, // Magic-based, not specific to quantity of water
    drain: 20
};

const woodGolem: ElementalSummonSpell = {
    name: "Wood Golem",
    element: "Earth",
    type: "Summon",
    effect: "Uses wood from nearby trees to create a golem. One tree equals one golem.",
    resourceType: "Wood",
    resourceCost: 1, // One tree equals one golem
    drain: 20
};

const fireGolem: ElementalSummonSpell = {
    name: "Fire Golem",
    element: "Fire",
    type: "Summon",
    effect: "Summons a pure fire golem. The power of the golem depends on the caster's magic expenditure.",
    resourceType: "Fire",
    resourceCost: 1, // one bon-fire equals one golem
    drain: 25
};

export const summoning = {
    summonSword,
    summonShield,
    summonBow,
    summonSpear,
    waterGolem,
    woodGolem,
    fireGolem
}