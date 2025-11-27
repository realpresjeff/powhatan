import { spells } from './spells';

class ToolBarIcon {
    buttonId;
    popupId;

    constructor(buttonId, popupId) {
        this.buttonId = buttonId;
        this.popupId = popupId;
    }

    attachListener = (document) => {
        document.getElementById(`${this.buttonId}`).addEventListener('click', () => {
            this.togglePopup(document);
        })
    }

    togglePopup = (document) => {
        console.log(this.popupId);
        const popup = document.getElementById(`${this.popupId}`);
        popup.style.display = popup.style.display === "block" ? "none" : "block";
    }
}

export class Spellbook extends ToolBarIcon {
    spells = [
        {
            name: "Cursed Flame",
            damage: 100,
            recoilDamage: 20,
            drain: 50,
            description: "A powerful flame spell that damages enemies but also harms the caster with recoil.",
            type: "Fire Magic",
            icon: "./assets/spells/FireMage_5.png",
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
            icon: "./assets/spells/Nature_6.png",
            racialOrigin: ["Native American", "African"],
            cast: function (caster) {
                console.log(`${caster.name} prays to the spirits and restores ${this.restoreAmount} MP.`);
                caster.mp += this.restoreAmount;
                caster.mp -= this.drain;
            }
        },
        {
            name: "Deep Freeze",
            damage: 0,
            drain: 15,
            description: "A powerful ice attack.",
            type: "Nature Magic",
            racialOrigin: ["Native American", "European"],
            icon: "./assets/spells/FrostMage_17.png"
            // requirements: [{ name: "Powhatan Shaman Stone", type: "Magic Material", stackable: true, quantity: 1, tradeable: true }]
        },
        {
            name: "Thunderclap",
            damage: 30,
            drain: 40,
            description: "Summons a loud thunderclap to stun enemies and cause light damage.",
            type: "Storm Magic",
            icon: "./assets/spells/Nature_10.png",
            racialOrigin: ["Native American", "African", "European"],
            requirements: [{ name: "Pilgrim Pine Wood", type: "Woodcutting Material", stackable: true, quantity: 1, tradeable: true }]
        },
    ];

    constructor() {
        super('spells', 'spellbookOverlay');
        this.attachListener(document);
        this.renderSpells();
    }

    renderSpells() {
        const spellList = document.getElementById("spellList");
        this.spells.forEach(spell => {
            const listItemContainer = document.createElement("li");
            listItemContainer.className = "spell active"
            listItemContainer.setAttribute("data-name", spell.name);
            const spellItem = document.createElement("div");
            listItemContainer.appendChild(spellItem);
            const icon = document.createElement("img");
            icon.src = spell.icon || "./assets/default_spell_icon.png";
            icon.alt = spell.name;
            spellItem.className = "default-icon";
            spellItem.appendChild(icon);
            spellItem.addEventListener("click", () => {
                spellItem.classList.toggle("active");
            });
            spellList.appendChild(listItemContainer);
        });
    }
}