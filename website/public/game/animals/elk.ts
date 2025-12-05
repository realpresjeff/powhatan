export function createElkModel(options: {
    coatColor?: number;
    maneColor?: number;
    muzzleColor?: number;
    antlerColor?: number;
    eyeColor?: number;
    scale?: number;
    bull?: boolean; // female has no antlers
} = {}) {
    const {
        coatColor = 0xC8A878,     // tan-brown elk body
        maneColor = 0x6A4A2A,     // darker neck mane
        muzzleColor = 0xE0C8A0,   // lighter elk snout
        antlerColor = 0xD8C5A2,   // pale tan antlers
        eyeColor = 0x111111,
        scale = 1,
        bull = true,
    } = options;

    const elk = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const maneMat = new THREE.MeshStandardMaterial({ color: maneColor, flatShading: true });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: muzzleColor, flatShading: true });
    const antlerMat = new THREE.MeshStandardMaterial({ color: antlerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });

    // ============================================================
    // BODY (smaller than moose, bigger than deer)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(3.0, 1.3, 1.1);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 1.25, 0);
    elk.add(body);

    // Chest depth
    const chestGeom = new THREE.BoxGeometry(1.6, 0.7, 1.0);
    const chest = new THREE.Mesh(chestGeom, coatMat);
    chest.position.set(0.7, -0.1, 0);
    body.add(chest);

    // ============================================================
    // NECK (long & thick)
    // ============================================================
    const neckGeom = new THREE.BoxGeometry(0.7, 0.9, 0.7);
    const neck = new THREE.Mesh(neckGeom, maneMat);
    neck.position.set(1.5, 1.8, 0);
    neck.rotation.z = -0.25;
    elk.add(neck);

    // Slight mane block
    const maneGeom = new THREE.BoxGeometry(0.65, 0.6, 0.65);
    const mane = new THREE.Mesh(maneGeom, maneMat);
    mane.position.set(0, -0.4, 0);
    neck.add(mane);

    // ============================================================
    // HEAD (long elk face)
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.9, 0.5, 0.55);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(2.1, 2.1, 0);
    elk.add(head);

    // MUZZLE (longer than deer)
    const muzzleGeom = new THREE.BoxGeometry(0.55, 0.32, 0.32);
    const muzzle = new THREE.Mesh(muzzleGeom, muzzleMat);
    muzzle.position.set(0.55, -0.05, 0);
    head.add(muzzle);

    const noseGeom = new THREE.BoxGeometry(0.20, 0.16, 0.16);
    const nose = new THREE.Mesh(noseGeom, coatMat);
    nose.position.set(0.30, 0, 0);
    muzzle.add(nose);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.10, 0.10, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.10, 0.05, 0.22);
    rightEye.position.set(0.10, 0.05, -0.22);
    head.add(leftEye, rightEye);

    // ============================================================
    // EARS
    // ============================================================
    const earGeom = new THREE.BoxGeometry(0.35, 0.45, 0.18);
    const leftEar = new THREE.Mesh(earGeom, coatMat);
    const rightEar = new THREE.Mesh(earGeom, coatMat);

    leftEar.position.set(-0.05, 0.30, 0.28);
    rightEar.position.set(-0.05, 0.30, -0.28);

    leftEar.rotation.z = -0.25;
    rightEar.rotation.z = -0.25;

    head.add(leftEar, rightEar);

    // ============================================================
    // ANTLERS (bull only — branch-like, not palmate)
    // ============================================================
    function createElkAntler(isLeft: boolean) {
        const root = new THREE.Group();

        const base = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), antlerMat);
        base.position.set(0, 0.25, 0);
        root.add(base);

        // main beam
        const beam = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 0.15), antlerMat);
        beam.position.set(isLeft ? -0.5 : 0.5, 0.2, 0);
        beam.rotation.y = isLeft ? 0.6 : -0.6;
        root.add(beam);

        // tines
        function addTine(x: number, y: number, z: number, length = 0.45) {
            const t = new THREE.Mesh(
                new THREE.BoxGeometry(length, 0.12, 0.12),
                antlerMat
            );
            t.position.set(x, y, z);
            t.rotation.z = 0.4;
            beam.add(t);
        }

        addTine(0.3, 0.25, 0.15);
        addTine(0.0, 0.35, -0.15);
        addTine(-0.3, 0.45, 0.10);

        return root;
    }

    let leftAntler = null;
    let rightAntler = null;

    if (bull) {
        leftAntler = createElkAntler(true);
        rightAntler = createElkAntler(false);

        leftAntler.position.set(0, 0.35, 0.30);
        rightAntler.position.set(0, 0.35, -0.30);

        head.add(leftAntler, rightAntler);
    }

    // ============================================================
    // LEGS (long & strong)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.30, 0.85, 0.30);
    const lowerLegGeom = new THREE.BoxGeometry(0.26, 0.85, 0.26);

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

    const frontLeft = makeLeg(1.05, 0.30);
    const frontRight = makeLeg(1.05, -0.30);
    const backLeft = makeLeg(-1.05, 0.30);
    const backRight = makeLeg(-1.05, -0.30);

    elk.add(frontLeft.group, frontRight.group, backLeft.group, backRight.group);

    // ============================================================
    // TAIL
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.35, 0.25, 0.25);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.6, 1.3, 0);
    elk.add(tail);

    // ============================================================
    // RIG EXPORT
    // ============================================================
    elk.userData.rig = {
        body,
        chest,
        neck,
        mane,
        head,
        muzzle,
        ears: { leftEar, rightEar },
        antlers: bull ? { leftAntler, rightAntler } : null,
        legs: { frontLeft, frontRight, backLeft, backRight },
        tail
    };

    elk.scale.set(scale, scale, scale);
    return elk;
}
