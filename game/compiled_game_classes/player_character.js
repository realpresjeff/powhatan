import { bow, sword, axe, wizardWand } from './weapons/index.js';
import { Inventory } from './inventory.js';
import { createHealthBar3D, createDamageSplash } from './healthbar.js';
import socket from './socket.js';
import { Monster } from './monster.js';
import { goldNecklace, bearClaws } from './clothing/index.js';
function generateUniqueUsername(prefix = "Player") {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const time = Date.now().toString(36).slice(-4).toUpperCase();
    return `${prefix}_${rand}${time}`;
}
const materialLight = new THREE.MeshPhongMaterial({ color: 0xa3835b });
const steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
const bearFurMaterial = new THREE.MeshPhongMaterial({
    color: 0x5a3a1a, // dark brown fur
    flatShading: true
});
export var EquipType;
(function (EquipType) {
    EquipType["both_hands"] = "both_hands";
    EquipType["both_shoes"] = "both_shoes";
    EquipType["right_hand"] = "right_hand";
    EquipType["left_hand"] = "left_hand";
    EquipType["helmet"] = "helmet";
    EquipType["torso"] = "torso";
    EquipType["pants"] = "pants";
    EquipType["ring"] = "ring";
    EquipType["necklace"] = "necklace";
    EquipType["left_shoe"] = "left_shoe";
    EquipType["right_shoe"] = "right_shoe";
    EquipType["arrows"] = "arrows";
    EquipType["legs"] = "legs";
    EquipType["gloves"] = "gloves";
    EquipType["belt"] = "belt";
    EquipType["wings"] = "wings";
})(EquipType || (EquipType = {}));
export class Character {
    constructor(scene, isThisPlayer = true, playerId) {
        this.playerId = socket.socket.id;
        // Materials
        this.materialDarkest = new THREE.MeshPhongMaterial({ color: 0x33281b });
        this.materialDark = new THREE.MeshPhongMaterial({ color: 0x664e31 });
        this.materialLight = new THREE.MeshPhongMaterial({ color: 0xa3835b });
        this.steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
        this.skinMaterial = undefined;
        this.base = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({ color: 0xffdbac }));
        // Animation state
        this.walkCycle = 0;
        this.isWalking = false;
        this.isRunning = false;
        // References for animating limbs
        this.leftLeg = null;
        this.rightLeg = null;
        this.leftArm = null;
        this.rightArm = null;
        // Customisations
        this.legOptionsOpen = false;
        this.weaponOptionsOpen = false;
        this.applyedLeg = this.addRightLeg();
        this.applyedWeapon = wizardWand();
        this.currentRotation = 0;
        this.scene = null;
        this.inventory = null;
        this.skills = {
            hp: { experience_points: 1000, total_points_available: 1000 },
            strength: { experience_points: 10000, total_points_available: 10000 },
            defense: { experience_points: 10000, total_points_available: 10000 },
            craft: { experience_points: 10000, total_points_available: 10000 },
            mage: { experience_points: 10000, total_points_available: 10000 },
            archer: { experience_points: 10000, total_points_available: 10000 },
            agility: { experience_points: 10000, total_points_available: 10000 },
        };
        this.inCombat = false;
        this.alive = true;
        this.name = generateUniqueUsername();
        this.bankStorage = {}; // Stores banked items
        this.banking = false;
        this.withdrawing = false;
        this.weaponGroup = undefined;
        this.equippedItems = {
            [EquipType.helmet]: null,
            [EquipType.torso]: null,
            [EquipType.pants]: null,
            [EquipType.left_hand]: { name: "iron sword", equipable: true, equipType: EquipType.left_hand },
            [EquipType.right_hand]: null,
            [EquipType.left_shoe]: { name: "leather boots", equipable: true, equipType: EquipType.left_shoe },
            [EquipType.right_shoe]: { name: "leather boots", equipable: true, equipType: EquipType.right_shoe },
            [EquipType.ring]: null,
            [EquipType.necklace]: { name: "gold necklace", equipable: true, equipType: EquipType.necklace },
            [EquipType.belt]: null,
            [EquipType.wings]: null,
        };
        this.activeSpell = null;
        this.combatMode = null;
        this.autoAttack = false;
        this.specialReady = false;
        this.healthBar = null;
        this.isAnimating = false;
        this.stats = {
            hp: undefined,
            strength: undefined,
            defense: undefined,
            mage: undefined,
            archer: undefined
        };
        this.isThisPlayer = true;
        this.activeSummon = null;
        this.maxSummons = 1;
        this.fetch_player_items = () => {
            this.inventory.add_to_inventory({
                name: "pickaxe",
                pickupable: true,
                equipable: true,
                equipType: EquipType.right_hand
            });
            this.inventory.add_to_inventory({
                name: "iron ore",
                pickupable: true
            });
            this.inventory.add_to_inventory({
                name: "iron ore",
                pickupable: true
            });
            this.inventory.add_to_inventory({
                name: "iron ore",
                pickupable: true
            });
            this.inventory.add_to_inventory({
                name: "iron ore",
                pickupable: true
            });
            this.inventory.add_to_inventory({
                name: "iron ore",
                pickupable: true
            });
            this.inventory.add_to_inventory({
                name: "pine shortbow",
                pickupable: true,
                equipable: true,
                equipType: EquipType.both_hands
            });
            this.inventory.add_to_inventory({
                name: "battle axe",
                pickupable: true,
                equipable: true,
                equipType: EquipType.both_hands
            });
            this.inventory.add_to_inventory({
                name: "sealing scroll",
                pickupable: true,
                imageName: "scroll"
            });
            this.inventory.add_to_inventory({
                name: "coins",
                pickupable: true,
                imageName: "coins",
                quantity: 200
            });
        };
        this.isThisPlayer = isThisPlayer;
        this.scene = scene;
        this.inventory = new Inventory({ scene, showContextMenu: () => { }, character: this, player: this.base });
        this.fetch_player_items();
        this.displayStats();
        this.setupCombatUI();
        this.stats = {
            hp: this.getLevelFromXP(this.skills["hp"].experience_points),
            strength: this.getLevelFromXP(this.skills["strength"].experience_points),
            defense: this.getLevelFromXP(this.skills["defense"].experience_points),
            mage: this.getLevelFromXP(this.skills["mage"].experience_points),
            archer: this.getLevelFromXP(this.skills["archer"].experience_points)
        };
        this.characterConfig = {
            gender: "male",
            skinColor: 0xffdbac,
            hairStyle: "ponytail",
            hairColor: 0xcc613d,
            beardColor: 0xcc613d,
            beard: false,
            mustache: false,
            bald: false
        };
        this.skinMaterial = new THREE.MeshPhongMaterial({
            color: this.characterConfig.skinColor,
            flatShading: false
        });
        if (this.isThisPlayer) {
            this.characterConfig = this.getCharacterConfigFromUI();
            this.bindCharacterCustomizationUI();
            this.bindLogoutButton();
        }
        this.base.position.y = 5;
        if (playerId) {
            this.playerId = playerId;
        }
    }
    addHealthBar() {
        this.healthBar = createHealthBar3D();
        this.healthBar.position.set(0, 5, 0);
        this.base.add(this.healthBar);
    }
    // Legs
    pegLeg() {
        const pegLegGeo = new THREE.BoxGeometry(0.5, 1.8, 0.5);
        const leg = new THREE.Mesh(pegLegGeo, this.materialLight);
        const stumpUpperGeo = new THREE.BoxGeometry(1, 0.75, 1);
        const stumpUpper = new THREE.Mesh(stumpUpperGeo, this.materialLight);
        const stumpMaterial = new THREE.MeshPhongMaterial({ color: 0x26211a });
        const stumpGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
        const stump = new THREE.Mesh(stumpGeo, stumpMaterial);
        const group = new THREE.Group();
        stump.position.set(1, -4.65, -0.34);
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
        const bootGeo2 = new THREE.BoxGeometry(1, 0.45, 1);
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
            color: this.characterConfig.beardColor,
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
        primaryBeard.position.set(0.5, 1.5, 1.65);
        secondaryBeardLeft.position.set(1.1, 1.4, 1.3);
        secondaryBeardRight.position.set(-0.18, 1.4, 1.55);
        primaryBeard.rotation.y = -Math.PI / 2;
        secondaryBeardLeft.rotation.y = -Math.PI / 2 + 0.25;
        secondaryBeardRight.rotation.y = -Math.PI / 2 - 0.25;
    }
    addMustache() {
        const material = new THREE.MeshPhongMaterial({
            color: this.characterConfig.beardColor,
            flatShading: true
        });
        const mustacheGeo = new THREE.BoxGeometry(0.6, 0.2, 0.25);
        const mustacheLeft = new THREE.Mesh(mustacheGeo, material);
        const mustacheRight = new THREE.Mesh(mustacheGeo, material);
        this.base.add(mustacheLeft);
        this.base.add(mustacheRight);
        mustacheLeft.position.set(-0.25, 1.55, 0.7);
        mustacheRight.position.set(0.25, 1.55, 0.7);
        mustacheLeft.rotation.z = Math.PI / 8;
        mustacheRight.rotation.z = -Math.PI / 8;
    }
    addBody(shirt = false, female = false) {
        const shape1 = new THREE.Shape();
        const shape2 = new THREE.Shape();
        // -----------------------------------
        // BODY SILHOUETTE
        // -----------------------------------
        if (!female) {
            // MALE (original)
            shape1.moveTo(-2, -0.5);
            shape1.lineTo(-1.5, -3.5);
            shape1.lineTo(1.5, -3.5);
            shape1.lineTo(2, -0.5);
            shape1.lineTo(2, 0.5);
            shape1.lineTo(-2, 0.5);
        }
        else {
            // FEMALE (narrow shoulders, wider hips)
            shape1.moveTo(-1.6, -0.5);
            shape1.lineTo(-2.0, -3.5);
            shape1.lineTo(2.0, -3.5);
            shape1.lineTo(1.6, -0.5);
            shape1.lineTo(1.4, 0.5);
            shape1.lineTo(-1.4, 0.5);
        }
        shape1.lineTo(shape1.getPoints()[0].x, shape1.getPoints()[0].y);
        // -----------------------------------
        // UPPER TORSO
        // -----------------------------------
        if (!female) {
            shape2.moveTo(-1.95, -0.5);
            shape2.lineTo(-1.5, -1.25);
            shape2.lineTo(1.5, -1.25);
            shape2.lineTo(1.9, -0.5);
            shape2.lineTo(1.95, 0.5);
            shape2.lineTo(-1.95, 0.5);
        }
        else {
            shape2.moveTo(-1.6, -0.5);
            shape2.lineTo(-1.8, -1.35);
            shape2.lineTo(1.8, -1.35);
            shape2.lineTo(1.6, -0.5);
            shape2.lineTo(1.4, 0.5);
            shape2.lineTo(-1.4, 0.5);
        }
        shape2.lineTo(shape2.getPoints()[0].x, shape2.getPoints()[0].y);
        const extrudeSettings = {
            steps: 2,
            depth: female ? 1.6 : 1.75,
            bevelEnabled: false
        };
        const bodyGeo = new THREE.ExtrudeBufferGeometry(shape1, extrudeSettings);
        const body = new THREE.Mesh(bodyGeo, shirt ? this.materialDark : this.skinMaterial);
        const upperBodyGeo = new THREE.ExtrudeBufferGeometry(shape2, extrudeSettings);
        const upperBody = new THREE.Mesh(upperBodyGeo, shirt ? this.materialDark : this.skinMaterial);
        const beltGeo = new THREE.BoxGeometry(female ? 3.8 : 3.5, 0.5, female ? 2.0 : 2.1);
        const belt = new THREE.Mesh(beltGeo, this.steelMaterial);
        this.base.add(body, upperBody, belt);
        body.castShadow = true;
        upperBody.castShadow = true;
        belt.castShadow = true;
        body.receiveShadow = true;
        upperBody.receiveShadow = true;
        belt.receiveShadow = true;
        body.position.set(0, 0.75, -1.25);
        upperBody.position.set(0, 0.55, -1.15);
        belt.position.set(0, -2.55, -0.4);
        upperBody.rotation.x = female ? -Math.PI / 20 : -Math.PI / 24;
        // Save reference for animations (bend, idle, etc.)
        this.torso = { body, upperBody };
        return { body, upperBody };
    }
    addLeftArm(fur = true) {
        const bicepGeo = new THREE.BoxGeometry(2.5, 1, 1);
        const bicep = new THREE.Mesh(bicepGeo, this.skinMaterial);
        const foreArmGeo = new THREE.BoxGeometry(2.5, 1.25, 1.25);
        const foreArm = new THREE.Mesh(foreArmGeo, fur ? bearFurMaterial : this.skinMaterial);
        // // ARM ROOT (shoulder joint)
        // const armPivot = new THREE.Group();
        // armPivot.position.set(2.5, 1, 1);
        // this.base.add(armPivot);
        // // FOREARM (elbow joint)
        // const forearmPivot = new THREE.Group();
        // forearmPivot.position.set(2.5, 1.25, 1.25);
        // bicep.add(forearmPivot);
        this.base.add(bicep);
        this.base.add(foreArm);
        // this.base.add(armPivot);
        // armPivot.add(bicep);
        // bicep.add(forearmPivot);
        bicep.castShadow = true;
        foreArm.castShadow = true;
        bicep.position.set(-2, 0, 0.2);
        bicep.rotation.z = Math.PI / 4;
        bicep.rotation.y = Math.PI / 4;
        foreArm.position.set(-2.4, 0, 1.2);
        foreArm.rotation.z = -Math.PI / 2 - 0.3;
        foreArm.rotation.x = Math.PI / 8;
        if (fur) {
            // 🐻 Bear claws
            const claws = bearClaws();
            claws.position.set(1.2, 0, 0);
            foreArm.add(claws);
        }
        // SAVE REFERENCES FOR ANIMATION
        this.leftArm = {
            // pivot: armPivot,
            // elbow: forearmPivot,
            forearm: foreArm,
            bicep
        };
    }
    addRightArm(fur = true) {
        const bicepGeo = new THREE.BoxGeometry(2.5, 1, 1);
        const bicep = new THREE.Mesh(bicepGeo, this.skinMaterial);
        // const bicep = new THREE.Mesh(bicepGeo, this.bearFurMaterial);
        const foreArmGeo = new THREE.BoxGeometry(2.5, 1.25, 1.25);
        const foreArm = new THREE.Mesh(foreArmGeo, fur ? bearFurMaterial : this.skinMaterial);
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
        if (fur) {
            // 🐻 Bear claws
            const claws = bearClaws();
            claws.position.set(1.2, 0, 0);
            foreArm.add(claws);
        }
        this.rightArm = {
            forearm: foreArm,
            bicep
        };
    }
    startMiningAnimation() {
        if (!this.leftArm)
            return;
        this.isMining = true;
        this.miningTime = 0;
    }
    stopMiningAnimation() {
        this.isMining = false;
    }
    animateMining(delta = 1) {
        let animation = setInterval(() => {
            if (this.isMining) {
                this.miningTime += delta * 6; // speed
                const swing = Math.sin(this.miningTime);
                this.miningTime += 0.15; // speed (smaller = slower)
                // SHOULDER swing
                this.leftArm.bicep.rotation.x = -0.6 + swing * 0.4;
                // ELBOW bend
                this.leftArm.forearm.rotation.x = -0.8 + swing * 0.6;
            }
            else {
                this.leftArm.bicep.rotation.x = 0;
                this.leftArm.forearm.rotation.x = Math.PI / 8;
                clearInterval(animation);
                return;
            }
            ;
        }, 16); // ~60fps
    }
    startAnimation(leftArm = true) {
        if (leftArm) {
            if (!this.leftArm)
                return;
            this.isAnimating = true;
            this.animationTime = 0;
        }
        else {
            if (!this.rightArm)
                return;
            this.isAnimating = true;
            this.animationTime = 0;
        }
    }
    stopAnimation() {
        this.isAnimating = false;
    }
    animate_character(delta = 1, leftArm = true, bicepRotation, forearmRotation) {
        if (leftArm) {
            let animation = setInterval(() => {
                if (this.isAnimating) {
                    this.animationTime += delta * 6; // speed
                    const swing = Math.sin(this.animationTime);
                    this.animationTime += 0.15; // speed (smaller = slower)
                    // SHOULDER swing
                    this.leftArm.bicep.rotation.x = bicepRotation ? bicepRotation : -0.6 + swing * 0.4;
                    // ELBOW bend
                    this.leftArm.forearm.rotation.x = forearmRotation ? forearmRotation : -0.8 + swing * 0.6;
                }
                else {
                    this.leftArm.bicep.rotation.x = 0;
                    this.leftArm.forearm.rotation.x = Math.PI / 8;
                    clearInterval(animation);
                    return;
                }
                ;
            }, 16); // ~60fps
        }
        else {
            let animation = setInterval(() => {
                if (this.isAnimating) {
                    this.animationTime += delta * 6; // speed
                    const swing = Math.sin(this.animationTime);
                    this.animationTime += 0.15; // speed (smaller = slower)
                    // SHOULDER swing
                    this.rightArm.bicep.rotation.x = bicepRotation ? bicepRotation : -0.6 + swing * 0.4;
                    // ELBOW bend
                    this.rightArm.forearm.rotation.x = forearmRotation ? forearmRotation : -0.8 + swing * 0.6;
                }
                else {
                    this.rightArm.bicep.rotation.x = 0;
                    this.rightArm.forearm.rotation.x = -Math.PI / 8;
                    clearInterval(animation);
                    return;
                }
                ;
            }, 16); // ~60fps
        }
    }
    crafting_animation() {
        const animation = setInterval(() => {
            if (!this.isAnimating)
                return;
            // Animate both arms
            this.animate_character();
            this.animate_character(1, false);
        }, 16); // ~60fps
        // Stop after duration
        setTimeout(() => {
            this.isAnimating = false;
            clearInterval(animation);
            this.stopAnimation();
        }, 600);
    }
    magic_animation() {
        const animation = setInterval(() => {
            if (!this.isAnimating)
                return;
            // Animate both arms
            this.animate_character(1, true, -0.6 + 20 * 0.4, -0.6 + 20 * 0.4);
        }, 16); // ~60fps
        // Stop after duration
        setTimeout(() => {
            this.isAnimating = false;
            clearInterval(animation);
            this.stopAnimation();
        }, 600);
    }
    attack_animation() {
        const animation = setInterval(() => {
            if (!this.isAnimating)
                return;
            // Animate both arms
            this.animate_character(1, true, 20, 40);
        }, 16); // ~60fps
        // Stop after duration
        setTimeout(() => {
            this.isAnimating = false;
            clearInterval(animation);
            this.stopAnimation();
        }, 600);
    }
    defend_animation() {
        const animation = setInterval(() => {
            if (!this.isAnimating)
                return;
            // Animate both arms
            this.animate_character(1, false, -40, -40);
        }, 16); // ~60fps
        // Stop after duration
        setTimeout(() => {
            this.isAnimating = false;
            clearInterval(animation);
            this.stopAnimation();
        }, 600);
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
        const bootGeo2 = new THREE.BoxGeometry(1, 0.45, 1);
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
    walk(positionData = null) {
        console.log('walking...');
        if (this.isFollowing) {
            this.stopFollowing();
        }
        const dx = this.targetPosition.x - this.positionX;
        const dz = this.targetPosition.z - this.positionZ;
        this.targetRotation = Math.atan2(dx, dz);
        if (positionData) {
            this.currentRotation = positionData.rotation;
        }
        else
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.5;
        this.walkCycle += 2; // ⬅️ increased from 0.1 to 0.25
        // Legs
        this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.1;
        this.rightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.1;
        // Forward movement
        this.base.position.z -= 0.10;
        if (this.isThisPlayer) {
            const msg = socket.sendMessage("player_update", {
                id: this.playerId || socket.socket.id,
                username: this.name,
                position: this.targetPosition,
                rotation: this.currentRotation,
                isMoving: this.isWalking
            });
        }
        // socket.sendMessage('message', this.name);
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
        this.weaponGroup = new THREE.Group(); // ← store reference
        this.weaponGroup.add(this.applyedWeapon);
        this.leftArm.forearm.add(this.weaponGroup);
        this.weaponGroup.position.set(-1.8, 1.5, 0);
        this.weaponGroup.rotation.y = Math.PI / 2;
        this.weaponGroup.rotation.x = Math.PI / 12;
    }
    removeWeapon() {
        if (this.weaponGroup) {
            this.base.remove(this.weaponGroup);
            this.weaponGroup = undefined;
        }
    }
    animate() {
        // this.requestAnimationFrame(this.animate);
        if (this.isWalking)
            this.walk();
        if (this.isRunning)
            this.run();
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
        };
        this.applyedLeg = legs[value];
        this.draw_character();
    }
    applyWeapon(value) {
        const weapons = {
            0: axe(),
            1: sword()
        };
        this.applyedWeapon = weapons[value];
        this.draw_character();
    }
    draw_character() {
        this.addHead();
        // this.addBeard();
        // this.addMustache();
        this.addBody(this.characterConfig.gender !== "male", this.characterConfig.gender !== "male");
        this.addLegs();
        this.addArms();
        this.addWeapon();
        this.animate();
        // this.addWizardHat();
        // this.addEarMuffs();
        goldNecklace(this.base);
        // this.addMask();
        // this.shieldRightHand();
        // this.addWingCape();
        // this.addHoodedCloak();
        // this.addParka();
        // this.addBag();
        // this.addHandBag();
        // this.addLeggings();
        // this.addHoodedCloak();
        // this.addCape();
        // this.addPlatebody();
        // this.addIronHelmet();
        // this.addIronBoots();
        // this.addPlatelegs();
        // this.addIronGloves();
        // this.base.scale.set(0.65, 0.85, 0.65);
        // this.base.position.y = 5;
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
        if (!skill)
            return;
        const currentLevel = this.getLevelFromXP(skill.experience_points);
        skill.experience_points += amount;
        skill.total_points_available += amount;
        const newLevel = this.getLevelFromXP(skill.experience_points);
        if (newLevel > currentLevel) {
            console.log(`🎉 ${skillName.toUpperCase()} leveled up! ${skillName} → ${newLevel}`);
        }
        this.displayStats();
    }
    // Generic function to drain any stat
    drainStat(skill, amount) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            skillData.total_points_available = Math.max(skillData.total_points_available - amount, 0); // Ensure the stat doesn't drop below 0
            console.log(`${skill} drained by ${amount}. New ${skill} level: ${skillData.total_points_available}`);
        }
        else {
            console.error("Skill not found!");
        }
        this.displayStats();
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
            if (skillData.total_points_available == skillData.experience_points) {
                skillData.total_points_available = skillData.experience_points;
            }
            // Only regenerate if the current level is less than the max level
            if (skillData.total_points_available < skillData.experience_points) {
                // Calculate the regeneration amount based on the max level
                let regenerationAmount = (skillData.total_points_available) * regenerationRate;
                // Apply the regeneration
                skillData.total_points_available += regenerationAmount;
                // Ensure the stat doesn't exceed the max level or level
                if (skillData.total_points_available >= skillData.experience_points) {
                    skillData.total_points_available = skillData.experience_points; // Clamp to max level if it reaches or exceeds max
                    console.log(`${skill} reached max level. Regeneration stopped.`);
                    this.stopRegeneration(skill);
                }
                else if (skillData.total_points_available >= skillData.experience_points) {
                    skillData.total_points_available = skillData.experience_points; // Clamp to level if it exceeds level
                    console.log(`${skill} reached level limit. Regeneration stopped.`);
                    this.stopRegeneration(skill); // Stop the interval when total_points_available equals level
                }
                else {
                    console.log(`${skill} regenerated.`);
                }
            }
            else {
                console.log(`${skill} is already at max level or at its level limit. No regeneration needed.`);
            }
        }
        else {
            console.error("Skill not found or player is mining!");
        }
        this.displayStats();
        this.stopRegeneration(skill);
    }
    // Function to start regeneration interval for a skill
    startRegeneration(skill) {
        console.log(skill);
        // Ensure we are not already regenerating the skill
        if (!this.skills[skill].regenerationIntervals) {
            this.skills[skill].regenerationIntervals = setInterval(() => this.regenerateStat(skill), 1000); // Regenerate every second
            console.log(`Started regeneration for ${skill}`);
        }
    }
    // Function to stop regeneration interval for a skill
    stopRegeneration(skill) {
        if (this.skills[skill].regenerationIntervals) {
            clearInterval(this.skills[skill].regenerationIntervals);
            delete this.skills[skill].regenerationIntervals[skill]; // Clean up the interval reference
            console.log(`Stopped regeneration for ${skill}`);
        }
    }
    takeDamage(damage, attacker) {
        if (!this.alive)
            return;
        this.skills.hp.total_points_available = this.skills.hp.total_points_available - damage;
        this.stats.hp = this.getLevelFromXP(this.skills.hp.total_points_available);
        // addMessage('Game', `${this.name} takes ${damage} damage!`);
        this.startAnimation();
        this.defend_animation();
        if (this.autoAttack) {
            this.attack(attacker);
        }
        if (this.stats.hp <= 0) {
            this.die();
        }
        if (!this.healthBar) {
            this.addHealthBar();
        }
        // Show splash
        createDamageSplash(Math.floor(damage), this.base, 4);
        const percent = this.skills.hp.total_points_available / this.skills.hp.experience_points;
        this.healthBar.targetPercent = Math.max(0, percent);
        this.healthBar.update();
    }
    attack(target) {
        var _a, _b, _c, _d;
        if (!this.alive)
            return;
        if (this.activeSpell)
            return this.attackWithMagic(target, this.activeSpell);
        const leftHandItem = this.equippedItems[EquipType.left_hand];
        const rightHandItem = this.equippedItems[EquipType.right_hand];
        if (leftHandItem && leftHandItem.name.includes("bow")
            ||
                rightHandItem && rightHandItem.name.includes("bow")) {
            return this.attackWithArcher(target, this.inventory.findItemByName("arrows"));
        }
        if (leftHandItem && leftHandItem.name.includes("rifle") || leftHandItem.name.includes("gun") || leftHandItem.name.includes("pistol")
            ||
                rightHandItem && rightHandItem.name && rightHandItem.name.includes("rifle") || ((_a = rightHandItem === null || rightHandItem === void 0 ? void 0 : rightHandItem.name) === null || _a === void 0 ? void 0 : _a.includes("gun")) || ((_b = rightHandItem === null || rightHandItem === void 0 ? void 0 : rightHandItem.name) === null || _b === void 0 ? void 0 : _b.includes("pistol"))) {
            return this.attackWithArcher(target, this.inventory.findItemByName("bullet"));
        }
        let damage = 0;
        // this.startAnimation();
        // this.attack_animation();
        if (this.combatMode === 'defend') {
            console.log('attacking in defense mode');
            damage = Math.max(0.5, this.getLevelFromXP(this.skills.strength.experience_points) - target.stats.defense); // Basic attack formula
            // experience gains
            this.addExperience('defense', damage * 50);
        }
        else {
            console.log('attacking in attack mode');
            damage = Math.max(1, this.getLevelFromXP(this.skills.strength.experience_points) - target.stats.defense); // Basic attack formula
            // experience gains
            this.addExperience('strength', damage * 50);
        }
        console.log(`${this.name} attacks ${target.monster || target.name} for ${damage} damage!`);
        // addMessage('Game', `${this.name} attacks player for ${damage} damage!`);
        // target.takeDamage(damage, this);
        if (this.isThisPlayer) {
            if (target.monster) {
                return socket.sendMessage("combat_event", {
                    type: "combat_event",
                    attackerType: "player",
                    attackerId: this.playerId || socket.socket.id,
                    attackerUsername: this.name,
                    targetType: "monster",
                    targetId: target.monsterId,
                    targetName: target.name,
                    attackType: "melee",
                    weapon: ((_c = this.equippedItems.left_hand) === null || _c === void 0 ? void 0 : _c.name) || null,
                    damage,
                    targetHpAfter: target.stats.hp.current,
                    killed: target.stats.hp.current <= 0,
                    timestamp: Date.now()
                });
            }
            socket.sendMessage("combat_event", {
                type: "combat_event",
                attackerId: this.playerId || socket.socket.id,
                targetId: target.playerId,
                targetUsername: target.name,
                attackType: "melee",
                weapon: ((_d = this.equippedItems.left_hand) === null || _d === void 0 ? void 0 : _d.name) || null,
                damage,
                targetHpAfter: target.skills.hp.total_points_available,
                killed: target.skills.hp.total_points_available <= 0,
                timestamp: Date.now()
            });
        }
    }
    attackWithMagic(target, spell) {
        var _a;
        if (!this.alive)
            return;
        console.log(target);
        console.log(`attacking ${target.monster} with ${spell.name}`);
        spell.cast(this, target);
        const damage = Math.max(spell.damage, this.getLevelFromXP(this.skills.mage.experience_points) - target.stats.defense);
        spell.impact(target);
        target.takeDamage(damage, this);
        this.addExperience('mage', spell.experience);
        if (this.isThisPlayer) {
            socket.sendMessage("combat_event", {
                type: "combat_event",
                attackerId: this.playerId || socket.socket.id,
                targetId: target.playerId,
                targetUsername: target.name,
                attackType: "magic",
                spell,
                weapon: ((_a = this.equippedItems.left_hand) === null || _a === void 0 ? void 0 : _a.name) || null,
                damage,
                targetHpAfter: target.skills.hp.total_points_available,
                killed: target.skills.hp.total_points_available <= 0,
                timestamp: Date.now()
            });
        }
    }
    fireArrow({ scene, start, target, onHit }) {
        function createArrowMesh() {
            const group = new THREE.Group();
            // Shaft
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
            shaft.rotation.z = Math.PI / 2;
            group.add(shaft);
            // Tip
            const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), new THREE.MeshStandardMaterial({ color: 0x888888 }));
            tip.position.x = 1.15;
            tip.rotation.z = Math.PI / 2;
            group.add(tip);
            // Fletching
            const featherMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            for (let i = 0; i < 3; i++) {
                const feather = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.35), featherMat);
                feather.position.x = -1.0;
                feather.rotation.x = (Math.PI * 2 / 3) * i;
                group.add(feather);
            }
            return group;
        }
        const arrow = createArrowMesh();
        arrow.position.copy(start);
        scene.add(arrow);
        const velocity = new THREE.Vector3()
            .subVectors(target, start)
            .normalize()
            .multiplyScalar(0.6);
        const direction = velocity.clone().normalize();
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
        const interval = setInterval(() => {
            arrow.position.add(velocity);
            // Face direction of travel
            arrow.lookAt(arrow.position.clone().add(velocity));
            if (arrow.position.distanceTo(target) < 0.8) {
                clearInterval(interval);
                scene.remove(arrow);
                onHit === null || onHit === void 0 ? void 0 : onHit();
            }
        }, 16);
    }
    attackWithArcher(target, arrow) {
        var _a, _b, _c, _d;
        if (!this.alive)
            return;
        // arrow type damage function
        if (!arrow) {
            console.log('no arrows found in inventory');
            return;
        }
        this.startAnimation();
        this.magic_animation();
        const damage = Math.max(1, this.getLevelFromXP(this.skills.archer.experience_points) - target.stats.defense);
        this.inventory.removeFromInventory(arrow);
        const start = this.weaponGroup
            ? this.weaponGroup.getWorldPosition(new THREE.Vector3())
            : this.rightArm.position.clone().add(new THREE.Vector3(0, 2, 1));
        const projectileTarget = target.model ?
            (_b = (_a = target.model.position) === null || _a === void 0 ? void 0 : _a.clone()) === null || _b === void 0 ? void 0 : _b.add(new THREE.Vector3(0, 2, 0))
            : (_d = (_c = target.base.position) === null || _c === void 0 ? void 0 : _c.clone()) === null || _d === void 0 ? void 0 : _d.add(new THREE.Vector3(0, 2, 0));
        const isBullet = arrow.name.includes('bullet');
        if (!isBullet) {
            this.fireArrow({
                scene: this.scene,
                start,
                target: projectileTarget,
                onHit: () => target.takeDamage(damage, this)
            });
        }
        else {
            // 🔫 BULLET (hitscan)
            this.fireBullet({
                scene: this.scene,
                start,
                target: projectileTarget,
                onHit: () => target.takeDamage(damage, this)
            });
        }
        this.addExperience('archer', damage * 50);
        // 📡 BROADCAST intent
        if (this.isThisPlayer) {
            socket.sendMessage("combat_event", {
                type: "combat_event",
                attackType: "archer",
                projectileType: isBullet ? "bullet" : "arrow",
                attackerId: this.playerId || socket.socket.id,
                targetId: target.playerId,
                damage,
                start: { x: start.x, y: start.y, z: start.z },
                target: { x: projectileTarget.x, y: projectileTarget.y, z: projectileTarget.z },
                timestamp: Date.now(),
                targetHpAfter: target.skills.hp.total_points_available,
            });
        }
    }
    fireBullet({ scene, start, target, onHit }) {
        // 1. HITSCAN (instant hit)
        onHit === null || onHit === void 0 ? void 0 : onHit();
        // 2. TRACER (visual only)
        const tracerGeo = new THREE.BufferGeometry().setFromPoints([
            start,
            target
        ]);
        const tracerMat = new THREE.LineBasicMaterial({
            color: 0xffdd88,
            transparent: true,
            opacity: 0.9
        });
        const tracer = new THREE.Line(tracerGeo, tracerMat);
        scene.add(tracer);
        // Fade tracer quickly
        setTimeout(() => scene.remove(tracer), 80);
        // 3. MUZZLE FLASH
        this.spawnMuzzleFlash(start);
        // 4. IMPACT SPARK
        this.spawnBulletImpact(target);
    }
    spawnMuzzleFlash(position) {
        const flash = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), new THREE.MeshStandardMaterial({
            emissive: 0xffaa33,
            emissiveIntensity: 2
        }));
        flash.position.copy(position);
        this.scene.add(flash);
        setTimeout(() => this.scene.remove(flash), 40);
    }
    spawnBulletImpact(position) {
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), new THREE.MeshStandardMaterial({
            emissive: 0xffffff,
            emissiveIntensity: 1.5
        }));
        spark.position.copy(position);
        this.scene.add(spark);
        setTimeout(() => this.scene.remove(spark), 60);
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
    createModel() {
        throw new Error('Method not implemented.');
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
    spawnLoot(itemName, quantity) {
        const loot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), // Small box to represent loot
        new THREE.MeshStandardMaterial({ color: "gold" }) // Default gold color
        );
        loot.position.set(this.base.position.x, 0.5, this.base.position.z); // Drops at the deer's location
        loot.userData = { name: itemName, quantity: quantity, pickupable: true };
        this.scene.add(loot);
        this.scene.remove(this.base);
        // Allow player to collect loot on interaction
        setTimeout(() => {
            loot.userData.pickupable = true;
        }, 1000); // Loot becomes collectible after 1 second
    }
    fish(source) {
        if (this.inventory.inventory.length < 28) {
            console.log(source);
            const virginiaFish = ["Largemouth Bass", "Bluegill", "Brook Trout", "Channel Catfish", "Smallmouth Bass", "American Shad", "Longnose Gar"];
            const baseRate = 5; // Base seconds per catch
            const agilityFactor = Math.max(1, 10 - Math.floor(this.getLevelFromXP(this.skills.agility.experience_points) / 20)); // Faster with higher agility
            const strengthFactor = Math.max(1, 10 - Math.floor(this.getLevelFromXP(this.skills.strength.experience_points) / 20)); // Faster with higher strength
            const fishingSpeed = Math.max(1, baseRate - Math.floor((agilityFactor + strengthFactor) / 2)); // Balanced rate
            // addMessage('Game', `Casting line...`);
            let fishingInterval = setInterval(() => {
                this.startAnimation();
                let caughtFish = virginiaFish[Math.floor(Math.random() * virginiaFish.length)];
                this.inventory.add_to_inventory({ name: caughtFish, quantity: 1, pickupable: true, cookable: true, raw: true });
                // addMessage('Game', `You caught a ${caughtFish}!`);
                this.drainStat("agility", 3);
                this.drainStat("strength", 3);
                this.addExperience("agility", 75);
                this.addExperience("strength", 75);
                this.crafting_animation();
                console.log(this.inventory.inventory);
                // drainAgility();
                // drain strength
                // playerStats.strength = Math.max(0, playerStats.strength - 2);
                if (this.inventory.inventory.length === 28) {
                    clearInterval(fishingInterval); // Terminate the interval
                    // Optional: Perform any cleanup or final actions here
                    this.startRegeneration("agility");
                    this.startRegeneration("strength");
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
            // if (this.skills.agility.total_points_available === 0) {
            //     // addMessage("Game", "You have run out of agility and can no longer mine.");
            //     clearInterval(miningInterval);
            //     this.startRegeneration('agility');
            //     if (this.skills.strength.total_points_available === 0) {
            //         // addMessage("Game", "You have run out of strength and can no longer mine.");
            //         this.startRegeneration('strength');
            //     }
            //     // if (hasMaxExperience()) {
            //     //     addMessage("Game", "You have reached max experience!");
            //     // }
            //     this.stopMiningAnimation();
            //     return;
            // }
            if (this.inventory.inventory.length < this.inventory.inventoryLimit) {
                this.startMiningAnimation();
                this.animateMining();
                // Simulate mining
                this.inventory.add_to_inventory({ name: mine.type });
                // addMessage("Game", `Mined a ${mine.type}!`);
                // Drain agility after each mining action
                this.drainStat("agility", 7);
                this.drainStat("strength", 4);
                // Increment experience after each ore mined (you can customize how much experience is gained)
                this.addExperience("strength", 75);
                this.addExperience("agility", 75);
            }
            else {
                this.stopMiningAnimation();
                clearInterval(miningInterval);
                this.startRegeneration('agility');
                this.startRegeneration('strength');
                return;
            }
        }, this.calculateActivitySpeed()); // Uses calculated mining speed based on player stats
    }
    // Helper function to calculate activity speed
    calculateActivitySpeed() {
        const baseSpeed = 1000; // Base speed of 1 second per activity action
        const agilityFactor = 0.05; // Agility impact on speed
        const strengthFactor = 0.03; // Strength impact on speed
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
                    this.startAnimation();
                    if (!this.inventory[index]) {
                        this.crafting_animation();
                        this.inventory.removeFromInventory(item, 1);
                        this.inventory.add_to_inventory(Object.assign(Object.assign({}, item), { name: barType, quantity: 1, type: barType }));
                        smeltedItems.push(Object.assign(Object.assign({}, item), { name: barType }));
                        console.log(`Smelted 1 ${item.name} → ${barType}`);
                        this.addExperience("craft", 10);
                        this.drainStat("craft", 5);
                        this.startRegeneration("craft");
                    }
                }, this.calculateActivitySpeed() * index); // Delay increases per item
            }
        });
        return smeltedItems;
    }
    createOpenLogFire(position) {
        this.startAnimation();
        this.crafting_animation();
        const fireGroup = new THREE.Mesh();
        const data = { isFire: true, name: "Log Fire" };
        fireGroup.userData = data;
        // Create logs
        const logMaterial = new THREE.MeshStandardMaterial({ color: "#8B4513" });
        logMaterial.userData = data;
        for (let i = 0; i < 5; i++) {
            const logGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 12);
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.userData = data;
            log.rotation.z = Math.random() * Math.PI / 2;
            log.rotation.y = Math.random() * Math.PI;
            log.position.set(position.x + Math.random() * 1 - 0.5, position.y + 0.2, position.z + Math.random() * 1 - 0.5);
            fireGroup.add(log);
        }
        // Create embers
        const emberMaterial = new THREE.MeshStandardMaterial({ emissive: "#FF4500" });
        emberMaterial.userData = { isFire: true };
        const emberGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const embers = new THREE.Mesh(emberGeometry, emberMaterial);
        embers.userData = { isFire: true };
        embers.position.set(position.x, position.y + 0.1, position.z);
        fireGroup.add(embers);
        // Fire particles
        const fireParticles = new THREE.Mesh();
        fireParticles.userData = { isFire: true };
        const fireMaterial = new THREE.MeshStandardMaterial({ emissive: "#FF6347", transparent: true, opacity: 0.8 });
        fireMaterial.userData = { isFire: true };
        for (let i = 0; i < 10; i++) {
            const flame = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), fireMaterial);
            flame.position.set(position.x, position.y + 0.5 + Math.random() * 0.5, position.z);
            fireParticles.add(flame);
        }
        fireGroup.add(fireParticles);
        // Fire light
        const fireLight = new THREE.PointLight("#FFA500", 1.5, 5);
        fireLight.userData = { isFire: true };
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
        this.addExperience("craft", 75);
        this.drainStat("craft", 20);
        this.startRegeneration("craft");
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
                this.startAnimation();
                this.crafting_animation();
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
                }
                else {
                    burntItems.push(cookedItem.name);
                    this.addExperience("craft", 1);
                }
            }
        });
        if (cookedItems.length > 0 || burntItems.length > 0) {
            // addMessage('Game', `Using ${cookingMethod.name}, you cooked: ${cookedItems.join(", ")}`);
            // addMessage('Game', `Burnt items: ${burntItems.join(", ")}`);
            // console.log
        }
        else {
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
                this.startAnimation();
                this.crafting_animation();
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
            this.inventory.removeFromInventory(inventoryItem, cost);
            if (secondary) {
                this.inventory.removeFromInventory(secondaryItem, cost);
            }
            // Add the fletched item
            const line = `${inventoryItem.type}`;
            const cleaned = line
                .replace(/\bbar\b/gi, "")
                .replace(/\s+/g, " ")
                .trim();
            this.inventory.add_to_inventory(inventoryItem.type ? { name: `${cleaned} ${itemName}`, type: inventoryItem.type, equipable: true, equipType: type, pickupable: true }
                : { name: `${itemName}`, type: inventoryItem.type, equipable: true, equipType: type, pickupable: true });
            this.inventory.update_inventory_UI();
        }
        if (inventoryItem && inventoryItem.type && inventoryItem.type.includes("iron")) {
            this.toggleSmithUI();
        }
        else if (inventoryItem && !inventoryItem.type) {
            this.toggleCraftUI();
        }
        else
            this.toggleFletchUI();
        this.startRegeneration('craft');
    }
    // Opens the Smithing UI
    smith() {
        const smithUI = document.getElementById("smithUI");
        const smithItemsContainer = document.getElementById("smithItems");
        smithItemsContainer.innerHTML = ""; // Clear previous items
        // List of smithable items
        const smithableItems = [
            { name: "Arrow Heads", material: "bar", cost: 1, equipType: EquipType.arrows },
            { name: "Platelegs", material: "bar", cost: 3, equipType: EquipType.legs },
            { name: "Platebody", material: "bar", cost: 5, equipType: EquipType.torso },
            { name: "Boots", material: "bar", cost: 2, equipType: EquipType.both_shoes },
            { name: "Gloves", material: "bar", cost: 1, equipType: EquipType.gloves },
            { name: "Sword", material: "bar", cost: 3, equipType: EquipType.right_hand },
            { name: "Shield", material: "bar", cost: 4, equipType: EquipType.left_hand },
            { name: "Helmet", material: "bar", cost: 3, equipType: EquipType.helmet },
            { name: "bullets", material: "bar", cost: 1, equipType: EquipType.arrows },
            { name: "pistol", material: "bar", cost: 3, equipType: EquipType.right_hand, imageName: "pistol", },
            { name: "shotgun", material: "bar", cost: 3, equipType: EquipType.right_hand, imageName: "shotgun", },
            { name: "rifle", material: "bar", cost: 3, equipType: EquipType.right_hand, imageName: "rifle", }
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
                this.startAnimation();
                this.crafting_animation();
                this.fletchItem(item.name, item.material, item.secondary || "", item.cost, item.equipType);
                this.addExperience("craft", 70);
                this.addExperience("strength", 70);
                this.addExperience("agility", 70);
                this.drainStat("craft", 20);
                this.drainStat("strength", 20);
                this.drainStat("agility", 20);
                this.startRegeneration("craft");
                this.startRegeneration("strength");
                this.startRegeneration("agility");
            });
            // Assemble UI
            itemElement.appendChild(nameDiv);
            itemElement.appendChild(button);
            smithItemsContainer.appendChild(itemElement);
        });
        // Show the smithing UI
        this.toggleSmithUI();
    }
    // Toggles the smith UI
    toggleSmithUI() {
        const smithUI = document.getElementById("smithUI");
        smithUI.style.display = (smithUI.style.display === "block") ? "none" : "block";
    }
    // Opens the Smithing UI
    craft() {
        const craftUI = document.getElementById("craftUI");
        const craftItemsContainer = document.getElementById("craftItems");
        craftItemsContainer.innerHTML = ""; // Clear previous items
        // List of smithable items
        const craftableItems = [
            { name: "deer torso", label: "Deer Fur Shirt", material: "deer fur", cost: 3, equipType: EquipType.torso },
            { name: "deer pants", label: "Deer Fur Pants", material: "deer fur", cost: 3, equipType: EquipType.legs },
            { name: "deer mocassins", label: "Deer Mocassins", material: "deer fur", cost: 2, equipType: EquipType.both_shoes },
            { name: "leather shirt", label: "Leather Torso", material: "leather", cost: 2, equipType: EquipType.torso },
            { name: "leather pants", label: "Leather Pants", material: "leather", cost: 2, equipType: EquipType.legs },
            { name: "leather boots", label: "Leather Boots", material: "leather", cost: 2, equipType: EquipType.both_shoes },
            { name: "deer fur", label: "Leather", material: "cow hide", cost: 1 },
        ];
        // Generate item grid
        craftableItems.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("craft-item");
            // Add item name
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("craft-item-name");
            nameDiv.textContent = item.name;
            // Create the button
            const button = document.createElement("button");
            button.textContent = "Craft";
            // Properly bind class methods
            button.addEventListener("click", () => {
                this.startAnimation();
                this.fletchItem(item.name, item.material, item.secondary || "", item.cost, item.equipType);
                this.addExperience("craft", 10);
                this.crafting_animation();
            });
            // Assemble UI
            itemElement.appendChild(nameDiv);
            itemElement.appendChild(button);
            craftItemsContainer.appendChild(itemElement);
        });
        // Show the smithing UI
        this.toggleCraftUI();
    }
    // Toggles the smith UI
    toggleCraftUI() {
        const craftUI = document.getElementById("craftUI");
        craftUI.style.display = (craftUI.style.display === "block") ? "none" : "block";
    }
    // Opens Bank UI
    openBank() {
        document.getElementById("bankUI").style.display = "block";
        document.getElementById("bank-close-button").addEventListener("click", () => this.closeBank());
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
        return this.bankStorage[itemName] || null;
    }
    // Setter for bank storage (handles stacking properly)
    setBankStorage(itemName, quantity, withdraw = false) {
        if (this.bankStorage[itemName]) {
            if (withdraw) {
                this.bankStorage[itemName].quantity -= quantity;
            }
            else {
                this.bankStorage[itemName].quantity += quantity;
            }
        }
        else {
            this.bankStorage[itemName] = { name: itemName, quantity: quantity };
        }
    }
    // Deposits an item into the bank
    depositItem(quantity) {
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
        this.inventory.add_to_inventory(Object.assign(Object.assign({}, bankedItem), { quantity }));
        this.updateBankDisplay();
    }
    // Updates the bank UI
    updateBankDisplay() {
        let bankUI = document.getElementById("bankItems");
        bankUI.innerHTML = "";
        for (let item in this.bankStorage) {
            let itemElement = document.createElement("div");
            itemElement.className = "bank-item";
            itemElement.innerHTML = `<img src="./assets/items/${this.inventory.grab_item_image(this.bankStorage[item].name)}.png"> ${this.bankStorage[item].name} x${this.bankStorage[item].quantity}`;
            itemElement.addEventListener("click", () => this.withdrawItem(item, this.bankStorage[item].quantity)); // Left-click withdraw all
            itemElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.withdrawing = true;
                this.inventory.showInventoryContextMenu(e, item, "withdraw");
            });
            bankUI.appendChild(itemElement);
        }
    }
    equipItem(item) {
        console.log(`Equipping ${item.name} in slot: ${item.equipType}`);
        // update character model
        if (item.name.includes("sword")) {
            this.removeWeapon();
            this.applyedWeapon = sword();
            this.addWeapon();
        }
        if (item.name.includes("bow")) {
            this.removeWeapon();
            this.applyedWeapon = bow();
            this.addWeapon();
        }
        if (item.name.includes("axe")) {
            this.removeWeapon();
            this.applyedWeapon = axe();
            this.addWeapon();
        }
        console.log(item);
        if (item.name.toLowerCase().includes('platebody')) {
            this.addPlatebody();
        }
        if (item.name.toLocaleLowerCase().includes('helm')) {
            this.addIronHelmet();
        }
        // update equipped items slot
        const slot = this.getEquipmentSlot(item.equipType);
        // if slot is an array
        if (slot && Array.isArray(slot)) {
            const wornSlot1 = document.getElementById(slot[0]);
            const wornSlot2 = document.getElementById(slot[1]);
            if (!wornSlot1 || !wornSlot2)
                return console.warn(`EquipType is ${item.equipType}, but slot 1 is: ${wornSlot1} and slot 2 is: ${wornSlot2}`);
        }
        else if (slot && slot.equipType === EquipType.both_hands) {
            const wornSlot1 = document.getElementById(EquipType.left_hand);
            const wornSlot2 = document.getElementById(EquipType.right_hand);
            if (!wornSlot1 || !wornSlot2)
                return console.warn(`EquipType is ${item.equipType}, but slot 1 is: ${wornSlot1} and slot 2 is: ${wornSlot2}`);
        }
        else if (slot) {
            const wornSlot = document.getElementById(slot.equipType);
            if (!wornSlot)
                return console.warn(`Worn slot element not found: ${slot}`);
        }
        // Unequip existing item(s) first
        if (item.equipType === EquipType.both_hands) {
            if (this.equippedItems[EquipType.left_hand]) {
                this.inventory.add_to_inventory(this.equippedItems[EquipType.left_hand]);
                delete this.equippedItems[EquipType.left_hand];
            }
            if (this.equippedItems[EquipType.right_hand]) {
                this.inventory.add_to_inventory(this.equippedItems[EquipType.right_hand]);
                delete this.equippedItems[EquipType.right_hand];
            }
            this.equippedItems[EquipType.left_hand] = item;
            this.equippedItems[EquipType.right_hand] = item;
            this.inventory.removeFromInventory(item);
            console.log(this.equippedItems);
        }
        else if (slot && slot.equipType === EquipType.both_hands) {
            // Unequip existing item first
            this.inventory.add_to_inventory(this.equippedItems[EquipType.left_hand]);
            delete this.equippedItems[EquipType.left_hand];
            delete this.equippedItems[EquipType.right_hand];
            // equip item
            this.equippedItems[item.equipType] = item;
            this.inventory.removeFromInventory(item);
        }
        else {
            // Unequip existing item first
            if (this.equippedItems[item.equipType]) {
                console.log(slot);
                console.log(`Unequipping ${this.equippedItems[slot].name} from ${slot}`);
                this.inventory.add_to_inventory(this.equippedItems[slot]);
                delete this.equippedItems[slot];
            }
            // equip item
            this.equippedItems[item.equipType] = item;
            this.inventory.removeFromInventory(item);
        }
        this.updateWornPopup();
    }
    unequipItem(item) {
        const slot = this.getEquipmentSlot(item.equipType);
        const slotName = slot.dataset.slot;
        if (this.equippedItems[slotName]) {
            if (this.equippedItems[slotName].equipType === EquipType.both_hands) {
                console.log('dupe bug');
            }
            // Move to Inventory (Placeholder)
            console.log(`Unequipped ${this.equippedItems[slotName]}`);
            this.inventory.addToInventory(this.equippedItems[slotName].name
                ? this.equippedItems[slotName]
                : {
                    name: this.equippedItems[slotName]
                });
            this.equippedItems[slotName] = null;
            slot.textContent = "Empty";
        }
    }
    getEquipmentSlot(equipType) {
        console.log(equipType);
        if (equipType === EquipType.both_hands) {
            return [EquipType.right_hand,
                EquipType.left_hand];
        }
        else
            return this.equippedItems[equipType] || null;
    }
    updateWornPopup() {
        console.log("Updating worn popup UI...");
        const wornSlots = [
            EquipType.helmet,
            EquipType.torso,
            EquipType.pants,
            EquipType.left_hand,
            EquipType.right_hand,
            EquipType.left_shoe,
            EquipType.right_shoe,
            EquipType.ring,
            EquipType.necklace
        ];
        wornSlots.forEach(slot => {
            const slotElement = document.getElementById(slot);
            if (!slotElement)
                return console.warn(`Slot not found: ${slot}`);
            slotElement.innerHTML = ""; // Clear previous content
            const equippedItem = this.equippedItems[slot]; // Function to retrieve equipped item (see below)
            if (equippedItem) {
                const equippedItemDiv = document.createElement("div");
                equippedItemDiv.classList.add("equipped-item");
                equippedItemDiv.userData = equippedItem;
                // Create item icon
                const icon = document.createElement("img");
                icon.src = `./assets/items/${this.inventory.grab_item_image(equippedItem.name)}.png` || "./assets/default_spell_icon.png";
                icon.alt = equippedItem.name;
                icon.classList.add("equipped-icon");
                equippedItemDiv.appendChild(icon);
                // Click to unequip
                equippedItemDiv.addEventListener("click", () => {
                    this.unequipItem(equippedItem);
                });
                slotElement.appendChild(equippedItemDiv);
            }
            else {
                console.log(`No item equipped in ${slot}`);
            }
        });
    }
    eat(item) {
        this.inventory.removeFromInventory(item);
    }
    // castSpell(caster, spellCost, spellDifficulty) {
    //     if (caster.magicStamina < spellCost) {
    //         console.log(`${caster.name} does not have enough magic stamina!`);
    //         return;
    //     }
    //     if (this.calculateCastFailureRate(caster.magic, spellDifficulty)) {
    //         console.log(`${caster.name} failed to cast the spell!`);
    //         return;
    //     }
    //     caster.magicStamina = this.calculateMagicDrain(caster.magicStamina, spellCost);
    //     console.log(`${caster.name} successfully casts the spell!`);
    // }
    // // **New: Magic Drain (Each spell uses up magic stamina, based on total XP)**
    // calculateMagicDrain(totalMagicXP, spellCost) {
    //     return Math.max(0, totalMagicXP - spellCost); // Ensures it doesn't go negative
    // }
    // **New: Cast Failure Rate (Lower XP = More Failed Casts)**
    calculateCastFailureRate(magicLevel, spellDifficulty) {
        const successChance = Math.min(0.98, Math.max(0.2, magicLevel / (magicLevel + spellDifficulty + 50)));
        return Math.random() > successChance; // True means spell failed
    }
    displayStats() {
        // Get the stats container element
        const statsContainer = document.getElementById("stats-list");
        // Clear the current stats list
        statsContainer.innerHTML = '';
        // Create a heading with player's name
        const playerName = document.createElement("h2");
        playerName.textContent = `${this.name}`;
        statsContainer.appendChild(playerName);
        // Iterate over all skills to display their stats
        for (const skill in this.skills) {
            const skillData = this.skills[skill];
            // Create a list item for each skill
            const skillItem = document.createElement("div");
            skillItem.innerHTML = `
                <strong>${skill.charAt(0).toUpperCase() + skill.slice(1)}</strong>: 
                Level ${this.getLevelFromXP(this.skills[skill].experience_points)}/${999} - 
                Experience: ${this.skills[skill].total_points_available} / ${this.skills[skill].experience_points}
        `;
            statsContainer.appendChild(skillItem);
        }
        // Add combat level at the top
        const combatLevel = document.createElement("div");
        combatLevel.innerHTML = `<strong>Combat Level:</strong> ${this.getCombatLevel()}`;
        statsContainer.appendChild(combatLevel);
    }
    setupCombatUI() {
        // Combat mode (attack / defend)
        const modeButtons = document.querySelectorAll('input[name="combatMode"]');
        modeButtons.forEach(btn => {
            btn.addEventListener("change", () => {
                this.combatMode = btn.value; // attack or defend
                console.log("Combat mode:", this.combatMode);
            });
        });
        // Auto attack
        const autoAttackCheckbox = document.getElementById("autoAttack");
        autoAttackCheckbox.addEventListener("change", () => {
            this.autoAttack = autoAttackCheckbox.checked;
            console.log("Auto Attack:", this.autoAttack);
        });
        // Special attack
        const specialBtn = document.getElementById("specialAttack");
        specialBtn.addEventListener("click", () => {
            this.performSpecialAttack();
        });
    }
    performSpecialAttack() {
        const leftHandWeapon = this.equippedItems[EquipType.left_hand];
        const rightHandWeapon = this.equippedItems[EquipType.right_hand];
        if (leftHandWeapon || rightHandWeapon) {
            if (leftHandWeapon.specialAttack) {
                this.attackWithSpecialAttack(leftHandWeapon);
            }
            if (rightHandWeapon.specialAttack) {
                this.attackWithSpecialAttack(rightHandWeapon);
            }
        }
    }
    attackWithSpecialAttack(weapon) {
        if (!this.specialReady) {
            console.log("Special attack not ready!");
            return;
        }
        this.specialReady = false;
        // Example: big bonus damage
        console.log(`${this.name} performs a SPECIAL ATTACK!`);
        // cooldown of 5 seconds
        setTimeout(() => {
            this.specialReady = true;
            console.log("Special attack ready again.");
        }, 5000);
    }
    getCombatLevel() {
        const hp = this.getLevelFromXP(this.skills.hp.experience_points);
        const str = this.getLevelFromXP(this.skills.strength.experience_points);
        const def = this.getLevelFromXP(this.skills.defense.experience_points);
        const mage = this.getLevelFromXP(this.skills.mage.experience_points);
        const archer = this.getLevelFromXP(this.skills.archer.experience_points);
        const agility = this.getLevelFromXP(this.skills.agility.experience_points);
        // Melee combat level
        const meleeLevel = Math.floor((str + def + hp + agility) / 4);
        // Magic combat level
        const mageLevel = Math.floor((mage + def + hp + agility) / 4);
        // Ranged combat level
        const archerLevel = Math.floor((archer + def + hp + agility) / 4);
        // Final Combat Level = highest style
        return Math.max(meleeLevel, mageLevel, archerLevel);
    }
    follow(targetCharacter, distance = 2.5) {
        if (!targetCharacter || !targetCharacter.base)
            return;
        this.followTarget = targetCharacter;
        this.followDistance = distance;
        this.isFollowing = true;
    }
    stopFollowing() {
        this.isFollowing = false;
        this.followTarget = null;
    }
    updateFollow() {
        if (!this.isFollowing || !this.followTarget)
            return;
        const targetPos = this.followTarget.base.position.clone();
        const myPos = this.base.position.clone();
        const direction = targetPos.sub(myPos);
        const distance = direction.length();
        if (distance <= this.followDistance) {
            this.walk(false);
            return;
        }
        direction.normalize();
        const speed = 0.08; // follow speed
        this.base.position.add(direction.multiplyScalar(speed));
        // Face target
        this.base.rotation.y = Math.atan2(direction.x, direction.z);
        this.walk(true);
    }
    getCharacterConfigFromUI() {
        return {
            username: document.getElementById("usernameInput").value.trim(),
            gender: document.getElementById("genderSelect").value,
            skinColor: document.getElementById("skinColor").value,
            hairStyle: document.getElementById("hairStyle").value,
            hairColor: document.getElementById("hairColor").value,
            beard: document.getElementById("beardStyle").value,
            beardColor: document.getElementById("beardColor").value,
            mustache: document.getElementById("mustacheStyle").value
        };
    }
    updateFromConfig(config) {
        // Username (used for chat / overhead text)
        if (config.username) {
            this.name = config.username;
        }
        // Gender → rebuild body only
        if (config.gender && config.gender !== this.gender) {
            this.gender = config.gender;
            // this.removeBody();
            this.addBody(false, config.gender === "female");
        }
        // Skin color
        if (config.skinColor) {
            this.skinMaterial.color.set(config.skinColor);
        }
        // Hair
        if (config.hairStyle || config.hairColor) {
            // this.removeHair();
            this.createHair(config.hairStyle, config.hairColor);
        }
        // Beard
        if (config.beard || config.beardColor) {
            // this.removeBeard();
            if (config.beard !== "none") {
                this.addBeard(config.beard, config.beardColor);
            }
        }
        // Mustache
        if (config.mustache) {
            // this.removeMustache();
            if (config.mustache !== "none") {
                this.addMustache(config.mustache, config.hairColor);
            }
        }
    }
    bindCharacterCustomizationUI() {
        const update = () => {
            const config = this.getCharacterConfigFromUI();
            this.updateFromConfig(config);
        };
        const fields = [
            "usernameInput",
            "genderSelect",
            "skinColor",
            "hairStyle",
            "hairColor",
            "beardStyle",
            "mustacheStyle",
            "beardColor"
        ];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (!el)
                return;
            // live updates for sliders & colors
            el.addEventListener("input", update);
            // dropdowns & text inputs
            el.addEventListener("change", update);
        });
    }
    bindLogoutButton() {
        document.getElementById('logout-btn').addEventListener("click", () => {
            console.log("goodbye world");
            socket.sendMessage("disconnect", "logged out");
        });
    }
    createHair(style, color) {
        // -------------------------------
        // HAIR
        // -------------------------------
        const hairStyle = style || this.characterConfig.hairStyle;
        const hairColor = color || this.characterConfig.hairColor;
        const isBald = this.characterConfig.bald;
        if (!isBald) {
            const hairMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(hairColor),
                roughness: 0.9
            });
            let hair;
            switch (hairStyle) {
                case "short":
                    hair = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 1.4), hairMaterial);
                    hair.position.set(0, 2.75, 0);
                    break;
                case "long":
                    hair = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.5), hairMaterial);
                    hair.position.set(0, 2.55, -0.05);
                    break;
                case "ponytail":
                    hair = new THREE.Group();
                    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 1.4), hairMaterial);
                    top.position.set(0, 2.75, 0);
                    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.6), hairMaterial);
                    tail.position.set(0, 2.0, -0.6);
                    hair.add(top, tail);
                    break;
                default:
                    hair = null;
            }
            if (hair) {
                hair.castShadow = true;
                this.base.add(hair);
                // this.hair = hair; // save reference for hats / updates
            }
        }
        else
            this.addHead();
    }
    sealMonster(monster) {
        if (!monster || !monster.alive)
            return;
        const scroll = this.inventory.findItemByName("sealing scroll");
        if (!scroll) {
            console.log("No sealing scroll!");
            return;
        }
        // Optional: Require monster to be weak
        if (monster.stats.hp >= monster.maxHp) {
            console.log("Monster too strong to seal!");
            return;
        }
        const sealedData = {
            id: crypto.randomUUID(),
            monsterType: monster.monsterType,
            level: monster.stats.strength,
            stats: Object.assign({}, monster.stats),
            monster
        };
        // Consume scroll
        this.inventory.removeFromInventory(scroll, 1);
        // Kill monster without drops
        monster.forceDespawn();
        // Add summon item
        this.inventory.add_to_inventory({
            name: `${monster.monster}`,
            summonable: true,
            sealedMonster: sealedData,
            pickupable: true,
            imageName: "scroll_with_seal",
            dismissable: true
        });
        this.addExperience('mage', sealedData.monster.maxHp * 50);
        console.log(`🔒 Sealed ${monster.monster}`);
    }
    summonMonster(item) {
        if (!item.summonable)
            return;
        if (this.activeSummon) {
            console.log("Already have an active summon!");
            return;
        }
        const spawnPos = this.base.position.clone();
        console.log(this.scene);
        const summon = new Monster(Object.assign({ y: 0 }, spawnPos), this.scene, item.sealedMonster.monster, true, // isSummon,
        item.sealedMonster.monster);
        // Override stats
        summon.stats = Object.assign({}, item.sealedMonster.stats);
        summon.maxHp = item.sealedMonster.stats.hp;
        summon.owner = this;
        summon.isSummon = true;
        this.activeSummon = summon;
        // Auto-follow owner
        summon.follow(this);
        console.log(`✨ Summoned ${item.name}`);
        this.addExperience('mage', item.sealedMonster.monster.maxHp * 50);
    }
    dismissSummon() {
        if (!this.activeSummon)
            return;
        this.addExperience('mage', this.activeSummon.maxHp * 50);
        this.scene.remove(this.activeSummon.model);
        this.activeSummon = null;
    }
}
