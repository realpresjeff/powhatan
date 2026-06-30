// createBearModel.ts
// Assumes THREE is available/imported.

export function createBearModel(options: {
    coatColor?: number;
    muzzleColor?: number;
    pawColor?: number;
    eyeColor?: number;
    earInnerColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0x5a3b26,      // dark brown
        muzzleColor = 0xd2b79c,    // lighter muzzle
        pawColor = 0x3a2718,
        eyeColor = 0x111111,
        earInnerColor = 0x8b5a3c,
        scale = 1,
    } = options;

    const bear = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: muzzleColor, flatShading: true });
    const pawMat = new THREE.MeshStandardMaterial({ color: pawColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true });

    // ===== BODY (big barrel) =====
    const bodyGeom = new THREE.BoxGeometry(2.3, 1.2, 1.3);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 1.0, 0);
    body.castShadow = body.receiveShadow = true;
    bear.add(body);

    // ===== NECK / SHOULDER MASS =====
    const neckGeom = new THREE.BoxGeometry(0.9, 0.8, 0.9);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(0.95, 1.25, 0);
    neck.castShadow = neck.receiveShadow = true;
    bear.add(neck);

    // ===== HEAD =====
    const headGeom = new THREE.BoxGeometry(0.85, 0.6, 0.6);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.55, 1.4, 0);
    head.castShadow = head.receiveShadow = true;
    bear.add(head);

    // ===== MUZZLE =====
    const muzzleGeom = new THREE.BoxGeometry(0.5, 0.35, 0.35);
    const muzzle = new THREE.Mesh(muzzleGeom, muzzleMat);
    muzzle.position.set(0.32, -0.05, 0);
    head.add(muzzle);

    // ===== NOSE =====
    const noseGeom = new THREE.BoxGeometry(0.20, 0.18, 0.18);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.22, 0, 0);
    muzzle.add(nose);

    // ===== EYES =====
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.15, 0.08, 0.20);
    rightEye.position.set(0.15, 0.08, -0.20);
    head.add(leftEye, rightEye);

    // ===== EARS =====
    const earGeom = new THREE.BoxGeometry(0.22, 0.22, 0.14);
    const earInnerGeom = new THREE.BoxGeometry(0.14, 0.14, 0.08);

    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(earInnerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(earInnerGeom, earInnerMat);

    leftEar.position.set(0.0, 0.35, 0.25);
    rightEar.position.set(0.0, 0.35, -0.25);
    leftEar.rotation.z = -0.3;
    rightEar.rotation.z = -0.3;

    leftInner.position.set(0, 0, 0.03);
    rightInner.position.set(0, 0, -0.03);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    head.add(leftEar, rightEar);

    // ===== LEGS (thick bear legs) =====
    const upperLegGeom = new THREE.BoxGeometry(0.35, 0.7, 0.35);
    const lowerLegGeom = new THREE.BoxGeometry(0.30, 0.7, 0.30);
    const pawGeom = new THREE.BoxGeometry(0.40, 0.15, 0.40);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();

        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, coatMat);
        const paw = new THREE.Mesh(pawGeom, pawMat);

        group.position.set(x, 0.8, z);
        upper.position.set(0, -0.35, 0);
        lower.position.set(0, -0.6, 0);
        paw.position.set(0, -0.45, 0);

        group.add(upper);
        upper.add(lower);
        lower.add(paw);

        upper.castShadow = upper.receiveShadow =
            lower.castShadow = lower.receiveShadow =
            paw.castShadow = paw.receiveShadow = true;

        return { group, upper, lower, paw };
    }

    const frontLeft = makeLeg(0.9, 0.45);
    const frontRight = makeLeg(0.9, -0.45);
    const backLeft = makeLeg(-0.9, 0.45);
    const backRight = makeLeg(-0.9, -0.45);

    bear.add(
        frontLeft.group,
        frontRight.group,
        backLeft.group,
        backRight.group
    );

    // ===== TAIL (small, bear nub) =====
    const tailGeom = new THREE.BoxGeometry(0.4, 0.25, 0.25);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.3, 1.2, 0);
    tail.castShadow = tail.receiveShadow = true;
    bear.add(tail);

    // ===== RIG EXPORT =====
    bear.userData.rig = {
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
            backRight,
        },
    };

    bear.scale.set(scale, scale, scale);
    return bear;
}
