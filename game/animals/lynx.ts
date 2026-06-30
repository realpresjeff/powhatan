export function createLynxModel(options: {
    coatColor?: number;
    whiteColor?: number;
    legColor?: number;
    earInnerColor?: number;
    eyeColor?: number;
    scale?: number;
    winterCoat?: boolean;
} = {}) {
    const {
        coatColor = 0xB6A58A,        // tawny-gray lynx coat
        whiteColor = 0xE8DCC8,       // muzzle + belly
        legColor = 0x6E5A44,         // darker paws
        earInnerColor = 0xC8A890,
        eyeColor = 0x111111,
        scale = 1,
        winterCoat = false,
    } = options;

    const lynx = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({
        color: winterCoat ? 0xD9D9D9 : coatColor,
        flatShading: true
    });
    const whiteMat = new THREE.MeshStandardMaterial({ color: whiteColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x000000, flatShading: true });

    // ============================================================
    // BODY (larger & taller than bobcat)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(2.4, 0.9, 1.0);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 0.9, 0);
    lynx.add(body);

    // Belly
    const bellyGeom = new THREE.BoxGeometry(2.1, 0.4, 0.7);
    const belly = new THREE.Mesh(bellyGeom, whiteMat);
    belly.position.set(0, -0.25, 0);
    body.add(belly);

    // ============================================================
    // NECK (slightly longer)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(1.1, 1.25, 0);
    neck.rotation.z = -0.15;
    lynx.add(neck);

    // ============================================================
    // HEAD (wide flat lynx head)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(1.0, 0.65, 0.75);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.55, 1.35, 0);
    lynx.add(head);

    // Cheek Ruffs (larger than bobcat)
    const cheekGeom = new THREE.BoxGeometry(0.3, 0.5, 0.8);
    const cheeks = new THREE.Mesh(cheekGeom, coatMat);
    cheeks.position.set(-0.45, -0.1, 0);
    head.add(cheeks);

    // ============================================================
    // MUZZLE (short + wide)
    // ============================================================
    const muzzleGeom = new THREE.BoxGeometry(0.5, 0.28, 0.28);
    const muzzle = new THREE.Mesh(muzzleGeom, whiteMat);
    muzzle.position.set(0.35, -0.05, 0);
    head.add(muzzle);

    const noseGeom = new THREE.BoxGeometry(0.18, 0.14, 0.14);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.22, 0, 0);
    muzzle.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.10, 0.10, 0.03);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.12, 0.05, 0.25);
    rightEye.position.set(0.12, 0.05, -0.25);

    head.add(leftEye, rightEye);

    // ============================================================
    // EARS (big triangles + long tufts)
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.35, 0.45, 0.25);
    const innerGeom = new THREE.BoxGeometry(0.22, 0.3, 0.12);
    const tuftGeom = new THREE.BoxGeometry(0.12, 0.35, 0.12);

    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(innerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(innerGeom, earInnerMat);
    const leftTuft = new THREE.Mesh(tuftGeom, coatMat);
    const rightTuft = new THREE.Mesh(tuftGeom, coatMat);

    leftEar.position.set(0.05, 0.40, 0.28);
    rightEar.position.set(0.05, 0.40, -0.28);
    leftEar.rotation.z = -0.30;
    rightEar.rotation.z = -0.30;

    leftInner.position.set(0, 0, 0.07);
    rightInner.position.set(0, 0, -0.07);

    leftTuft.position.set(0, 0.30, 0);
    rightTuft.position.set(0, 0.30, 0);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    leftEar.add(leftTuft);
    rightEar.add(rightTuft);
    head.add(leftEar, rightEar);

    // ============================================================
    // LEGS (long, slender lynx legs)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.22, 0.70, 0.26);
    const lowerLegGeom = new THREE.BoxGeometry(0.20, 0.70, 0.22);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, legMat);

        group.position.set(x, 0.40, z);
        upper.position.set(0, -0.35, 0);
        lower.position.set(0, -0.55, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(0.85, 0.25);
    const frontRight = makeLeg(0.85, -0.25);
    const backLeft = makeLeg(-0.85, 0.25);
    const backRight = makeLeg(-0.85, -0.25);

    lynx.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL (tiny bobtail)
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.45, 0.30, 0.30);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.1, 1.0, 0);
    lynx.add(tail);

    // ============================================================
    // RIG EXPORT
    // ============================================================
    lynx.userData.rig = {
        body,
        belly,
        neck,
        head,
        muzzle,
        cheeks,
        tail,
        ears: {
            leftEar,
            rightEar,
            leftTuft,
            rightTuft,
        },
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight
        }
    };

    lynx.scale.set(scale, scale, scale);
    return lynx;
}
