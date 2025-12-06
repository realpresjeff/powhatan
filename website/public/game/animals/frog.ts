export function createFrogModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    eyeColor?: number;
    toeColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x4b8f3a,
        bellyColor = 0xa8d08d,
        eyeColor = 0x111111,
        toeColor = 0x333333,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const toeMat = new THREE.MeshStandardMaterial({ color: toeColor, flatShading: true });

    const frog = new THREE.Group();

    // ============================================================
    // BODY — sphere-based frog belly
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 18, 18),
        bodyMat
    );
    body.position.set(0, 0.65, 0);
    frog.add(body);

    // Belly underside
    const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 18, 18),
        bellyMat
    );
    belly.scale.set(1.0, 0.6, 1.0); // flattened
    belly.position.set(0, -0.15, 0);
    body.add(belly);

    // ============================================================
    // HEAD — frog bulbous head
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 18, 18),
        bodyMat
    );
    head.position.set(0.25, 1.05, 0);
    frog.add(head);

    // Mouth line
    const mouth = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.08, 0.85),
        toeMat
    );
    mouth.position.set(0, -0.18, 0);
    head.add(mouth);

    // Eyes (bulging spheres)
    const eye = new THREE.SphereGeometry(0.18, 10, 10);
    const eyeL = new THREE.Mesh(eye, eyeMat);
    const eyeR = new THREE.Mesh(eye, eyeMat);
    eyeL.position.set(0.20, 0.18, 0.32);
    eyeR.position.set(0.20, 0.18, -0.32);
    head.add(eyeL, eyeR);

    // ============================================================
    // FRONT LEGS
    // ============================================================
    function makeFrontLeg(zOffset: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.30, 0.25),
            bodyMat
        );
        upper.position.set(0, -0.20, 0);

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.25, 0.22),
            bodyMat
        );
        lower.position.set(0, -0.25, 0.02);

        const toes = new THREE.Mesh(
            new THREE.BoxGeometry(0.40, 0.10, 0.40),
            toeMat
        );
        toes.position.set(0, -0.18, 0);

        leg.add(upper);
        upper.add(lower);
        lower.add(toes);

        leg.position.set(0.45, 0.45, zOffset);
        return leg;
    }

    frog.add(makeFrontLeg(0.35));
    frog.add(makeFrontLeg(-0.35));

    // ============================================================
    // BACK LEGS — powerful frog jump legs
    // ============================================================
    function makeBackLeg(zOffset: number) {
        const leg = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.50, 0.45),
            bodyMat
        );
        thigh.position.set(0, -0.30, 0);
        thigh.rotation.x = 0.35;

        const calf = new THREE.Mesh(
            new THREE.BoxGeometry(0.40, 0.45, 0.40),
            bodyMat
        );
        calf.position.set(0, -0.42, -0.05);

        const toes = new THREE.Mesh(
            new THREE.BoxGeometry(0.70, 0.12, 0.70),
            toeMat
        );
        toes.position.set(0, -0.28, 0.05);

        leg.add(thigh);
        thigh.add(calf);
        calf.add(toes);

        leg.position.set(-0.55, 0.55, zOffset);
        return leg;
    }

    frog.add(makeBackLeg(0.35));
    frog.add(makeBackLeg(-0.35));

    // ============================================================
    frog.scale.set(scale, scale, scale);
    return frog;
}
