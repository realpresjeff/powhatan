import { axe, bow, sword } from './weapons/index.js';
import { Inventory } from './inventory.js';

type Skills = {
    hp: { experience_points: number, total_points_available: number };
    strength: { experience_points: number, total_points_available: number };
    defense: { experience_points: number, total_points_available: number };
    mage: { experience_points: number, total_points_available: number };
    archer: { experience_points: number, total_points_available: number };
    craft: { experience_points: number, total_points_available: number };
    agility: { experience_points: number, total_points_available: number };
    woodcutting: { experience_points: number, total_points_available: number };
}

export class Character {
    // Materials
    materialDarkest = new THREE.MeshPhongMaterial({ color: 0x33281b });
    materialDark = new THREE.MeshPhongMaterial({ color: 0x664e31 });
    materialLight = new THREE.MeshPhongMaterial({ color: 0xa3835b });
    steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
    skinMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdbac,
        flatShading: false
    });
    base = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({ color: 0xffdbac }));

    // Animation state
    walkCycle = 0;
    isWalking = false;
    isRunning = false;

    // References for animating limbs
    leftLeg = null
    rightLeg = null
    leftArm = null
    rightArm = null;

    // Customisations
    legOptionsOpen = false;
    weaponOptionsOpen = false;

    applyedLeg = this.addRightLeg();
    applyedWeapon = axe();

    currentRotation = 0;
    targetRotation: number;
    positionX: number;
    positionZ: number;
    targetPosition;

    scene = null;
    inventory = null;

    skills: Skills = {
        hp: { experience_points: 10000, total_points_available: 10000 },
        strength: { experience_points: 10000, total_points_available: 10000 },
        defense: { experience_points: 10000, total_points_available: 10000 },
        craft: { experience_points: 10000, total_points_available: 10000 },
        mage: { experience_points: 10000, total_points_available: 10000 },
        archer: { experience_points: 10000, total_points_available: 10000 },
        agility: { experience_points: 10000, total_points_available: 10000 },
        woodcutting: { experience_points: 10000, total_points_available: 10000 } // 🪓 new skill
    };

    inCombat: boolean = false;
    alive: boolean = true;

    name: string;

    bankStorage = {}; // Stores banked items

    banking = false;

    currentBankingItem;

    withdrawing = false;

    constructor(scene) {
        this.scene = scene;
        this.inventory = new Inventory({ scene, showContextMenu: () => { }, character: this, player: this.base });
    }

    // Functions
    // Legs
    pegLeg() {
        const pegLegGeo = new THREE.BoxGeometry(0.5, 1.8, 0.5);
        const leg = new THREE.Mesh(pegLegGeo, this.materialLight);

        const stumpUpperGeo = new THREE.BoxGeometry(1, 0.75, 1);
        const stumpUpper = new THREE.Mesh(stumpUpperGeo, this.materialLight)

        const stumpMaterial = new THREE.MeshPhongMaterial({ color: 0x26211a });
        const stumpGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
        const stump = new THREE.Mesh(stumpGeo, stumpMaterial);

        const group = new THREE.Group();

        stump.position.set(1, -4.65, -0.34)
        leg.position.set(1, -3.75, -0.35);
        stumpUpper.position.set(1, -3.1, -0.35);

        group.add(stump);
        group.add(leg);
        group.add(stumpUpper);

        return group;
    }

    addRightLeg() {
        const legGeo = new THREE.BoxGeometry(1.25, 1, 1.4);
        const legRight = new THREE.Mesh(legGeo, this.materialDark);

        const bootGeo1 = new THREE.BoxGeometry(1, 0.8, 1);
        const bootGeo2 = new THREE.BoxGeometry(1, 0.45, 1)

        const bootTopRight = new THREE.Mesh(bootGeo1, this.materialDarkest);
        const bootBottomRight = new THREE.Mesh(bootGeo2, this.materialDarkest);
        this.rightLeg = bootBottomRight;

        const group = new THREE.Group();

        legRight.castShadow = true;
        bootTopRight.castShadow = true;
        bootBottomRight.castShadow = true;

        legRight.position.set(0.75, -3.5, -0.35);

        group.add(legRight);
        group.add(bootTopRight);
        group.add(bootBottomRight);

        bootTopRight.position.set(0.75, -4.4, -0.35);
        bootBottomRight.position.set(0.75, -4.58, 0.1);

        return group;
    }

    addHead() {
        const headGeo = new THREE.BoxGeometry(1.5, 1.5, 1.2);
        const head = new THREE.Mesh(headGeo, this.skinMaterial);

        const browGeo = new THREE.BoxGeometry(1.5, 0.5, 0.5);
        const brow = new THREE.Mesh(browGeo, this.skinMaterial);

        const noseGeo = new THREE.BoxGeometry(0.35, 0.5, 0.5);
        const nose = new THREE.Mesh(noseGeo, this.skinMaterial);

        this.base.add(head);
        this.base.add(brow);
        this.base.add(nose);

        head.castShadow = true;
        head.receiveShadow = true;
        brow.castShadow = true;
        nose.castShadow = true;

        head.position.set(0, 2, 0);
        brow.position.set(0, 2.43, 0.46);
        nose.position.set(0, 2.05, 0.54);

        brow.rotation.x = 130;
    }

    addBeard() {
        const material = new THREE.MeshPhongMaterial({
            color: 0xcc613d,
            flatShading: true
        });

        const shape1 = new THREE.Shape();
        const shape2 = new THREE.Shape();

        shape1.moveTo(-0.75, 0);
        shape1.bezierCurveTo(-0.75, -0.75, -0.5, -1, -0.15, -1.5);
        shape1.lineTo(-2, -1.5);
        shape1.lineTo(-2, 0);

        shape2.moveTo(-0.75, 0);
        shape2.bezierCurveTo(-0.75, -0.75, -0.5, -1, -0.25, -1.25);
        shape2.lineTo(-2, -1.25);
        shape2.lineTo(-2, 0);


        const primarySettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: false
        };

        const secondarySettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: false
        };

        const primaryBeardGeo = new THREE.ExtrudeBufferGeometry(shape1, primarySettings);
        const primaryBeard = new THREE.Mesh(primaryBeardGeo, material);

        const secondaryBeardGeo = new THREE.ExtrudeBufferGeometry(shape2, secondarySettings);
        const secondaryBeardLeft = new THREE.Mesh(secondaryBeardGeo, material);
        const secondaryBeardRight = new THREE.Mesh(secondaryBeardGeo, material);

        this.base.add(primaryBeard);
        this.base.add(secondaryBeardLeft);
        this.base.add(secondaryBeardRight);

        primaryBeard.castShadow = true;
        secondaryBeardLeft.castShadow = true;
        secondaryBeardRight.castShadow = true;

        primaryBeard.position.set(0.5, 1.5, 1.65)
        secondaryBeardLeft.position.set(1.1, 1.4, 1.3)
        secondaryBeardRight.position.set(-0.18, 1.4, 1.55)

        primaryBeard.rotation.y = -Math.PI / 2;
        secondaryBeardLeft.rotation.y = -Math.PI / 2 + 0.25;
        secondaryBeardRight.rotation.y = -Math.PI / 2 - 0.25;
    }

    addMustache() {
        const material = new THREE.MeshPhongMaterial({
            color: 0xcc613d,
            flatShading: true
        });

        const mustacheGeo = new THREE.BoxGeometry(0.6, 0.2, 0.25);
        const mustacheLeft = new THREE.Mesh(mustacheGeo, material);
        const mustacheRight = new THREE.Mesh(mustacheGeo, material);

        this.base.add(mustacheLeft);
        this.base.add(mustacheRight)

        mustacheLeft.position.set(-0.25, 1.55, 0.7);
        mustacheRight.position.set(0.25, 1.55, 0.7);


        mustacheLeft.rotation.z = Math.PI / 8;
        mustacheRight.rotation.z = -Math.PI / 8;
    }

    addHelmet() {
        const boneMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });

        const helmetGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
        const helmet = new THREE.Mesh(helmetGeo, this.steelMaterial);

        const hornGeo = new THREE.BoxGeometry(1.1, 0.25, 0.25);
        const hornLeftBottom = new THREE.Mesh(hornGeo, boneMaterial);
        const hornLeftTop = new THREE.Mesh(hornGeo, boneMaterial);

        this.base.add(helmet);
        this.base.add(hornLeftBottom);
        this.base.add(hornLeftTop);

        helmet.position.set(0, 3, 0);
        hornLeftBottom.position.set(-0.75, 3.1, 0);
        hornLeftTop.position.set(-1.3, 3.6, 0);

        hornLeftTop.rotation.z = Math.PI / 2 + 0.25;
    }

    addBody() {
        const shape1 = new THREE.Shape();
        const shape2 = new THREE.Shape();

        shape1.moveTo(-2, -0.5);
        shape1.lineTo(-1.5, -3.5);
        shape1.lineTo(1.5, -3.5);
        shape1.lineTo(2, -0.5);
        shape1.lineTo(2, 0);
        shape1.lineTo(2, 0.5);
        shape1.lineTo(-2, 0.5);
        shape1.lineTo(-2, 0);

        shape2.moveTo(-1.95, -0.5);
        shape2.lineTo(-1.5, -1.25);
        shape2.lineTo(1.5, -1.25);
        shape2.lineTo(1.9, -0.5);
        shape2.lineTo(1.95, 0);
        shape2.lineTo(1.95, 0.5);
        shape2.lineTo(-1.95, 0.5);
        shape2.lineTo(-1.95, 0)

        const extrudeSettings = {
            steps: 2,
            depth: 1.75,
            bevelEnabled: false
        };

        const bodyGeo = new THREE.ExtrudeBufferGeometry(shape1, extrudeSettings);
        const body = new THREE.Mesh(bodyGeo, this.skinMaterial);

        const upperBodyGeo = new THREE.ExtrudeBufferGeometry(shape2, extrudeSettings);
        const upperBody = new THREE.Mesh(upperBodyGeo, this.skinMaterial);

        const beltGeo = new THREE.BoxGeometry(3.5, 0.5, 2.1);
        const belt = new THREE.Mesh(beltGeo, this.steelMaterial);

        this.base.add(body);
        this.base.add(upperBody);
        this.base.add(belt);

        body.castShadow = true;
        upperBody.castShadow = true;
        belt.castShadow = true;

        upperBody.receiveShadow = true;
        body.receiveShadow = true;
        belt.receiveShadow = true;

        body.position.set(0, 0.75, -1.25);
        upperBody.position.set(0, 0.525, -1.155);
        belt.position.set(0, -2.5, -0.4);

        upperBody.rotation.x = -Math.PI / 24;
    }

    addLeftArm() {
        const bicepGeo = new THREE.BoxGeometry(2.5, 1, 1);
        const bicep = new THREE.Mesh(bicepGeo, this.skinMaterial);
        const foreArmGeo = new THREE.BoxGeometry(2.5, 1.25, 1.25);
        const foreArm = new THREE.Mesh(foreArmGeo, this.skinMaterial);

        this.base.add(bicep);
        this.base.add(foreArm);

        bicep.castShadow = true;
        foreArm.castShadow = true;

        bicep.position.set(-2, 0, 0.2);
        bicep.rotation.z = Math.PI / 4;
        bicep.rotation.y = Math.PI / 4;

        foreArm.position.set(-2.4, 0, 1.2);
        foreArm.rotation.z = -Math.PI / 2 - 0.3;
        foreArm.rotation.x = Math.PI / 8;
    }

    addRightArm() {
        const bicepGeo = new THREE.BoxGeometry(2.5, 1, 1);
        const bicep = new THREE.Mesh(bicepGeo, this.skinMaterial);
        const foreArmGeo = new THREE.BoxGeometry(2.5, 1.25, 1.25);
        const foreArm = new THREE.Mesh(foreArmGeo, this.skinMaterial);

        this.base.add(bicep);
        this.base.add(foreArm);

        bicep.castShadow = true;
        foreArm.castShadow = true;

        bicep.position.set(2, 0, -0.25);
        bicep.rotation.z = -Math.PI / 4;
        bicep.rotation.y = -Math.PI / 8;

        foreArm.position.set(2.4, -1.5, 0.42);
        foreArm.rotation.z = Math.PI / 2 - 0.3;
        foreArm.rotation.x = -Math.PI / 8;
    }

    addArms() {
        this.addLeftArm();
        this.addRightArm();
    }

    addLegs() {
        const pantsGeo = new THREE.BoxGeometry(3.25, 0.6, 1.8);
        const pants = new THREE.Mesh(pantsGeo, this.materialDark);

        const legGeo = new THREE.BoxGeometry(1.25, 1, 1.4);
        const legLeft = new THREE.Mesh(legGeo, this.materialDark);

        const bootGeo1 = new THREE.BoxGeometry(1, 0.8, 1);
        const bootGeo2 = new THREE.BoxGeometry(1, 0.45, 1)

        const bootTopLeft = new THREE.Mesh(bootGeo1, this.materialDarkest);
        const bootBottomLeft = new THREE.Mesh(bootGeo2, this.materialDarkest);
        this.leftLeg = bootBottomLeft;

        this.base.add(pants);
        this.base.add(legLeft);
        this.base.add(this.applyedLeg);
        this.base.add(bootTopLeft);
        this.base.add(bootBottomLeft);

        pants.castShadow = true;
        legLeft.castShadow = true;
        bootTopLeft.castShadow = true;
        bootBottomLeft.castShadow = true;

        pants.position.set(0, -2.75, -0.4);
        legLeft.position.set(-0.75, -3.5, -0.35);
        bootTopLeft.position.set(-0.75, -4.4, -0.35);
        bootBottomLeft.position.set(-0.75, -4.58, 0.1);
    }

    walk() {
        const dx = this.targetPosition.x - this.positionX;
        const dz = this.targetPosition.z - this.positionZ;
        this.targetRotation = Math.atan2(dx, dz);
        this.currentRotation += (this.targetRotation - this.currentRotation) * 0.5;

        this.walkCycle += 2; // ⬅️ increased from 0.1 to 0.25

        // Legs
        this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.1;
        this.rightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.1;

        // Forward movement
        this.base.position.z -= 0.10;
    }

    run() {
        this.walkCycle += 0.3;

        // Faster, stronger swing
        this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.8;
        this.rightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.8;

        // leftArm.rotation.x = Math.sin(walkCycle + Math.PI) * 0.6;
        // rightArm.rotation.x = Math.sin(walkCycle) * 0.6;

        // Move forward faster
        this.base.position.z -= 0.15;
    }

    addWeapon() {
        const group = new THREE.Group();

        group.add(this.applyedWeapon);

        this.base.add(group);

        group.position.set(-1.8, 1.5, 0);
        group.rotation.y = Math.PI / 2;
        group.rotation.x = Math.PI / 12;
    }

    animate() {
        // this.requestAnimationFrame(this.animate);

        if (this.isWalking) this.walk();
        if (this.isRunning) this.run();

        // renderer.render(scene, camera);
    }

    toggleLegsMenu() {
        const element = document.querySelector('.leg-options');
        const signElement = document.querySelector('.add-sign-legs');

        this.legOptionsOpen = !this.legOptionsOpen;

        element.style.visibility = this.legOptionsOpen ? 'visible' : 'hidden';
        element.style.opacity = this.legOptionsOpen ? 1 : 0;
        signElement.style.transform = this.legOptionsOpen ? "rotate(45deg)" : "rotate(0deg)";
    }

    toggleWeaponsMenu() {
        const element = document.querySelector('.weapon-options');
        const signElement = document.querySelector('.add-sign-weapon');

        this.weaponOptionsOpen = !this.weaponOptionsOpen;

        element.style.visibility = this.weaponOptionsOpen ? 'visible' : 'hidden';
        element.style.opacity = this.weaponOptionsOpen ? 1 : 0;
        signElement.style.transform = this.weaponOptionsOpen ? "rotate(45deg)" : "rotate(0deg)";
    }

    applyLegs(value) {
        const legs = {
            0: this.addRightLeg(),
            1: this.pegLeg()
        }

        this.applyedLeg = legs[value];
        this.draw_character();
    }

    applyWeapon(value) {
        const weapons = {
            0: axe(),
            1: sword()
        }

        this.applyedWeapon = weapons[value];
        this.draw_character();
    }

    draw_character() {
        this.addHead();
        this.addBeard();
        this.addMustache();
        this.addBody();
        this.addLegs();
        this.addArms();
        this.addWeapon();
        this.animate();
        return this.base;
    }

    getLevelFromXP(xp) {
        let level = 1;
        let xpNeeded = 0;

        // formula: xp needed = 50 * (level ^ 2)
        while (xp >= xpNeeded) {
            level++;
            xpNeeded = 50 * Math.pow(level, 2);
        }

        return level - 1;
    }

    addExperience(skillName, amount) {
        const skill = this.skills[skillName];
        if (!skill) return;

        const currentLevel = this.getLevelFromXP(skill.experience_points);
        skill.experience_points += amount;
        skill.total_points_available += amount;
        const newLevel = this.getLevelFromXP(skill.experience_points);

        if (newLevel > currentLevel) {
            console.log(`🎉 ${skillName.toUpperCase()} leveled up! ${skillName} → ${newLevel}`);
        }
    }

    // Generic function to drain any stat
    drainStat(skill, amount) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            skillData.total_points_available = Math.max(skillData.total_points_available - amount, 0);  // Ensure the stat doesn't drop below 0
            console.log(`${skill} drained by ${amount}. New ${skill} level: ${skillData.total_points_available}`);
        } else {
            console.error("Skill not found!");
        }
    }

    // Function to regenerate any stat back to max over time
    regenerateStat(skill, amount = 0) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            const regenerationRate = skill.regenerationRates || 0.2; // Use the defined regeneration rate for each skill

            if (amount) {
                skillData.total_points_available += amount;
                console.log(`${skill} manually regenerated by ${amount}.`);
            }

            // Ensure total_points_available doesn't exceed level
            if (skillData.total_points_available > skillData.level) {
                skillData.total_points_available = skillData.level;
            }

            // Only regenerate if the current level is less than the max level
            if (skillData.total_points_available < skillData.maxLevel && skillData.total_points_available < skillData.level) {
                // Calculate the regeneration amount based on the max level
                let regenerationAmount = (skillData.maxLevel - skillData.total_points_available) * regenerationRate;

                // Apply the regeneration
                skillData.total_points_available += regenerationAmount;

                // Ensure the stat doesn't exceed the max level or level
                if (skillData.total_points_available >= skillData.maxLevel) {
                    skillData.total_points_available = skillData.maxLevel; // Clamp to max level if it reaches or exceeds max
                    console.log(`${skill} reached max level. Regeneration stopped.`);
                } else if (skillData.total_points_available >= skillData.level) {
                    skillData.total_points_available = skillData.level; // Clamp to level if it exceeds level
                    console.log(`${skill} reached level limit. Regeneration stopped.`);
                    this.stopRegeneration(skill); // Stop the interval when total_points_available equals level
                } else {
                    console.log(`${skill} regenerated.`);
                }
            } else {
                console.log(`${skill} is already at max level or at its level limit. No regeneration needed.`);
            }
        } else {
            console.error("Skill not found or player is mining!");
        }

        // this.displayStats();
    }

    // Function to start regeneration interval for a skill
    startRegeneration(skill) {
        // Ensure we are not already regenerating the skill
        if (!skill.regenerationIntervals) {
            skill.regenerationIntervals = setInterval(() => this.regenerateStat(skill), 1000); // Regenerate every second
            console.log(`Started regeneration for ${skill}`);
        }
    }

    // Function to stop regeneration interval for a skill
    stopRegeneration(skill) {
        if (skill.regenerationIntervals) {
            clearInterval(skill.regenerationIntervals);
            delete skill.regenerationIntervals[skill]; // Clean up the interval reference
            console.log(`Stopped regeneration for ${skill}`);
        }
    }

    takeDamage(damage, attacker) {
        if (!this.alive) return;
        this.skills.hp.experience_points -= this.getLevelFromXP(this.skills.hp.experience_points) - damage;
        // addMessage('Game', `${this.name} takes ${damage} damage!`);
        this.attack(attacker);
        if (this.getLevelFromXP(this.skills.hp.experience_points) <= 0) {
            this.die();
        }
    }

    attack(target) {
        if (!this.alive) return;
        const damage = Math.max(1, this.getLevelFromXP(this.skills.strength.experience_points) - target.stats.defense); // Basic attack formula
        // addMessage('Game', `${this.name} attacks player for ${damage} damage!`);
        target.takeDamage(damage, this);
    }

    die() {
        this.alive = false;
        this.scene.remove(this.model);
        this.drop();
        setTimeout(() => this.respawn(), 5000); // Respawns after 50 seconds
    }

    respawn() {
        this.stats.hp = this.maxHp;
        this.alive = true;
        this.model = this.createModel();
        this.scene.add(this.model);
    }

    drop() {
        const drops = {
            "Coins": 100,
            "Bones": 1,
            "Deer Hide": 1,
            "Deer Meat": 1
        };

        Object.keys(drops).forEach(item => {
            this.spawnLoot(item, drops[item]);
        });

        console.log("Deer dropped loot on the ground!");
    }

    fish(source) {
        if (this.inventory.inventory.length < 28) {
            console.log(source);
            if (this.getLevelFromXP(this.skills.agility.experience_points) <= 1 || this.getLevelFromXP(this.skills.strength.experience_points) <= 1) {
                // addMessage('Game', "You're too exhausted to keep fishing. Rest to recover.");
                this.startRegeneration("agility");
                this.startRegeneration("strength");
                return;
            }

            const virginiaFish = ["Largemouth Bass", "Bluegill", "Brook Trout", "Channel Catfish", "Smallmouth Bass", "American Shad", "Longnose Gar"];
            const baseRate = 5; // Base seconds per catch
            const agilityFactor = Math.max(1, 10 - Math.floor(this.getLevelFromXP(this.skills.agility.experience_points) / 20)); // Faster with higher agility
            const strengthFactor = Math.max(1, 10 - Math.floor(this.getLevelFromXP(this.skills.strength.experience_points) / 20)); // Faster with higher strength
            const fishingSpeed = Math.max(1, baseRate - Math.floor((agilityFactor + strengthFactor) / 2)); // Balanced rate
            // addMessage('Game', `Casting line...`);

            let fishingInterval = setInterval(() => {
                if (this.getLevelFromXP(this.skills.agility.experience_points) <= 0 || this.getLevelFromXP(this.skills.strength.experience_points) <= 0) {
                    // addMessage('Game', "You're too exhausted to keep fishing. Rest to recover.");
                    clearInterval(fishingInterval);
                    this.startRegeneration("agility");
                    this.startRegeneration("strength");
                    return;
                }

                let caughtFish = virginiaFish[Math.floor(Math.random() * virginiaFish.length)];
                this.inventory.add_to_inventory({ name: caughtFish, quantity: 1, pickupable: true, cookable: true, raw: true });
                // addMessage('Game', `You caught a ${caughtFish}!`);

                this.drainStat("agility", 3);
                this.drainStat("strength", 3);

                this.addExperience("agility", 75);
                this.addExperience("strength", 75);

                console.log(this.inventory.inventory);

                // drainAgility();
                // drain strength
                // playerStats.strength = Math.max(0, playerStats.strength - 2);

                if (this.inventory.inventory.length === 28) {
                    clearInterval(fishingInterval); // Terminate the interval
                    // Optional: Perform any cleanup or final actions here
                }

            }, fishingSpeed * 1000);
        }
    }

    // Function to simulate mining ore
    mineOre(mine) {
        // if (!playerHasPickaxe()) {
        //     console.log("You need a pickaxe to mine!");
        //     return;
        // }

        // Start mining interval
        let miningInterval = setInterval(() => {
            // Stop mining if agility is 0 or max experience is reached
            if (this.skills.agility.total_points_available === 0) {
                // addMessage("Game", "You have run out of agility and can no longer mine.");
                clearInterval(miningInterval);
                this.startRegeneration('agility');

                if (this.skills.strength.total_points_available === 0) {
                    // addMessage("Game", "You have run out of strength and can no longer mine.");
                    this.startRegeneration('strength');
                }

                // if (hasMaxExperience()) {
                //     addMessage("Game", "You have reached max experience!");
                // }
                return;
            }

            // Simulate mining
            this.inventory.add_to_inventory({ name: mine.type });

            // addMessage("Game", `Mined a ${mine.type}!`);

            // Drain agility after each mining action
            this.drainStat("agility", 7);
            this.drainStat("strength", 4);

            // Increment experience after each ore mined (you can customize how much experience is gained)
            this.addExperience("strength", 4);
            this.addExperience("agility", 7);

        }, this.calculateActivitySpeed()); // Uses calculated mining speed based on player stats
    }

    // Helper function to calculate activity speed
    calculateActivitySpeed() {
        const baseSpeed = 1000;  // Base speed of 1 second per activity action
        const agilityFactor = 0.05;  // Agility impact on speed
        const strengthFactor = 0.03;  // Strength impact on speed

        // Calculate activity speed where higher agility and strength reduce the time between actions
        let activitySpeed = baseSpeed - (this.skills.agility.experience_points * agilityFactor * baseSpeed) - (this.skills.strength.experience_points * strengthFactor * baseSpeed);

        // Ensure activity speed doesn't go below a minimum threshold (e.g., 200ms)
        activitySpeed = Math.max(activitySpeed, 200); // Minimum speed (200ms)

        return activitySpeed;
    }

    smelt() {
        let smeltedItems = [];

        this.inventory.inventory.forEach((item, index) => {
            if (item.name.includes("ore")) {
                let barType = item.name.replace("ore", "bar").trim(); // Convert "iron ore" → "iron bar"

                setTimeout(() => {
                    if (!this.inventory[index]) {
                        this.inventory.removeFromInventory(item, 1);
                        this.inventory.add_to_inventory({ ...item, name: barType, quantity: 1, type: barType });

                        smeltedItems.push({ ...item, name: barType });
                        console.log(`Smelted 1 ${item.name} → ${barType}`);
                        this.addExperience("craft", 10);
                    }
                }, this.calculateActivitySpeed() * index); // Delay increases per item
            }
        });

        return smeltedItems;
    }


    createOpenLogFire(position) {
        const fireGroup = new THREE.Mesh();
        const data = { isFire: true, name: "Log Fire" }
        fireGroup.userData = data

        // Create logs
        const logMaterial = new THREE.MeshStandardMaterial({ color: "#8B4513" });
        logMaterial.userData = data
        for (let i = 0; i < 5; i++) {
            const logGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 12);
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.userData = data
            log.rotation.z = Math.random() * Math.PI / 2;
            log.rotation.y = Math.random() * Math.PI;
            log.position.set(
                position.x + Math.random() * 1 - 0.5,
                position.y + 0.2,
                position.z + Math.random() * 1 - 0.5
            );
            fireGroup.add(log);
        }

        // Create embers
        const emberMaterial = new THREE.MeshStandardMaterial({ emissive: "#FF4500" });
        emberMaterial.userData = { isFire: true }
        const emberGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const embers = new THREE.Mesh(emberGeometry, emberMaterial);
        embers.userData = { isFire: true }
        embers.position.set(position.x, position.y + 0.1, position.z);
        fireGroup.add(embers);

        // Fire particles
        const fireParticles = new THREE.Mesh();
        fireParticles.userData = { isFire: true }
        const fireMaterial = new THREE.MeshStandardMaterial({ emissive: "#FF6347", transparent: true, opacity: 0.8 });
        fireMaterial.userData = { isFire: true }
        for (let i = 0; i < 10; i++) {
            const flame = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), fireMaterial);
            flame.position.set(position.x, position.y + 0.5 + Math.random() * 0.5, position.z);
            fireParticles.add(flame);
        }
        fireGroup.add(fireParticles);

        // Fire light
        const fireLight = new THREE.PointLight("#FFA500", 1.5, 5);
        fireLight.userData = { isFire: true }
        fireLight.position.set(position.x, position.y + 1, position.z);
        fireGroup.add(fireLight);

        // Flicker animation
        function animateFire() {
            fireParticles.children.forEach(particle => {
                particle.position.y += Math.random() * 0.02;
                particle.material.opacity = 0.5 + Math.random() * 0.5;
            });
            fireLight.intensity = 1 + Math.random() * 0.5;
            requestAnimationFrame(animateFire);
        }
        animateFire();

        this.scene.add(fireGroup);
        return fireGroup;
    }

    cook(cookingMethod) {
        console.log(cookingMethod);
        let cookedItems = [];
        let burntItems = [];
        let craftExpDrain = 500; // Craft XP drains per cook attempt
        let baseSuccessRate = Math.min(95, Math.max(30, this.skills.craft.total_points_available / 1000000)); // 30% min, 95% max

        this.inventory.inventory.forEach(item => {
            if (item.raw && item.cookable) {
                let successRate = Math.max(10, baseSuccessRate - (5000000 / (this.skills.craft.total_points_available + 1))); // XP drain affects success
                let success = Math.random() * 100 < successRate;

                let cookedItem = {
                    name: success ? `Cooked ${item.name}` : `Burnt ${item.name}`,
                    raw: false,
                    pickupable: true,
                    cookable: success && item.cookable // Cooked items might stay cookable
                };

                this.inventory.removeFromInventory(item, 1);
                this.inventory.add_to_inventory(cookedItem);

                if (success) {
                    cookedItems.push(cookedItem.name);
                    this.addExperience("craft", 10);
                } else {
                    burntItems.push(cookedItem.name);
                    this.addExperience("craft", 1);
                }
            }
        });

        if (cookedItems.length > 0 || burntItems.length > 0) {
            // addMessage('Game', `Using ${cookingMethod.name}, you cooked: ${cookedItems.join(", ")}`);
            // addMessage('Game', `Burnt items: ${burntItems.join(", ")}`);
            // console.log
        } else {
            // addMessage('Game', "You have nothing raw to cook.");
        }

        return String;
    }

    // Opens the Fletching UI
    fletch() {
        const fletchUI = document.getElementById("fletchUI");
        const fletchItemsContainer = document.getElementById("fletch-items");
        fletchItemsContainer.innerHTML = ""; // Clear previous items

        // List of fletchable items
        const fletchableItems = [
            { name: "Shortbow", material: "log", cost: 1 },
            { name: "Longbow", material: "log", cost: 2 },
            { name: "Arrow Shafts", material: "log", cost: 1 },
            { name: "Arrows", material: "arrow shafts", secondary: "arrow heads", cost: 1 },
            { name: "Crossbow", material: "log", secondary: "iron bar", cost: 1 }
        ];

        // Generate item grid
        fletchableItems.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("fletch-item");

            itemElement.innerHTML = `
            <div class="fletch-item-name">${item.name}</div>
        `;

            // Create button separately so we can bind `this`
            const button = document.createElement("button");
            button.textContent = "Fletch";

            // Bind class method properly
            button.addEventListener("click", () => {
                console.log(item);
                this.fletchItem(item.name, item.material, item.secondary || "", item.cost, undefined, this.inventory.inventory);
                this.addExperience("craft", item.cost * 4);
            });

            itemElement.appendChild(button);
            fletchItemsContainer.appendChild(itemElement);
        });

        // Show the fletching UI
        this.toggleFletchUI();
    }

    // Toggles the Fletching UI
    toggleFletchUI() {
        const fletchUI = document.getElementById("fletchUI");
        fletchUI.style.display = (fletchUI.style.display === "block") ? "none" : "block";
    }

    fletchItem(itemName, material, secondary, cost, type) {
        function getInventoryItemByMaterial(material, inventory) {
            let foundItem = 0; // Default to 0 if no match is found

            inventory.forEach(item => {
                if (item.name.toLowerCase().includes(material.toLowerCase())) {
                    return foundItem = item; // Store the first matching item quantity
                }
            });

            return foundItem;
        }

        const inventoryItem = getInventoryItemByMaterial(material, this.inventory.inventory);
        const secondaryItem = getInventoryItemByMaterial(secondary, this.inventory.inventory);

        // Check if player has enough primary material
        if (!inventoryItem) {
            return console.log(`Not enough ${material} to fletch a ${itemName}.`);
        }

        // If secondary material is required, check for it
        else if (!secondaryItem && secondary) {
            return console.log(`Not enough ${secondary} to fletch ${itemName}.`);
        }

        else if (inventoryItem) {
            // Deduct materials
            this.inventory.removeFromInventory(inventoryItem, cost)
            if (secondary) {
                this.inventory.removeFromInventory(secondaryItem, cost)
            }

            // Add the fletched item
            const line = `${type && type || ""} ${inventoryItem.type}`;
            const cleaned = line
                .replace(/\bbar\b/gi, "")
                .replace(/\s+/g, " ")
                .trim();

            this.inventory.add_to_inventory({ name: `${cleaned} ${itemName}`, type: inventoryItem.type, equipable: true, equipType: 'both_hands', pickupable: true })
            this.inventory.update_inventory_UI();
        }

        if (inventoryItem.type.includes("iron")) {
            this.toggleSmithUI()
        } else this.toggleFletchUI();
    }

    // Opens the Smithing UI
    smith() {
        const smithUI = document.getElementById("smithUI");
        const smithItemsContainer = document.getElementById("smithItems");
        smithItemsContainer.innerHTML = ""; // Clear previous items

        // List of smithable items
        const smithableItems = [
            { name: "Arrow Heads", material: "bar", cost: 1 },
            { name: "Platelegs", material: "bar", cost: 3 },
            { name: "Platebody", material: "bar", cost: 5 },
            { name: "Boots", material: "bar", cost: 2 },
            { name: "Gloves", material: "bar", cost: 1 },
            { name: "Sword", material: "bar", cost: 3 },
            { name: "Shield", material: "bar", cost: 4 },
            { name: "Helmet", material: "bar", cost: 3 }
        ];

        // Generate item grid
        smithableItems.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("smith-item");

            // Add item name
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("smith-item-name");
            nameDiv.textContent = item.name;

            // Create the button
            const button = document.createElement("button");
            button.textContent = "Smith";

            // Properly bind class methods
            button.addEventListener("click", () => {
                this.fletchItem(item.name, item.material, item.secondary || "", item.cost);
                this.addExperience("craft", 10);
            });

            // Assemble UI
            itemElement.appendChild(nameDiv);
            itemElement.appendChild(button);
            smithItemsContainer.appendChild(itemElement);
        })

        // Show the smithing UI
        this.toggleSmithUI();
    }

    // Toggles the smith UI
    toggleSmithUI() {
        const smithUI = document.getElementById("smithUI");
        smithUI.style.display = (smithUI.style.display === "block") ? "none" : "block";
    }

    // Opens Bank UI
    openBank() {
        document.getElementById("bankUI").style.display = "block";
        // document.getElementById("popup").style.display = "block";
        this.updateBankDisplay();
        this.banking = true;
    }

    // Closes Bank UI
    closeBank() {
        document.getElementById("bankUI").style.display = "none";
        // document.getElementById("popup").style.display = "none";
        this.banking = false;
    }

    // Getter for bank storage
    getBankStorage(itemName) {
        console.log(this.bankStorage);
        console.log(itemName);
        return this.bankStorage[itemName] || null;
    }

    // Setter for bank storage (handles stacking properly)
    setBankStorage(itemName, quantity, withdraw = false) {
        if (this.bankStorage[itemName]) {
            if (withdraw) {
                this.bankStorage[itemName].quantity -= quantity;
            } else {
                this.bankStorage[itemName].quantity += quantity;
            }
        } else {
            this.bankStorage[itemName] = { name: itemName, quantity: quantity };
        }
    }

    // Deposits an item into the bank
    depositItem(quantity) {
        console.log(5);
        console.log(quantity);
        if (!this.currentBankingItem) {
            console.log(`Not enough ${this.currentBankingItem.name} to deposit.`);
            return;
        }

        // Handle "all" case and ensure we don’t overdraw
        if (quantity === "all" || quantity >= this.currentBankingItem.quantity) {
            quantity = this.currentBankingItem.quantity;
        }

        // Remove from inventory first
        this.inventory.removeFromInventory(this.currentBankingItem, quantity);

        // Use setter to update bank storage
        this.setBankStorage(this.currentBankingItem.name, quantity);

        this.updateBankDisplay();
        this.inventory.updateInventoryUI();
    }


    // Withdraws an item from the bank
    withdrawItem(itemName, quantity) {
        let bankedItem = this.getBankStorage(itemName);

        if (!bankedItem) {
            console.log(`Not enough ${itemName} in the bank.`);
            return;
        }

        // Handle "all" case and ensure we don’t overdraw
        if (quantity === "all" || quantity > bankedItem.quantity) {
            quantity = bankedItem.quantity;
        }

        this.withdrawing = false;

        if (bankedItem.quantity < 1) {
            return;
        }

        this.setBankStorage(itemName, quantity, true); // Update storage

        // Add the item to the player's inventory
        this.inventory.add_to_inventory({ ...bankedItem, quantity });
        this.updateBankDisplay();
        this.inventory.updateInventoryUI();
    }


    // Updates the bank UI
    updateBankDisplay() {
        let bankUI = document.getElementById("bankItems");
        bankUI.innerHTML = "";

        console.log(this.bankStorage);

        for (let item in this.bankStorage) {
            console.log(item);
            let itemElement = document.createElement("div");
            itemElement.className = "bank-item";
            itemElement.innerHTML = `<img src="spell-icon.png"> ${this.bankStorage[item].name} x${this.bankStorage[item].quantity}`;

            itemElement.addEventListener("click", () => this.withdrawItem(item, this.bankStorage[item].quantity)); // Left-click withdraw all
            itemElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.withdrawing = true;
                this.inventory.showInventoryContextMenu(e, item, "withdraw");
            });

            bankUI.appendChild(itemElement);
        }
    }

}

