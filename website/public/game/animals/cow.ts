export function createCowModel(options: {
    coatColor?: number;
    spotColor?: number;
    faceColor?: number;
    hoofColor?: number;
    eyeColor?: number;
    earInnerColor?: number;
    hasHorns?: boolean;
    hasUdders?: boolean;
    scale?: number;
} = {}) {
    const {
        coatColor = 0xFFFFFF,       // default dairy cow base
        spotColor = 0x000000,       // black spots
        faceColor = 0xE8DCC8,
        hoofColor = 0x3A2F24,
        eyeColor = 0x111111,
        earInnerColor = 0xD8B8A0,
        hasHorns = true,
        hasUdders = true,
        scale = 1,
    } = options;

    const cow = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const spotMat = new THREE.MeshStandardMaterial({ color: spotColor, flatShading: true });
    const faceMat = new THREE.MeshStandardMaterial({ color: faceColor, flatShading: true });
    const hoofMat = new THREE.MeshStandardMaterial({ color: hoofColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });

    // ============================================================
    // BODY (large rectangular torso)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(3.0, 1.4, 1.2);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 1.0, 0);
    cow.add(body);

    // Add a few cow spots
    function addSpot(x: number, y: number, z: number, sx: number, sy: number, sz: number) {
        const spot = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), spotMat);
        spot.position.set(x, y, z);
        body.add(spot);
    }

    // Some default spots (can remove if needed)
    addSpot(-0.5, 0.2, 0.55, 0.7, 0.5, 0.05);
    addSpot(0.8, 0.1, -0.55, 0.6, 0.4, 0.05);

    // ============================================================
    // UDDERS (optional)
    // ============================================================
    let udders = null;

    if (hasUdders) {
        const udderGeom = new THREE.BoxGeometry(0.6, 0.25, 0.4);
        udders = new THREE.Mesh(udderGeom, faceMat); // pale pinkish tone
        udders.position.set(-0.2, -0.8, 0);
        body.add(udders);
    }

    // ============================================================
    // NECK (thick cow neck)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(1.6, 1.45, 0);
    neck.rotation.z = -0.2;
    cow.add(neck);

    // ============================================================
    // HEAD (broad cow face)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.9, 0.65, 0.65);
    const head = new THREE.Mesh(headGeom, faceMat);
    head.position.set(2.25, 1.55, 0);
    cow.add(head);

    // SNOUT (long & flat)
    const snoutGeom = new THREE.BoxGeometry(0.65, 0.35, 0.45);
    const snout = new THREE.Mesh(snoutGeom, faceMat);
    snout.position.set(0.50, -0.05, 0);
    head.add(snout);

    // Nose
    const noseGeom = new THREE.BoxGeometry(0.20, 0.14, 0.14);
    const nose = new THREE.Mesh(noseGeom, hoofMat);
    nose.position.set(0.32, 0, 0);
    snout.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.10, 0.10, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.18, 0.10, 0.26);
    rightEye.position.set(0.18, 0.10, -0.26);
    head.add(leftEye, rightEye);

    // ============================================================
    // EARS
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.36, 0.20, 0.25);
    const earInnerGeom = new THREE.BoxGeometry(0.25, 0.14, 0.12);

    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(earInnerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(earInnerGeom, earInnerMat);

    leftEar.position.set(0.00, 0.28, 0.30);
    rightEar.position.set(0.00, 0.28, -0.30);

    leftInner.position.set(0, 0, 0.06);
    rightInner.position.set(0, 0, -0.06);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    head.add(leftEar, rightEar);

    // ============================================================
    // HORNS (optional)
    // ============================================================
    if (hasHorns) {
        const hornGeom = new THREE.BoxGeometry(0.25, 0.18, 0.18);

        const leftHorn = new THREE.Mesh(hornGeom, hoofMat);
        const rightHorn = new THREE.Mesh(hornGeom, hoofMat);

        leftHorn.position.set(-0.15, 0.25, 0.22);
        rightHorn.position.set(-0.15, 0.25, -0.22);

        leftHorn.rotation.z = -0.4;
        rightHorn.rotation.z = -0.4;

        head.add(leftHorn, rightHorn);
    }

    // ============================================================
    // LEGS (thick sturdy cow legs)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.32, 0.65, 0.32);
    const lowerLegGeom = new THREE.BoxGeometry(0.28, 0.65, 0.28);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, hoofMat);

        group.position.set(x, 0.35, z);
        upper.position.set(0, -0.32, 0);
        lower.position.set(0, -0.55, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(1.0, 0.40);
    const frontRight = makeLeg(1.0, -0.40);
    const backLeft = makeLeg(-1.0, 0.40);
    const backRight = makeLeg(-1.0, -0.40);

    cow.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.25, 1.0, 0.25);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.5, 1.3, 0);
    tail.rotation.z = 0.25;
    cow.add(tail);

    // tuft
    const tuftGeom = new THREE.BoxGeometry(0.3, 0.25, 0.3);
    const tuft = new THREE.Mesh(tuftGeom, hoofMat);
    tuft.position.set(0, -0.55, 0);
    tail.add(tuft);

    // ============================================================
    // RIG EXPORT
    // ============================================================
    cow.userData.rig = {
        body,
        neck,
        head,
        snout,
        tail,
        ears: { leftEar, rightEar },
        udders,
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight,
        }
    };

    cow.scale.set(scale, scale, scale);
    return cow;
}
