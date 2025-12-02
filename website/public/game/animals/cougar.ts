export function createCougarModel(options: {
    coatColor?: number;
    underbellyColor?: number;
    muzzleColor?: number;
    eyeColor?: number;
    earInnerColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0xA47C52,        // tawny cougar color
        underbellyColor = 0xD9C5A3,
        muzzleColor = 0xE8DCC8,
        eyeColor = 0x222222,
        earInnerColor = 0xAA8888,
        scale = 1,
    } = options;

    const cougar = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const underMat = new THREE.MeshStandardMaterial({ color: underbellyColor, flatShading: true });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: muzzleColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true });

    // ===== BODY =====
    const bodyGeom = new THREE.BoxGeometry(2.4, 0.8, 0.7);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 0.9, 0);
    body.castShadow = body.receiveShadow = true;
    cougar.add(body);

    // Underbelly (visual detail)
    const bellyGeom = new THREE.BoxGeometry(2.2, 0.4, 0.55);
    const belly = new THREE.Mesh(bellyGeom, underMat);
    belly.position.set(0, -0.3, 0);
    body.add(belly);

    // ===== NECK =====
    const neckGeom = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(0.9, 1.15, 0);
    neck.rotation.z = -0.25;
    cougar.add(neck);

    // ===== HEAD =====
    const headGeom = new THREE.BoxGeometry(0.75, 0.48, 0.48);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.35, 1.28, 0);
    head.castShadow = head.receiveShadow = true;
    cougar.add(head);

    // ===== MUZZLE =====
    const muzzleGeom = new THREE.BoxGeometry(0.40, 0.26, 0.26);
    const muzzle = new THREE.Mesh(muzzleGeom, muzzleMat);
    muzzle.position.set(0.33, -0.05, 0);
    head.add(muzzle);

    // ===== NOSE =====
    const noseGeom = new THREE.BoxGeometry(0.16, 0.14, 0.14);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.20, 0, 0);
    muzzle.add(nose);

    // ===== EYES =====
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.12, 0.05, 0.18);
    rightEye.position.set(0.12, 0.05, -0.18);
    head.add(leftEye, rightEye);

    // ===== EARS =====
    const earGeom = new THREE.BoxGeometry(0.18, 0.25, 0.12);
    const earInnerGeom = new THREE.BoxGeometry(0.12, 0.18, 0.08);
    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(earInnerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(earInnerGeom, earInnerMat);

    leftEar.position.set(0.05, 0.28, 0.20);
    rightEar.position.set(0.05, 0.28, -0.20);
    leftEar.rotation.z = -0.4;
    rightEar.rotation.z = -0.4;

    leftInner.position.set(0, 0, 0.03);
    rightInner.position.set(0, 0, -0.03);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    head.add(leftEar, rightEar);

    // ===== LEGS =====
    const upperLegGeom = new THREE.BoxGeometry(0.20, 0.55, 0.20);
    const lowerLegGeom = new THREE.BoxGeometry(0.17, 0.65, 0.17);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, coatMat);

        group.position.set(x, 0.55, z);
        upper.position.set(0, -0.28, 0);
        lower.position.set(0, -0.55, 0);

        group.add(upper);
        upper.add(lower);

        upper.castShadow = upper.receiveShadow =
            lower.castShadow = lower.receiveShadow = true;

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(0.75, 0.23);
    const frontRight = makeLeg(0.75, -0.23);
    const backLeft = makeLeg(-0.75, 0.23);
    const backRight = makeLeg(-0.75, -0.23);

    cougar.add(
        frontLeft.group,
        frontRight.group,
        backLeft.group,
        backRight.group
    );

    // ===== TAIL =====
    const tailGeom = new THREE.BoxGeometry(1.0, 0.22, 0.22);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.35, 0.85, 0);
    tail.rotation.z = 0.25;
    tail.castShadow = tail.receiveShadow = true;
    cougar.add(tail);

    // ===== EXPORT RIG REF =====
    cougar.userData.rig = {
        body,
        belly,
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
            backRight,
        },
    };

    cougar.scale.set(scale, scale, scale);
    return cougar;
}
