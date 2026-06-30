export function createFoxModel(options: {
    coatColor?: number;
    whiteColor?: number;
    legColor?: number;
    eyeColor?: number;
    earInnerColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0xD35400,      // fox orange
        whiteColor = 0xF2F2F2,     // underbelly & snout
        legColor = 0x2B1A12,       // dark brown/black legs
        eyeColor = 0x111111,
        earInnerColor = 0xF2D4C8,
        scale = 1,
    } = options;

    const fox = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const whiteMat = new THREE.MeshStandardMaterial({ color: whiteColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x000000, flatShading: true });

    // ===== BODY (long & thin compared to bear) =====
    const bodyGeom = new THREE.BoxGeometry(2.6, 0.6, 0.7);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 0.6, 0);
    fox.add(body);

    // ===== UNDERBELLY =====
    const bellyGeom = new THREE.BoxGeometry(2.4, 0.3, 0.55);
    const belly = new THREE.Mesh(bellyGeom, whiteMat);
    belly.position.set(0, -0.15, 0);
    body.add(belly);

    // ===== NECK (thin fox neck) =====
    const neckGeom = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(1.0, 0.9, 0);
    neck.rotation.z = -0.20;
    fox.add(neck);

    // ===== HEAD (long triangle-ish box shape) =====
    const headGeom = new THREE.BoxGeometry(0.75, 0.45, 0.45);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.45, 1.05, 0);
    fox.add(head);

    // ===== MUZZLE (longer than bear, fox shape) =====
    const muzzleGeom = new THREE.BoxGeometry(0.55, 0.28, 0.28);
    const muzzle = new THREE.Mesh(muzzleGeom, whiteMat);
    muzzle.position.set(0.45, -0.05, 0);
    head.add(muzzle);

    // ===== NOSE (small black cube) =====
    const noseGeom = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.30, 0, 0);
    muzzle.add(nose);

    // ===== EYES =====
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.12, 0.05, 0.18);
    rightEye.position.set(0.12, 0.05, -0.18);
    head.add(leftEye, rightEye);

    // ===== EARS (triangular fox ears) =====
    const earGeom = new THREE.BoxGeometry(0.25, 0.35, 0.18);
    const earInnerGeom = new THREE.BoxGeometry(0.18, 0.25, 0.10);

    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);
    const leftInner = new THREE.Mesh(earInnerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(earInnerGeom, earInnerMat);

    leftEar.position.set(0.05, 0.32, 0.22);
    rightEar.position.set(0.05, 0.32, -0.22);

    leftEar.rotation.z = -0.35;
    rightEar.rotation.z = -0.35;

    leftInner.position.set(0, 0, 0.05);
    rightInner.position.set(0, 0, -0.05);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    head.add(leftEar, rightEar);

    // ===== LEGS (thin fox legs) =====
    const upperLegGeom = new THREE.BoxGeometry(0.20, 0.50, 0.22);
    const lowerLegGeom = new THREE.BoxGeometry(0.18, 0.50, 0.18);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();

        const upper = new THREE.Mesh(upperLegGeom, coatMat);
        const lower = new THREE.Mesh(lowerLegGeom, legMat);

        group.position.set(x, 0.4, z);
        upper.position.set(0, -0.25, 0);
        lower.position.set(0, -0.40, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(0.70, 0.22);
    const frontRight = makeLeg(0.70, -0.22);
    const backLeft = makeLeg(-0.70, 0.22);
    const backRight = makeLeg(-0.70, -0.22);

    fox.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ===== FOX TAIL (big bushy signature tail) =====
    const tailGeom = new THREE.BoxGeometry(1.4, 0.30, 0.30);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.4, 0.85, 0);
    tail.rotation.z = 0.35;
    fox.add(tail);

    // white tip
    const tailTipGeom = new THREE.BoxGeometry(0.45, 0.25, 0.25);
    const tailTip = new THREE.Mesh(tailTipGeom, whiteMat);
    tailTip.position.set(-0.45, 0, 0);
    tail.add(tailTip);

    // ===== RIG EXPORT =====
    fox.userData.rig = {
        body,
        neck,
        head,
        muzzle,
        tail,
        leftEar,
        rightEar,
        legs: { frontLeft, frontRight, backLeft, backRight }
    };

    fox.scale.set(scale, scale, scale);
    return fox;
}
