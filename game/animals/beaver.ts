export function createBeaverModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    toothColor?: number;
    eyeColor?: number;
    tailColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x6b4a32,   // beaver brown
        bellyColor = 0x8d6b50,
        toothColor = 0xffffff,
        eyeColor = 0x111111,
        tailColor = 0x3a2e23,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const toothMat = new THREE.MeshStandardMaterial({ color: toothColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const tailMat = new THREE.MeshStandardMaterial({ color: tailColor, flatShading: true });

    const beaver = new THREE.Group();

    // ============================================================
    // BODY — chubby beaver body (box-based)
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.75, 0.80),
        bodyMat
    );
    body.position.set(0, 0.85, 0);
    beaver.add(body);

    // Belly patch
    const belly = new THREE.Mesh(
        new THREE.BoxGeometry(0.90, 0.40, 0.75),
        bellyMat
    );
    belly.position.set(0, -0.15, 0);
    body.add(belly);

    // ============================================================
    // HEAD — box + cheek spheres (rounded but stylized)
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.70, 0.55, 0.60),
        bodyMat
    );
    head.position.set(0.70, 1.10, 0);
    beaver.add(head);

    // Cheeks (optional roundness)
    const cheekGeom = new THREE.SphereGeometry(0.22, 12, 12);
    const cheekL = new THREE.Mesh(cheekGeom, bodyMat);
    const cheekR = new THREE.Mesh(cheekGeom, bodyMat);
    cheekL.position.set(0.18, -0.10, 0.24);
    cheekR.position.set(0.18, -0.10, -0.24);
    head.add(cheekL, cheekR);

    // ============================================================
    // MUZZLE + BEAVER TEETH
    // ============================================================
    const muzzle = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.25, 0.40),
        bellyMat
    );
    muzzle.position.set(0.40, -0.05, 0);
    head.add(muzzle);

    // Teeth (large beaver incisors)
    const toothGeom = new THREE.BoxGeometry(0.12, 0.30, 0.12);
    const toothL = new THREE.Mesh(toothGeom, toothMat);
    const toothR = new THREE.Mesh(toothGeom, toothMat);
    toothL.position.set(0.10, -0.15, 0.08);
    toothR.position.set(0.10, -0.15, -0.08);
    muzzle.add(toothL, toothR);

    // ============================================================
    // EYES
    // ============================================================
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.10, 0.10), eyeMat);
    const eyeR = eyeL.clone();
    eyeL.position.set(0.05, 0.10, 0.25);
    eyeR.position.set(0.05, 0.10, -0.25);
    head.add(eyeL, eyeR);

    // EARS
    function makeEar(mirror = 1) {
        const ear = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.20, 0.20),
            bodyMat
        );
        ear.position.set(-0.15, 0.25, 0.20 * mirror);
        return ear;
    }
    head.add(makeEar(1));
    head.add(makeEar(-1));

    // ============================================================
    // LEGS — small beaver legs
    // ============================================================
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.30, 0.35, 0.30),
            bodyMat
        );
        upper.position.set(0, -0.18, 0);

        const paw = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.15, 0.32),
            bellyMat
        );
        paw.position.set(0, -0.20, 0);

        leg.add(upper);
        upper.add(paw);

        leg.position.set(x, 0.55, z);
        return leg;
    }

    beaver.add(makeLeg(0.30, 0.25));
    beaver.add(makeLeg(0.30, -0.25));
    beaver.add(makeLeg(-0.30, 0.25));
    beaver.add(makeLeg(-0.30, -0.25));

    // ============================================================
    // TAIL — flat paddle tail
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.50, 0.15, 1.10),
        tailMat
    );
    tail.position.set(-1.00, 0.65, 0);
    tail.rotation.x = 0.25;
    beaver.add(tail);

    // ============================================================
    beaver.scale.set(scale, scale, scale);
    return beaver;
}
