export function createTyrannosaurusModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    eyeColor?: number;
    toothColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x6b7a4b,   // olive green
        bellyColor = 0x9aa56a,
        eyeColor = 0x111111,
        toothColor = 0xffffff,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const toothMat = new THREE.MeshStandardMaterial({ color: toothColor, flatShading: true });

    const trex = new THREE.Group();

    // ------------------------------------------------------------
    // TORSO — massive, forward-leaning body
    // ------------------------------------------------------------
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.1, 0.9),
        bodyMat
    );
    torso.position.set(0, 1.4, 0);
    trex.add(torso);

    // Belly
    const belly = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.45, 0.8),
        bellyMat
    );
    belly.position.set(0, -0.35, 0);
    torso.add(belly);

    // ------------------------------------------------------------
    // NECK
    // ------------------------------------------------------------
    const neck = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.7, 0.6),
        bodyMat
    );
    neck.position.set(1.25, 1.8, 0);
    trex.add(neck);

    // ------------------------------------------------------------
    // HEAD — big T-rex skull
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.6, 0.6),
        bodyMat
    );
    head.position.set(1.95, 2.0, 0);
    trex.add(head);

    // Upper jaw
    const upperJaw = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.25, 0.5),
        bodyMat
    );
    upperJaw.position.set(0.35, 0.05, 0);
    head.add(upperJaw);

    // Lower jaw (can animate this)
    const lowerJaw = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.18, 0.45),
        bodyMat
    );
    lowerJaw.position.set(0.35, -0.22, 0);
    head.add(lowerJaw);

    // Teeth (simple blocks)
    function makeTooth(x: number, z: number) {
        const t = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.14, 0.06),
            toothMat
        );
        t.position.set(x, -0.06, z);
        return t;
    }

    upperJaw.add(makeTooth(0.15, 0.20));
    upperJaw.add(makeTooth(0.30, -0.20));
    upperJaw.add(makeTooth(0.45, 0.18));

    // Eyes — small, predatory
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(-0.10, 0.15, 0.28);
    eyeR.position.set(-0.10, 0.15, -0.28);
    head.add(eyeL, eyeR);

    // ------------------------------------------------------------
    // ARMS — tiny (iconic T-rex)
    // ------------------------------------------------------------
    function makeArm(side: 1 | -1) {
        const arm = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.35, 0.20),
            bodyMat
        );
        upper.position.set(0, -0.18, 0);

        const hand = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.18, 0.28),
            bodyMat
        );
        hand.position.set(0, -0.22, 0);
        upper.add(hand);

        arm.add(upper);
        arm.position.set(0.9, 1.5, 0.35 * side);
        arm.rotation.z = side * 0.25;
        return arm;
    }

    trex.add(makeArm(1));
    trex.add(makeArm(-1));

    // ------------------------------------------------------------
    // LEGS — huge, powerful
    // ------------------------------------------------------------
    function makeLeg(side: 1 | -1) {
        const leg = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.2, 0.6),
            bodyMat
        );
        thigh.position.set(0, -0.6, 0);

        const shin = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1.1, 0.5),
            bodyMat
        );
        shin.position.set(0, -0.9, -0.05);
        thigh.add(shin);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.25, 0.6),
            bodyMat
        );
        foot.position.set(0.15, -0.65, 0);
        shin.add(foot);

        leg.add(thigh);
        leg.position.set(-0.4, 0.7, 0.45 * side);
        return leg;
    }

    trex.add(makeLeg(1));
    trex.add(makeLeg(-1));

    // ------------------------------------------------------------
    // TAIL — long counterbalance
    // ------------------------------------------------------------
    const tailSegments: THREE.Mesh[] = [];
    const tailCount = 6;

    for (let i = 0; i < tailCount; i++) {
        const t = i / (tailCount - 1);
        const seg = new THREE.Mesh(
            new THREE.BoxGeometry(
                THREE.MathUtils.lerp(1.0, 0.3, t),
                THREE.MathUtils.lerp(0.6, 0.25, t),
                THREE.MathUtils.lerp(0.6, 0.25, t)
            ),
            bodyMat
        );

        seg.position.set(
            -1.4 - i * 0.6,
            1.3 - i * 0.05,
            0
        );

        trex.add(seg);
        tailSegments.push(seg);
    }

    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    trex.scale.set(scale, scale, scale);

    // Expose animatable parts
    trex.userData = {
        lowerJaw,
        tailSegments,
    };

    return trex;
}
