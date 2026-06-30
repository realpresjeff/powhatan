import { ToolBarButton } from './toolbar_button.js';

export const spells = [
    {
        id: 1,
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
        cast: function (caster, target) {
            spawnFireCharge(caster);
        },
        impact: function (target) {
            spawnFireExplosion(target);
        }
    },
    {
        id: 2,
        name: "Prayer to the Spirits",
        restoreAmount: 50,
        drain: 10,
        description: "A prayer to the ancestral spirits to regain lost magic power.",
        restores: "Magic",
        icon: "./assets/spells/Nature_6.png",
        racialOrigin: ["Native American", "African"],
        cast: function ({ caster, activeSpell }) {
            console.log(`${caster.name} casted ${this.name} and restored ${this.restoreAmount} magic!`);
            caster.mp -= this.drain;
            caster.mp += this.restoreAmount;
        }
    },
    {
        id: 3,
        name: "Deep Freeze",
        damage: 20,
        drain: 15,
        experience: 20,
        level: 1,
        description: "A powerful ice attack.",
        type: "Nature Magic",
        racialOrigin: ["Native American", "European"],
        icon: "./assets/spells/FrostMage_17.png",
        cast: function (caster, target) {
            caster.startAnimation();
            caster.magic_animation();
            spawnIceWave(caster, target);
        },
        impact: function (target) {
            freezeTarget(target);
        }
        // requirements: [{ name: "Powhatan Shaman Stone", type: "Magic Material", stackable: true, quantity: 1, tradeable: true }]
    },
    {
        id: 4,
        name: "Thunderclap",
        damage: 30,
        drain: 40,
        description: "Summons a loud thunderclap to stun enemies and cause light damage.",
        type: "Storm Magic",
        icon: "./assets/spells/Nature_10.png",
        racialOrigin: ["Native American", "African", "European"],
        requirements: [{ name: "Pilgrim Pine Wood", type: "Woodcutting Material", stackable: true, quantity: 1, tradeable: true }],
        cast: function (caster, target) {
            caster.startAnimation();
            caster.magic_animation();
            spawnLightning(caster, target);
        },
        impact: function (target) {
            stunTarget(target);
        }
    },
];

export class Spellbook {
    activeSpell = null;

    spells = spells;

    character = null;

    constructor(character) {
        // super('spells', 'spellbookOverlay');
        // this.fetchSpells(character.id);
        // this.attachListener(document);
        console.log(character);
        this.character = character
        console.log(this.character);
        this.renderSpells();
    }

    cast(drain = 0, restoreAmount = 0) {
        console.log(this.character);
        console.log(`${this.character.name} prays to the spirits and restores ${restoreAmount} MP.`);
        this.character.drainStat('mage', drain);
        this.character.regenerateStat('hp', restoreAmount);
    }

    renderSpells() {
        const spellList = document.getElementById("spellList");
        console.log(this.character);
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
                // spellItem.classList.toggle("active");

                console.log(this.activeSpell);

                if (this.activeSpell && this.activeSpell.name === spell.name) {
                    // If the same spell is clicked again, set activeSpell to null and remove 'active' class

                    // this.cast && this.cast(this.character);
                    // addMessage("Game", `Deselected spell: ${spell.name}`);

                    if (spell.cast) {
                        spell.cast && spell.cast({ caster: this.character, activeSpell: this.activeSpell });
                    }

                    document.querySelectorAll(".spell").forEach(item => {
                        item.classList.remove("active");
                    });

                    this.activeSpell = null;
                    this.character.activeSpell = null;
                } else {
                    // Remove 'active' class from all spell items
                    document.querySelectorAll(".spell").forEach(item => {
                        item.classList.remove("active");
                    });
                    // Set the selected spell as active
                    this.activeSpell = spell;
                    this.character.activeSpell = spell;

                    listItemContainer.classList.add("active");
                    // addMessage("Game", `Selected spell: ${spell.name}`);

                    console.log(spell);
                }

                // if (spell.cast) {
                //     return spell.cast && spell.cast(this.character, this.activeSpell);
                // }
            });
            spellList.appendChild(listItemContainer);
        });
    }
}

function spawnFireCharge(caster) {
    const fireball = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 12, 12),
        new THREE.MeshStandardMaterial({
            emissive: 0xff4500,
            color: 0xaa2200
        })
    );

    fireball.position.copy(caster.base.position).add(new THREE.Vector3(0, 2, 1));
    caster.scene.add(fireball);
    setTimeout(() => caster.scene.remove(fireball), 100);
    animateProjectile(fireball, caster);
}

function spawnFireExplosion(target) {
    const explosion = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 16, 16),
        new THREE.MeshStandardMaterial({
            emissive: 0xff3300,
            transparent: true,
            opacity: 0.8
        })
    );

    const model = target.model || target.base;

    explosion.position.copy(model);
    target.scene.add(explosion);

    setTimeout(() => target.scene.remove(explosion), 400);
}

function spawnIceWave(caster, target) {
    const ice = new THREE.Mesh(
        new THREE.ConeGeometry(1, 3, 8),
        new THREE.MeshStandardMaterial({
            color: 0x99ccff,
            emissive: 0x3366ff
        })
    );

    const model = target.model || target.base;

    ice.position.copy(model).add(new THREE.Vector3(0, 1, 2));
    caster.scene.add(ice);

    setTimeout(() => {
        caster.scene.remove(ice);
    }, 5000);

    animateProjectile(ice, caster);
}

function freezeTarget(target) {
    target.frozen = true;
    let meshOriginalColor;

    const model = target.model || target.base;

    model.traverse && model.traverse(mesh => {
        if (mesh.material) {
            meshOriginalColor = mesh.material.color;
            mesh.material.color.set(0x88ccff);
        };
    });

    setTimeout(() => {
        target.frozen = false;

        model.traverse && model.traverse(mesh => {
            if (mesh.material) mesh.material.color.set(meshOriginalColor);
        });
    }, 5000);
}

function spawnLightning(caster, target) {
    const bolt = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(0, 0, 0)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffff00 })
    );

    const model = target.model || target.base;

    bolt.position.copy(model);
    caster.scene.add(bolt);

    setTimeout(() => caster.scene.remove(bolt), 200);
}

function stunTarget(target) {
    target.stunned = true;
    setTimeout(() => (target.stunned = false), 2000);
}

function animateProjectile(projectile, caster) {
    const target = caster.followTarget?.model || caster.currentTarget?.model;
    if (!target) return;

    const dir = new THREE.Vector3()
        .subVectors(target.position, projectile.position)
        .normalize();

    const interval = setInterval(() => {
        projectile.position.add(dir.multiplyScalar(0.4));

        if (projectile.position.distanceTo(target.position) < 1) {
            clearInterval(interval);
            caster.scene.remove(projectile);
        }
    }, 16);
}
