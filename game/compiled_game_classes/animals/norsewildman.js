export function createNorseWildmanModel(data, options = {}) {
    const { furColor = 0x4a3a2a, // dark fur cloak
    pantsColor = 0x3a3a3a, // rough trousers
    skinColor = 0xc9b28f, hairColor = 0x3a2a1a, // dark hair/beard
    eyeColor = 0x111111, woodColor = 0x6b4a2d, metalColor = 0x666666, scale = 1, } = options;
    const furMat = new THREE.MeshStandardMaterial({ color: furColor, flatShading: true });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, flatShading: true });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, flatShading: true });
    const metalMat = new THREE.MeshStandardMaterial({
        color: metalColor,
        metalness: 0.5,
        roughness: 0.6
    });
    const wildman = new THREE.Group();
    // ============================================================
    // TORSO — bare chest + fur mantle
    // ============================================================
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.70, 1.05, 0.45), skinMat);
    torso.position.set(0, 1.35, 0);
    torso.userData = data;
    wildman.add(torso);
    // Fur cloak
    const fur = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.70, 0.55), furMat);
    fur.position.set(-0.05, 0.25, 0);
    torso.add(fur);
    // ============================================================
    // HEAD — attached to torso
    // ============================================================
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.42), skinMat);
    head.position.set(0.30, 0.90, 0);
    head.userData = data;
    torso.add(head);
    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.12, 0.05, 0.14);
    eyeR.position.set(0.12, 0.05, -0.14);
    head.add(eyeL, eyeR);
    // Hair (top)
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.48), hairMat);
    hair.position.set(-0.02, 0.28, 0);
    head.add(hair);
    // Beard
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.35, 0.30), hairMat);
    beard.position.set(0.10, -0.30, 0);
    head.add(beard);
    // ============================================================
    // ARMS — right arm with axe
    // ============================================================
    function makeArm(side) {
        const arm = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.46, 0.26), skinMat);
        upper.position.set(0, -0.23, 0);
        const fore = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.22), skinMat);
        fore.position.set(0, -0.40, 0);
        upper.add(fore);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), skinMat);
        hand.position.set(0, -0.32, 0);
        fore.add(hand);
        arm.userData = data;
        arm.add(upper);
        arm.position.set(0.40, 1.55, 0.32 * side);
        // IMPORTANT: arms face forward
        arm.rotation.y = Math.PI;
        return { arm, upper, fore, hand };
    }
    const leftArm = makeArm(-1);
    const rightArm = makeArm(1);
    wildman.add(leftArm.arm, rightArm.arm);
    // Pose axe arm (raised, threatening)
    rightArm.upper.rotation.z = -1.1;
    rightArm.upper.rotation.x = 0.3;
    rightArm.fore.rotation.z = -0.6;
    rightArm.hand.rotation.y = Math.PI / 2;
    // Left arm relaxed / balancing
    leftArm.upper.rotation.z = -0.3;
    // ============================================================
    // AXE — attached to right hand
    // ============================================================
    const axe = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 10), woodMat);
    handle.rotation.z = Math.PI / 2;
    axe.add(handle);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.25, 0.08), metalMat);
    blade.position.set(0.55, 0.10, 0);
    axe.add(blade);
    axe.position.set(0.10, -0.05, 0);
    rightArm.hand.add(axe);
    // ============================================================
    // LEGS — rough trousers
    // ============================================================
    function makeLeg(side) {
        const leg = new THREE.Group();
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.55, 0.34), pantsMat);
        thigh.position.set(0, -0.28, 0);
        const shin = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.55, 0.26), pantsMat);
        shin.userData = data;
        shin.position.set(0, -0.48, 0);
        thigh.add(shin);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.12, 0.42), pantsMat);
        foot.position.set(0.05, -0.40, 0);
        shin.add(foot);
        leg.add(thigh);
        leg.position.set(-0.10, 0.80, 0.20 * side);
        return leg;
    }
    wildman.add(makeLeg(1), makeLeg(-1));
    // ============================================================
    wildman.scale.set(scale, scale, scale);
    wildman.userData = {
        head,
        rightArm,
        axe,
    };
    return wildman;
}
