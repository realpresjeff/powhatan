export function createCoiledRattlesnakeModel(data, options: {
    bodyColor?: number;
    bellyColor?: number;
    eyeColor?: number;
    rattleColor?: number;
    tongueColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x8b7a4a,     // sandy brown
        bellyColor = 0xb9a777,
        eyeColor = 0x111111,
        rattleColor = 0xd6c7a1,
        tongueColor = 0xb02020,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const rattleMat = new THREE.MeshStandardMaterial({ color: rattleColor, flatShading: true });
    const tongueMat = new THREE.MeshStandardMaterial({ color: tongueColor, flatShading: true });

    const snake = new THREE.Group();

    // ------------------------------------------------------------
    // BODY — circular coil
    // ------------------------------------------------------------
    const segments: THREE.Mesh[] = [];
    const coilTurns = 1.6;          // how many loops
    const segmentCount = 22;
    const radius = 0.9;
    const height = 0.08;

    for (let i = 0; i < segmentCount; i++) {
        const t = i / segmentCount;
        const angle = t * Math.PI * 2 * coilTurns;

        const segRadius = THREE.MathUtils.lerp(0.30, 0.16, t);
        const y = t * height;

        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.18, segRadius),
            bodyMat
        );

        segment.position.set(
            Math.cos(angle) * radius,
            0.20 + y,
            Math.sin(angle) * radius
        );

        // Rotate to follow coil direction
        segment.rotation.y = -angle + Math.PI / 2;
        segment.userData = data;
        snake.add(segment);
        segments.push(segment);

        // Belly
        const belly = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.07, segRadius * 0.9),
            bellyMat
        );
        belly.position.set(0, -0.12, 0);
        segment.add(belly);
    }

    // ------------------------------------------------------------
    // HEAD — centered and raised, facing +X
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.50, 0.22, 0.30),
        bodyMat
    );
    head.position.set(0.0, 0.55, 0.0);
    head.rotation.y = 0; // +X
    snake.add(head);

    // Snout
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.16, 0.22),
        bodyMat
    );
    snout.position.set(0.28, -0.02, 0);
    head.add(snout);

    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.10, 0.08, 0.14);
    eyeR.position.set(0.10, 0.08, -0.14);
    head.add(eyeL, eyeR);

    // Tongue
    const tongue = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 0.03, 0.02),
        tongueMat
    );
    tongue.position.set(0.40, -0.02, 0);
    head.add(tongue);

    // ------------------------------------------------------------
    // RATTLE — stacked segments at tail end
    // ------------------------------------------------------------
    const rattleCount = 4;
    for (let i = 0; i < rattleCount; i++) {
        const r = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.10, 0.16, 8),
            rattleMat
        );
        r.rotation.z = Math.PI / 2;
        r.position.set(
            Math.cos(Math.PI * 2 * coilTurns) * radius - i * 0.14,
            0.22,
            Math.sin(Math.PI * 2 * coilTurns) * radius
        );
        snake.add(r);
    }

    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    snake.scale.set(scale, scale, scale);

    snake.userData = {
        segments,
        head,
    };

    return snake;
}
