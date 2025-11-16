export const spells = [
    {
        name: "Cursed Flame",
        damage: 100,
        recoilDamage: 20,
        drain: 50,
        description: "A powerful flame spell that damages enemies but also harms the caster with recoil.",
        type: "Fire Magic",
        racialOrigin: ["European", "Native American"],
        requirements: [
            { name: "Cherokee Spirit Herb", type: "Magic Material", stackable: true, quantity: 2, tradeable: true }
        ],
        cast: function (caster) {
            console.log(`${caster.name} casted ${this.name} and took ${this.recoilDamage} recoil damage!`);
            caster.hp -= this.recoilDamage;
            caster.mp -= this.drain;
        }
    },
    {
        name: "Prayer to the Spirits",
        restoreAmount: 50,
        drain: 10,
        description: "A prayer to the ancestral spirits to regain lost magic power.",
        restores: "Magic",
        racialOrigin: ["Native American", "African"],
        perform: function (caster) {
            console.log(`${caster.name} prays to the spirits and restores ${this.restoreAmount} MP.`);
            caster.mp += this.restoreAmount;
            caster.mp -= this.drain;
        }
    },
    {
        name: "Ritual of the Ancients",
        restoreAmount: 100,
        drain: 20,
        restores: "Magic",
        description: "A sacred ritual that can restore a significant amount of magic power.",
        racialOrigin: ["Native American", "European"],
        perform: function (caster) {
            console.log(`${caster.name} performs the Ritual of the Ancients, restoring ${this.restoreAmount} MP.`);
            caster.mp += this.restoreAmount;
            caster.mp -= this.drain;
        }
    },
    {
        name: "Sacred Herb Tea",
        restoreAmount: 30,
        drain: 5,
        description: "A potion brewed from sacred herbs that restores magic power.",
        racialOrigin: ["Native American", "European"],
        perform: function (caster) {
            console.log(`${caster.name} drinks Sacred Herb Tea, restoring ${this.restoreAmount} MP.`);
            caster.mp += this.restoreAmount;
            caster.mp -= this.drain;
        }
    },
    {
        name: "Wind Whisper",
        damage: 0,
        drain: 15,
        description: "A wind-based spell that summons a gentle breeze to carry messages over long distances.",
        type: "Nature Magic",
        racialOrigin: ["Powhatan", "Native American"],
        requirements: [{ name: "Powhatan Shaman Stone", type: "Magic Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Flame of the Earth",
        damage: 25,
        drain: 30,
        description: "Summons a burst of fire from the earth to attack enemies, burning them over time.",
        type: "Fire Magic",
        racialOrigin: ["Cherokee", "Native American"],
        requirements: [{ name: "Cherokee Spirit Herb", type: "Magic Material", stackable: true, quantity: 2, tradeable: true }]
    },
    {
        name: "Spirit Shield",
        damage: 0,
        drain: 40,
        description: "A protective barrier formed from ancestral spirits, absorbing damage from attacks.",
        type: "Defensive Magic",
        maxDamageAbsorbed: 50,
        currentAbsorption: 50,
        racialOrigin: ["European", "Native American"],
        requirements: [{ name: "Monacan Moonstone", type: "Magic Material", stackable: false, quantity: 1, tradeable: true }]
    },
    {
        name: "Lightning Strike",
        damage: 40,
        drain: 60,
        description: "Calls down a powerful bolt of lightning to smite enemies from the skies.",
        type: "Storm Magic",
        racialOrigin: ["Taino", "Native American"],
        requirements: [{ name: "Taino Ritual Mask (Puerto Rico)", type: "Magic Material", stackable: false, quantity: 1, tradeable: true }]
    },
    {
        name: "Healing Waters",
        healAmount: 50,
        target: "HP",
        drain: 10,
        description: "Heals wounds and restores vitality by summoning the pure waters of the sacred rivers.",
        type: "Healing Magic",
        racialOrigin: ["Taino", "Native American"],
        requirements: [{ name: "Taino Mahogany (Dominican Republic)", type: "Woodcutting Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Fireball",
        damage: 50,
        drain: 50,
        description: "A spell that launches a fireball towards enemies, exploding on impact.",
        type: "Fire Magic",
        racialOrigin: ["French", "European"],
        requirements: [{ name: "French Flint and Steel", type: "Fire Making Tool", stackable: false, tradeable: true }]
    },
    {
        name: "Blessing of the Wind",
        damage: 0,
        drain: 20,
        target: "Agility",
        description: "Increases the speed of allies by summoning a magical wind to carry them faster.",
        type: "Buff Magic",
        racialOrigin: ["European", "Native American"],
        requirements: [{ name: "Dutch Tinderbox", type: "Fire Making Tool", stackable: false, tradeable: true }]
    },
    {
        name: "Sword of the Ancients",
        damage: 70,
        drain: 45,
        description: "Summons an ethereal sword that strikes enemies with great force.",
        type: "Weapon Summoning",
        racialOrigin: ["European"],
        requirements: [{ name: "Dutch Iron Ore", type: "Smithing Material", stackable: true, quantity: 2, tradeable: true }]
    },
    {
        name: "Healing Light",
        healAmount: 40, // Amount healed added
        drain: 15,
        target: "HP",
        description: "A light-based healing spell that slowly regenerates health over time.",
        type: "Healing Magic",
        racialOrigin: ["French", "European"],
        requirements: [{ name: "French Steel Ingot", type: "Smithing Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Thunderclap",
        damage: 30,
        drain: 40,
        description: "Summons a loud thunderclap to stun enemies and cause light damage.",
        type: "Storm Magic",
        racialOrigin: ["Native American", "African"],
        requirements: [{ name: "Pilgrim Pine Wood", type: "Woodcutting Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Voodoo Curse",
        damage: 20,
        drain: 30,
        description: "Curses an enemy, causing them to take damage over time and lose health.",
        type: "Dark Magic",
        racialOrigin: ["Zambo"],
        requirements: [{ name: "Zambo Spirit Dust", type: "Magic Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Healing Waters",
        healAmount: 50, // Amount healed added
        drain: 10,
        target: "HP",
        description: "Summons healing waters to restore health and cleanse allies of toxins and curses.",
        type: "Healing Magic",
        racialOrigin: ["African"],
        requirements: [{ name: "Manding Healing Crystal", type: "Magic Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Summon Lion's Roar",
        damage: 60,
        drain: 50,
        description: "Summons the powerful roar of a lion, disorienting and damaging nearby enemies.",
        type: "Summoning Magic",
        racialOrigin: ["African"],
        requirements: [{ name: "Manding Spirit Herb", type: "Magic Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        name: "Earthquake",
        damage: 40,
        drain: 60,
        description: "Shakes the earth beneath your enemies, causing massive damage to a wide area.",
        type: "Earth Magic",
        racialOrigin: ["African"],
        requirements: [{ name: "Manding Spirit Herb", type: "Magic Material", stackable: true, quantity: 2, tradeable: true }]
    },
    {
        name: "Ancestral Shield",
        damage: 0,
        drain: 50,
        maxDamageAbsorbed: 50,
        currentAbsorption: 50,
        description: "Summons the protection of ancestral spirits, creating a shield that absorbs damage.",
        type: "Defensive Magic",
        racialOrigin: ["Zambo", "African"],
        requirements: [{ name: "Zambo Spirit Dust", type: "Magic Material", stackable: true, quantity: 2, tradeable: true }]
    },
    {
        name: "Fire Arrow",
        damage: 40,
        drain: 45,
        description: "Shoots an arrow imbued with magical fire, dealing damage and burning enemies.",
        type: "Fire Magic",
        racialOrigin: ["Native American"],
        requirements: [
            { name: "Cherokee Turkey Feathers", type: "Fletching Material", stackable: true, quantity: 1, tradeable: true },
            { name: "French Flint and Steel", type: "Fire Making Tool", stackable: false, tradeable: true }
        ]
    },
    {
        name: "Healing Winds",
        healAmount: 30, // Amount healed added
        drain: 10,
        target: "HP",
        description: "Summons gentle winds to heal and soothe your allies, restoring health over time.",
        type: "Healing Magic",
        racialOrigin: ["European", "Native American"],
        perform: function (caster) {
            console.log(`${caster.name} casts Healing Winds and restores ${this.healAmount} health.`);
            caster.hp += this.healAmount;
            caster.mp -= this.drain;
        }
    }
];
