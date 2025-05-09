import { spells } from './spells';

export class Spellbook {

    constructor() {
        document.getElementById("spells").addEventListener("click", this.toggleSpellbook);

        this.renderSpells();
    }

    toggleSpellbook() {
        const popup = document.getElementById("spellbookOverlay");
        popup.style.display = popup.style.display === "block" ? "none" : "block";
    }

    renderSpells() {
        const spellList = document.getElementById("spellList");
        spells.forEach(spell => {
            const listItemContainer = document.createElement("li");
            listItemContainer.className = "spell active"
            listItemContainer.setAttribute("data-name", spell.name);
            const spellItem = document.createElement("div");
            listItemContainer.appendChild(spellItem);
            const icon = document.createElement("img");
            icon.src = "./assets/default_spell_icon.png";
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