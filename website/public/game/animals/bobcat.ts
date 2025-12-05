export function createBobcatModel(options: {
    coatColor?: number;
    whiteColor?: number;
    legColor?: number;
    earInnerColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0xA67C52,      // tan/brown bobcat fur
        whiteColor = 0xE8DCC8,     // underside
        legColor = 0x70533A,       // dark legs
        earInnerColor = 0xC8A890,
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const bobcat = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const whiteMat = new THREE.MeshStandardMaterial({ color: whiteColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x000000, flatShading: true });

    // ============================================================
    // BODY (compact & muscular)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(2.0, 0.75, 0.85);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 0.75, 0);
    bobcat.add(body);

    // Underbelly
    const bellyGeom = new THREE.BoxGeometry(1.8, 0.35, 0.6);
    const belly = new THREE.Mesh(bellyGeom, whiteMat);
    belly.position.set(0, -0.18, 0);
    body.add(belly);

    // ============================================================
    // NECK
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(0.8, 1.05, 0);
    neck.rotation.z = -0.15;
    bobcat.add(neck);

    // ============================================================
    // HEAD (broad cat head)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.85, 0.55, 0.6);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.25, 1.22, 0);
    bobcat.add(head);

    // CHEEK FUR (jowls)
    const cheekGeom = new THREE.BoxGeometry(0.2, 0.4, 0.6);
    const cheeks = new THREE.Mesh(cheekGeom, coatMat);
    cheeks.position.set(-0.35, -0.05, 0);
    head.add(cheeks);

    // ============================================================
    // MUZZLE
    // ============================================================
    const muzzleGeom = new THREE.BoxGeometry(0.45, 0.25, 0.25);
    const muzzle = new THREE.Mesh(muzzleGeom, whiteMat);
    muzzle.position.set(0.35, -0.05, 0);
    head.add(muzzle);

    // NOSE
    const noseGeom = new THREE.BoxGeometry(0.16, 0.14, 0.14);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.23, 0, 0);
    muzzle.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.09, 0.09, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.15, 0.05, 0.22);
    rightEye.position.set(0.15, 0.05, -0.22);
    head.add(leftEye, rightEye);

    // ============================================================
    // EARS (pointy with tufts)
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.28, 0.35, 0.18);
    const innerGeom = new THREE.BoxGeometry(0.2, 0.25, 0.1);
    const tuftGeom = new THREE.BoxGeometry(0.12, 0.25, 0.12);

    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(innerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(innerGeom, earInnerMat);
    const leftTuft = new THREE.Mesh(tuftGeom, coatMat);
    const rightTuft = new THREE.Mesh(tuftGeom, coatMat);

    leftEar.position.set(0.05, 0.33, 0.24);
    rightEar.position.set(0.05, 0.33, -0.24);
    leftEar.rotation.z = -0.25;
    rightEar.rotation.z = -0.25;

    leftInner.position.set(0, 0, 0.05);
    rightInner.position.set(0, 0, -0.05);

    leftTuft.position.set(0, 0.22, 0);
    rightTuft.position.set(0, 0.22, 0);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    leftEar.add(leftTuft);
    rightEar.add(rightTuft);
    head.add(leftEar, rightEar);

    // ============================================================
    // LEGS (taller than fox, stockier than coyote)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.22, 0.55, 0.24);
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

    bobcat.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL (short bobtail)
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.55, 0.28, 0.28);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.0, 0.90, 0);
    bobcat.add(tail);

    // ============================================================
    // RIG
    // ============================================================
    bobcat.userData.rig = {
        body,
        neck,
        head,
        muzzle,
        cheeks,
        tail,
        leftEar,
        rightEar,
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight,
        },
    };

    bobcat.scale.set(scale, scale, scale);
    return bobcat;
}
