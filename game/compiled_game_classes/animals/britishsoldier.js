export function createElizabethanBritishSoldierModel(options = {}) {
    const { coatColor = 0x7a3f2a, pantsColor = 0x3a3a3a, helmetColor = 0x4a4a4a, leatherColor = 0x5a3b1e, skinColor = 0xd8c6a3, eyeColor = 0x111111, weaponColor = 0x6b4a2d, scale = 1, } = options;
    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, flatShading: true });
    const helmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, metalness: 0.5, roughness: 0.6 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: leatherColor, flatShading: true });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const weaponMat = new THREE.MeshStandardMaterial({ color: weaponColor, flatShading: true });
    const soldier = new THREE.Group();
    // ============================================================
    // TORSO — buff coat
    // ============================================================
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.0, 0.45), coatMat);
    torso.position.set(0, 1.35, 0);
    soldier.add(torso);
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.12, 0.50), leatherMat);
    belt.position.set(0, -0.35, 0);
    torso.add(belt);
    // ============================================================
    // HEAD + MORION HELMET
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
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.35, 0.50), helmetMat);
    helmet.position.set(0, 0.15, 0);
    head.add(helmet);
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.30, 0.05), helmetMat);
    crest.position.set(0.20, 0.15, 0);
    head.add(crest);
    // ============================================================
    // ARMS — right arm posed to hold pike
    // ============================================================
    function makeArm(side) {
        const arm = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.25), coatMat);
        upper.position.set(0, -0.22, 0);
        const fore = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.45, 0.20), coatMat);
        fore.position.set(0, -0.40, 0);
        upper.add(fore);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), skinMat);
        hand.position.set(0, -0.32, 0);
        fore.add(hand);
        arm.add(upper);
        arm.position.set(0.35, 1.55, 0.30 * side);
        return { arm, upper, fore, hand };
    }
    // Left arm relaxed
    const leftArm = makeArm(-1);
    soldier.add(leftArm.arm);
    // Right arm holding pike
    const rightArm = makeArm(1);
    soldier.add(rightArm.arm);
    // rightArm.upper.rotation.z = -0.9;
    // rightArm.upper.rotation.x = 0.2;
    // rightArm.fore.rotation.z = -0.6;
    // rightArm.fore.rotation.x = 0.2;
    // ============================================================
    // PIKE — attached to right hand
    // ============================================================
    const pike = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.0, 10), weaponMat);
    pike.rotation.z = Math.PI / 2;
    pike.position.set(0.15, -0.05, 0);
    rightArm.hand.add(pike);
    const pikeTip = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.12), helmetMat);
    pikeTip.position.set(1.5, 0, 0);
    pike.add(pikeTip);
    // ============================================================
    // LEGS — breeches + shoes
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
    soldier.add(makeLeg(1));
    soldier.add(makeLeg(-1));
    // ============================================================
    soldier.scale.set(scale, scale, scale);
    soldier.userData = {
        head,
        rightArm,
        pike,
    };
    return soldier;
}
