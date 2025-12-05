export function createBuffaloModel(options: {
    frontCoatColor?: number;
    rearCoatColor?: number;
    muzzleColor?: number;
    hornColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {
    const {
        frontCoatColor = 0x4B3523,   // dark front fur
        rearCoatColor = 0x7A5A39,    // lighter back fur
        muzzleColor = 0x2B1C14,
        hornColor = 0xD8D0C8,
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const buffalo = new THREE.Group();

    const frontMat = new THREE.MeshStandardMaterial({ color: frontCoatColor, flatShading: true });
    const rearMat = new THREE.MeshStandardMaterial({ color: rearCoatColor, flatShading: true });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: muzzleColor, flatShading: true });
    const hornMat = new THREE.MeshStandardMaterial({ color: hornColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });

    // ============================================================
    // BODY (shorter back end; huge front shoulder mass)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(2.8, 1.4, 1.4);
    const body = new THREE.Mesh(bodyGeom, rearMat);
    body.position.set(0, 1.2, 0);
    buffalo.add(body);

    // Front Shoulder MASS / HUMP (defining feature)
    const humpGeom = new THREE.BoxGeometry(2.0, 1.7, 1.6);
    const hump = new THREE.Mesh(humpGeom, frontMat);
    hump.position.set(0.6, 1.4, 0);
    buffalo.add(hump);

    // Chest extension
    const chestGeom = new THREE.BoxGeometry(1.6, 1.0, 1.3);
    const chest = new THREE.Mesh(chestGeom, frontMat);
    chest.position.set(1.1, 1.0, 0);
    buffalo.add(chest);

    // ============================================================
    // NECK (very thick, blends into hump)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.9, 1.1, 0.9);
    const neck = new THREE.Mesh(neckGeom, frontMat);
    neck.position.set(1.6, 1.75, 0);
    neck.rotation.z = -0.25;
    buffalo.add(neck);

    // ============================================================
    // HEAD (large and shaggy)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.9, 0.8, 0.8);
    const head = new THREE.Mesh(headGeom, frontMat);
    head.position.set(2.2, 2.05, 0);
    buffalo.add(head);

    // Muzzle (big, square)
    const muzzleGeom = new THREE.BoxGeometry(0.55, 0.45, 0.45);
    const muzzle = new THREE.Mesh(muzzleGeom, muzzleMat);
    muzzle.position.set(0.55, -0.05, 0);
    head.add(muzzle);

    // Nose tip
    const noseGeom = new THREE.BoxGeometry(0.20, 0.20, 0.20);
    const nose = new THREE.Mesh(noseGeom, muzzleMat);
    nose.position.set(0.28, 0, 0);
    muzzle.add(nose);

    // Beard / chin fur
    const beardGeom = new THREE.BoxGeometry(0.3, 0.5, 0.3);
    const beard = new THREE.Mesh(beardGeom, frontMat);
    beard.position.set(0.10, -0.45, 0);
    head.add(beard);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.10, 0.10, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.05, 0.10, 0.26);
    rightEye.position.set(0.05, 0.10, -0.26);
    head.add(leftEye, rightEye);

    // ============================================================
    // HORNS (short, curved)
    // ============================================================
    const hornGeom = new THREE.BoxGeometry(0.32, 0.20, 0.20);

    function createHorn(isLeft: boolean) {
        const horn = new THREE.Mesh(hornGeom, hornMat);
        horn.position.set(0, 0.28, isLeft ? 0.32 : -0.32);
        horn.rotation.y = isLeft ? 0.5 : -0.5;
        horn.rotation.z = -0.3;
        return horn;
    }

    const leftHorn = createHorn(true);
    const rightHorn = createHorn(false);
    head.add(leftHorn, rightHorn);

    // ============================================================
    // LEGS (strong, thick front legs → thinner rear legs)
    // ============================================================
    const upperFrontLegGeom = new THREE.BoxGeometry(0.35, 0.85, 0.35);
    const lowerFrontLegGeom = new THREE.BoxGeometry(0.32, 0.85, 0.32);

    const upperRearLegGeom = new THREE.BoxGeometry(0.30, 0.80, 0.30);
    const lowerRearLegGeom = new THREE.BoxGeometry(0.26, 0.80, 0.26);

    function makeLeg(x: number, z: number, front: boolean) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(front ? upperFrontLegGeom : upperRearLegGeom, frontMat);
        const lower = new THREE.Mesh(front ? lowerFrontLegGeom : lowerRearLegGeom, frontMat);

        group.position.set(x, 0.45, z);
        upper.position.set(0, -0.45, 0);
        lower.position.set(0, -0.75, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(1.1, 0.45, true);
    const frontRight = makeLeg(1.1, -0.45, true);
    const backLeft = makeLeg(-1.0, 0.45, false);
    const backRight = makeLeg(-1.0, -0.45, false);

    buffalo.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.30, 0.40, 0.30);
    const tail = new THREE.Mesh(tailGeom, rearMat);
    tail.position.set(-1.4, 1.25, 0);
    buffalo.add(tail);

    const tuftGeom = new THREE.BoxGeometry(0.35, 0.25, 0.35);
    const tuft = new THREE.Mesh(tuftGeom, muzzleMat);
    tuft.position.set(0, -0.32, 0);
    tail.add(tuft);

    // ============================================================
    // RIG EXPORT
    // ============================================================
    buffalo.userData.rig = {
        body,
        hump,
        chest,
        neck,
        head,
        muzzle,
        nose,
        beard,
        horns: { leftHorn, rightHorn },
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight,
        },
        tail,
    };

    buffalo.scale.set(scale, scale, scale);
    return buffalo;
}
