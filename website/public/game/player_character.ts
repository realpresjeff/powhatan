import { axe, bow, sword } from './weapons/index.js';

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
        const helmet = new THREE.Mesh(helmetGeo, steelMaterial);

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

        this.walkCycle += 0.25; // ⬅️ increased from 0.1 to 0.25

        // Legs
        this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.5;
        this.rightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.5;

        // Forward movement
        this.base.position.z -= 0.05;
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
}

