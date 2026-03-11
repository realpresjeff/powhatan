export function createCoyoteModel(options: {
    coatColor?: number;
    whiteColor?: number;
    legColor?: number;
    eyeColor?: number;
    earInnerColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0x8A6F4D,     // dusty brown / coyote tan
        whiteColor = 0xE8DCC8,    // underbelly
        legColor = 0x4A3A2A,       // dark legs
        eyeColor = 0x111111,
        earInnerColor = 0xD8B8A0,
        scale = 1,
    } = options;

    const coyote = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const whiteMat = new THREE.MeshStandardMaterial({ color: whiteColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x000000, flatShading: true });

    // ============================================================
    // BODY (leaner than wolf, longer than fox)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(2.8, 0.75, 0.75);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 0.7, 0);
    coyote.add(body);

    // Underbelly
    const bellyGeom = new THREE.BoxGeometry(2.5, 0.35, 0.55);
    const belly = new THREE.Mesh(bellyGeom, whiteMat);
    belly.position.set(0, -0.18, 0);
    body.add(belly);

    // ============================================================
    // NECK (longer than fox, thinner than wolf)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(1.0, 1.05, 0);
    neck.rotation.z = -0.18;
    coyote.add(neck);

    // ============================================================
    // HEAD (narrow wolf-like head but smaller)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.80, 0.45, 0.45);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.42, 1.25, 0);
    coyote.add(head);

    // MUZZLE (longer than fox, slimmer than wolf)
    const muzzleGeom = new THREE.BoxGeometry(0.55, 0.28, 0.28);
    const muzzle = new THREE.Mesh(muzzleGeom, whiteMat);
    muzzle.position.set(0.42, -0.04, 0);
    head.add(muzzle);

    // NOSE
    const noseGeom = new THREE.BoxGeometry(0.18, 0.16, 0.16);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.28, 0, 0);
    muzzle.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.13, 0.04, 0.17);
    rightEye.position.set(0.13, 0.04, -0.17);
    head.add(leftEye, rightEye);

    // ============================================================
    // EARS (large, upright)
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.28, 0.38, 0.18);
    const innerGeom = new THREE.BoxGeometry(0.18, 0.26, 0.1);

    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(innerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(innerGeom, earInnerMat);

    leftEar.position.set(0.05, 0.30, 0.23);
    rightEar.position.set(0.05, 0.30, -0.23);

    leftEar.rotation.z = -0.25;
    rightEar.rotation.z = -0.25;

    leftInner.position.set(0, 0, 0.05);
    rightInner.position.set(0, 0, -0.05);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    head.add(leftEar, rightEar);

    // ============================================================
    // LEGS (longer than fox, slimmer than wolf)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.22, 0.55, 0.22);
    const lowerLegGeom = new THREE.BoxGeometry(0.20, 0.55, 0.20);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, legMat);

        group.position.set(x, 0.35, z);
        upper.position.set(0, -0.27, 0);
        lower.position.set(0, -0.50, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(0.75, 0.22);
    const frontRight = makeLeg(0.75, -0.22);
    const backLeft = makeLeg(-0.75, 0.22);
    const backRight = makeLeg(-0.75, -0.22);

    coyote.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL (lower + bushy but not as huge as fox)
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(1.2, 0.30, 0.30);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.35, 0.70, 0);
    tail.rotation.z = 0.10; // coyote tail = more downward
    coyote.add(tail);

    // ============================================================
    // EXPORT RIG
    // ============================================================
    coyote.userData.rig = {
        body,
        neck,
        head,
        muzzle,
        tail,
        leftEar,
        rightEar,
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight
        }
    };

    coyote.scale.set(scale, scale, scale);
    return coyote;
}
