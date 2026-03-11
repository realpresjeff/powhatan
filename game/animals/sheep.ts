export function createSheepModel(options: {
    woolColor?: number;
    faceColor?: number;
    legColor?: number;
    eyeColor?: number;
    earInnerColor?: number;
    scale?: number;
} = {}) {
    const {
        woolColor = 0xFFFFFF,     // white wool
        faceColor = 0xD8D0C8,     // light beige face
        legColor = 0x3A2F24,      // dark legs/hooves
        eyeColor = 0x111111,
        earInnerColor = 0xE3C6B2,
        scale = 1,
    } = options;

    const sheep = new THREE.Group();

    const woolMat = new THREE.MeshStandardMaterial({ color: woolColor, flatShading: true });
    const faceMat = new THREE.MeshStandardMaterial({ color: faceColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });

    // ============================================================
    // BODY (round & woolly, multi-layer boxes)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(1.8, 1.3, 1.25);
    const body = new THREE.Mesh(bodyGeom, woolMat);
    body.position.set(0, 0.9, 0);
    sheep.add(body);

    // Additional wool layers to make fluffy shape
    const woolLayer1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 1.05), woolMat);
    woolLayer1.position.set(0, 0, 0);
    body.add(woolLayer1);

    const woolLayer2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.9), woolMat);
    woolLayer2.position.set(0, -0.05, 0);
    body.add(woolLayer2);

    // ============================================================
    // NECK (short & slightly forward)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const neck = new THREE.Mesh(neckGeom, woolMat);
    neck.position.set(0.95, 1.15, 0);
    sheep.add(neck);

    // ============================================================
    // HEAD (blocky with downward nose)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.7, 0.55, 0.55);
    const head = new THREE.Mesh(headGeom, faceMat);
    head.position.set(1.35, 1.15, 0);
    sheep.add(head);

    // Slight muzzle / nose front
    const muzzleGeom = new THREE.BoxGeometry(0.35, 0.25, 0.25);
    const muzzle = new THREE.Mesh(muzzleGeom, faceMat);
    muzzle.position.set(0.35, -0.07, 0);
    head.add(muzzle);

    // Nose tip (optional small black cube)
    const noseGeom = new THREE.BoxGeometry(0.14, 0.12, 0.12);
    const nose = new THREE.Mesh(noseGeom, legMat);
    nose.position.set(0.20, 0, 0);
    muzzle.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.07, 0.07, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.12, 0.03, 0.20);
    rightEye.position.set(0.12, 0.03, -0.20);
    head.add(leftEye, rightEye);

    // ============================================================
    // EARS (small, rounded-ish)
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.22, 0.18, 0.14);
    const earInnerGeom = new THREE.BoxGeometry(0.15, 0.10, 0.07);

    const leftEar = new THREE.Mesh(earGeom, faceMat);
    const rightEar = new THREE.Mesh(earGeom, faceMat);
    const leftInner = new THREE.Mesh(earInnerGeom, earInnerMat);
    const rightInner = new THREE.Mesh(earInnerGeom, earInnerMat);

    leftEar.position.set(0.0, 0.20, 0.22);
    rightEar.position.set(0.0, 0.20, -0.22);

    leftInner.position.set(0, 0, 0.05);
    rightInner.position.set(0, 0, -0.05);

    leftEar.add(leftInner);
    rightEar.add(rightInner);
    head.add(leftEar, rightEar);

    // ============================================================
    // LEGS (short & stubby)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.25, 0.40, 0.25);
    const lowerLegGeom = new THREE.BoxGeometry(0.22, 0.40, 0.22);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, woolMat);
        const lower = new THREE.Mesh(lowerLegGeom, legMat);

        group.position.set(x, 0.5, z);
        upper.position.set(0, -0.20, 0);
        lower.position.set(0, -0.35, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(0.55, 0.25);
    const frontRight = makeLeg(0.55, -0.25);
    const backLeft = makeLeg(-0.55, 0.25);
    const backRight = makeLeg(-0.55, -0.25);

    sheep.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL (tiny sheep tail)
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.30, 0.22, 0.22);
    const tail = new THREE.Mesh(tailGeom, woolMat);
    tail.position.set(-0.95, 0.95, 0);
    sheep.add(tail);

    // ============================================================
    // RIG
    // ============================================================
    sheep.userData.rig = {
        body,
        neck,
        head,
        muzzle,
        tail,
        leftEar,
        rightEar,
        woolLayers: [woolLayer1, woolLayer2],
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight
        }
    };

    sheep.scale.set(scale, scale, scale);
    return sheep;
}
