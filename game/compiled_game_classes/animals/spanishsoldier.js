export function createSpanishArquebusierModel(options = {}) {
    const { coatColor = 0x3a2f2a, pantsColor = 0x2a2a2a, helmetColor = 0x3f3f3f, leatherColor = 0x4a2f18, skinColor = 0xd2c0a0, eyeColor = 0x111111, weaponColor = 0x6b4a2d, metalColor = 0x666666, scale = 1, } = options;
    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, flatShading: true });
    const helmetMat = new THREE.MeshStandardMaterial({
        color: helmetColor,
        metalness: 0.55,
        roughness: 0.6
    });
    const leatherMat = new THREE.MeshStandardMaterial({ color: leatherColor, flatShading: true });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const woodMat = new THREE.MeshStandardMaterial({ color: weaponColor, flatShading: true });
    const metalMat = new THREE.MeshStandardMaterial({ color: metalColor, metalness: 0.6, roughness: 0.5 });
    const soldier = new THREE.Group();
    // ============================================================
    // TORSO
    // ============================================================
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.05, 0.42), coatMat);
    torso.position.set(0, 1.35, 0);
    soldier.add(torso);
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.48), leatherMat);
    belt.position.set(0, -0.36, 0);
    torso.add(belt);
    // ============================================================
    // HEAD + MORION
    // ============================================================
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.45, 0.40), skinMat);
    head.position.set(0.55, 2.05, 0);
    soldier.add(head);
    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.12, 0.05, 0.14);
    eyeR.position.set(0.12, 0.05, -0.14);
    head.add(eyeL, eyeR);
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.38, 0.52), helmetMat);
    helmet.position.set(0, 0.15, 0);
    head.add(helmet);
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.32, 0.05), helmetMat);
    crest.position.set(0.20, 0.15, 0);
    head.add(crest);
    // ============================================================
    // ARMS (both used for gun)
    // ============================================================
    function makeArm(side) {
        const arm = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 0.24), coatMat);
        upper.position.set(0, -0.22, 0);
        const fore = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.44, 0.20), coatMat);
        fore.position.set(0, -0.40, 0);
        upper.add(fore);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), skinMat);
        hand.position.set(0, -0.32, 0);
        fore.add(hand);
        arm.add(upper);
        arm.position.set(0.35, 1.55, 0.30 * side);
        return { arm, upper, fore, hand };
    }
    const leftArm = makeArm(-1);
    const rightArm = makeArm(1);
    soldier.add(leftArm.arm, rightArm.arm);
    // Right arm: trigger hand
    // rightArm.upper.rotation.z = -1.0;
    // rightArm.upper.rotation.x = 0.25;
    // rightArm.fore.rotation.z = -0.6;
    // rightArm.hand.rotation.y = Math.PI / 2;
    // Left arm: barrel support
    // leftArm.upper.rotation.z = -0.6;
    // leftArm.upper.rotation.x = 0.2;
    // leftArm.fore.rotation.z = -0.4;
    // leftArm.hand.rotation.y = Math.PI / 2;
    // ============================================================
    // MATCHLOCK ARQUEBUS
    // ============================================================
    const gun = new THREE.Group();
    // Wooden stock
    const stock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.12), woodMat);
    gun.add(stock);
    // Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 10), metalMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.9, 0, 0);
    gun.add(barrel);
    // Matchlock mechanism
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 0.10), metalMat);
    lock.position.set(-0.2, 0.10, 0);
    gun.add(lock);
    // Attach gun to right hand
    gun.rotation.z = Math.PI / 2;
    gun.position.set(0.12, -0.04, 0);
    rightArm.hand.add(gun);
    // Left hand supports barrel
    leftArm.hand.position.set(0.15, -0.30, 0);
    leftArm.hand.add(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), skinMat));
    // ============================================================
    // LEGS
    // ============================================================
    function makeLeg(side) {
        const leg = new THREE.Group();
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.55, 0.30), pantsMat);
        thigh.position.set(0, -0.28, 0);
        const shin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.22), pantsMat);
        shin.position.set(0, -0.48, 0);
        thigh.add(shin);
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.40), leatherMat);
        shoe.position.set(0.05, -0.40, 0);
        shin.add(shoe);
        leg.add(thigh);
        leg.position.set(-0.10, 0.80, 0.18 * side);
        return leg;
    }
    soldier.add(makeLeg(1), makeLeg(-1));
    // ============================================================
    soldier.scale.set(scale, scale, scale);
    soldier.userData = {
        head,
        gun,
        rightArm,
        leftArm,
    };
    return soldier;
}
