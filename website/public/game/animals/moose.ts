export function createMooseModel(options: {
    coatColor?: number;
    muzzleColor?: number;
    antlerColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0x5A4A36,     // dark brown moose coat
        muzzleColor = 0xC6A98A,   // lighter snout
        antlerColor = 0xD8C5A2,   // pale tan antlers
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const moose = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: muzzleColor, flatShading: true });
    const antlerMat = new THREE.MeshStandardMaterial({ color: antlerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });

    // ============================================================
    // BODY (massive torso)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(3.4, 1.6, 1.3);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 1.4, 0);
    moose.add(body);

    // ============================================================
    // SHOULDER HUMP (moose signature feature)
    // ============================================================
    const humpGeom = new THREE.BoxGeometry(1.8, 1.0, 1.2);
    const hump = new THREE.Mesh(humpGeom, coatMat);
    hump.position.set(0.4, 1.1, 0);
    body.add(hump);

    // ============================================================
    // NECK (very long & thick)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.9, 1.0, 0.9);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(1.7, 2.0, 0);
    neck.rotation.z = -0.3;
    moose.add(neck);

    // ============================================================
    // HEAD (long rectangular shape)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(1.0, 0.55, 0.55);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(2.35, 2.25, 0);
    moose.add(head);

    // MUZZLE (long moose snout)
    const muzzleGeom = new THREE.BoxGeometry(0.65, 0.45, 0.45);
    const muzzle = new THREE.Mesh(muzzleGeom, muzzleMat);
    muzzle.position.set(0.55, -0.10, 0);
    head.add(muzzle);

    // NOSE TIP
    const noseGeom = new THREE.BoxGeometry(0.22, 0.20, 0.20);
    const nose = new THREE.Mesh(noseGeom, coatMat);
    nose.position.set(0.32, 0, 0);
    muzzle.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.10, 0.10, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.05, 0.05, 0.22);
    rightEye.position.set(0.05, 0.05, -0.22);
    head.add(leftEye, rightEye);

    // ============================================================
    // EARS
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.35, 0.45, 0.18);
    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);

    leftEar.position.set(-0.05, 0.28, 0.35);
    rightEar.position.set(-0.05, 0.28, -0.35);

    leftEar.rotation.z = -0.25;
    rightEar.rotation.z = -0.25;

    head.add(leftEar, rightEar);

    // ============================================================
    // DEWLAP ("bell") under throat
    // ============================================================
    const dewlapGeom = new THREE.BoxGeometry(0.25, 0.55, 0.25);
    const dewlap = new THREE.Mesh(dewlapGeom, coatMat);
    dewlap.position.set(0.20, -0.45, 0);
    neck.add(dewlap);

    // ============================================================
    // ANTLERS (palmate moose style)
    // ============================================================
    function makeAntler(isLeft: boolean) {
        const root = new THREE.Group();

        const base = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), antlerMat);
        base.position.set(0, 0.25, 0);
        root.add(base);

        // Palmate plate
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.7), antlerMat);
        plate.position.set(isLeft ? -0.45 : 0.45, 0.15, 0);
        plate.rotation.y = isLeft ? 0.4 : -0.4;
        root.add(plate);

        // Small points
        function addPoint(x: number, y: number, z: number) {
            const p = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.25, 0.20), antlerMat);
            p.position.set(x, y, z);
            plate.add(p);
        }

        addPoint(0.20, 0.20, 0.25);
        addPoint(-0.20, 0.20, -0.25);
        addPoint(0.30, 0.15, -0.15);

        return root;
    }

    const leftAntler = makeAntler(true);
    leftAntler.position.set(0.00, 0.42, 0.38);
    const rightAntler = makeAntler(false);
    rightAntler.position.set(0.00, 0.42, -0.38);

    head.add(leftAntler, rightAntler);

    // ============================================================
    // LEGS (long moose legs)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.32, 0.9, 0.32);
    const lowerLegGeom = new THREE.BoxGeometry(0.28, 0.9, 0.28);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, coatMat);

        group.position.set(x, 0.45, z);
        upper.position.set(0, -0.45, 0);
        lower.position.set(0, -0.75, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(1.2, 0.35);
    const frontRight = makeLeg(1.2, -0.35);
    const backLeft = makeLeg(-1.2, 0.35);
    const backRight = makeLeg(-1.2, -0.35);

    moose.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL (small, moose-style)
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.35, 0.25, 0.25);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.7, 1.4, 0);
    moose.add(tail);

    // ============================================================
    // RIG EXPORT
    // ============================================================
    moose.userData.rig = {
        body,
        hump,
        neck,
        head,
        muzzle,
        dewlap,
        ears: { leftEar, rightEar },
        antlers: { leftAntler, rightAntler },
        legs: { frontLeft, frontRight, backLeft, backRight },
        tail
    };

    moose.scale.set(scale, scale, scale);
    return moose;
}
