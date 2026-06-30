export function createRavenModel(options: {
    bodyColor?: number;
    beakColor?: number;
    eyeColor?: number;
    legColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x111111,
        beakColor = 0x0c0c0c,
        eyeColor = 0x222222,
        legColor = 0x1a1a1a,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });

    const raven = new THREE.Group();

    // ============================================================
    // BODY
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 16),
        bodyMat
    );
    body.position.set(0, 0.65, 0);
    raven.add(body);

    const chest = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 16),
        bodyMat
    );
    chest.position.set(0.15, 0.62, 0.12);
    raven.add(chest);

    // ============================================================
    // HEAD
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 16),
        bodyMat
    );
    head.position.set(0.45, 1.03, 0);
    raven.add(head);

    const eyeGeom = new THREE.SphereGeometry(0.035, 5, 5);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.07, 0.03, 0.12);
    rightEye.position.set(0.07, 0.03, -0.12);
    head.add(leftEye, rightEye);

    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.30, 12),
        beakMat
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.22, -0.02, 0);
    head.add(beak);

    const hook = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        beakMat
    );
    hook.position.set(0.10, -0.03, 0);
    beak.add(hook);

    // ============================================================
    // WINGS — refined shape
    // ============================================================
    function makeWing(mirror = 1) {
        const wingGroup = new THREE.Group();

        const shoulder = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.35, 0.30),
            bodyMat
        );
        shoulder.position.set(0.02, 0.72, 0.28 * mirror);
        shoulder.rotation.z = -0.10 * mirror;
        wingGroup.add(shoulder);

        const featherPanel = new THREE.Mesh(
            new THREE.BoxGeometry(0.10, 0.80, 0.06),
            bodyMat
        );
        featherPanel.position.set(-0.10, 0.35, 0);
        featherPanel.rotation.z = -0.25 * mirror;
        shoulder.add(featherPanel);

        return wingGroup;
    }

    raven.add(makeWing(1));
    raven.add(makeWing(-1));

    // ============================================================
    // TAIL
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.60, 0.14),
        bodyMat
    );
    tail.position.set(-0.55, 0.62, 0);
    tail.rotation.x = 0.20;
    raven.add(tail);

    // ============================================================
    // LEGS + FEET — updated spacing & rotation
    // ============================================================
    function makeLeg(xOffset: number, zOffset: number) {
        const legGroup = new THREE.Group();

        // Thigh
        const thigh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045, 0.06, 0.22, 8),
            legMat
        );
        thigh.position.set(0, -0.11, 0);

        // Lower leg
        const lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.20, 8),
            legMat
        );
        lower.position.set(0, -0.18, 0);

        // Foot: pointing forward (+X)
        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.09, 0.18),
            legMat
        );
        foot.position.set(0.14, -0.13, 0);

        legGroup.add(thigh);
        thigh.add(lower);
        lower.add(foot);

        // Updated offsets so BOTH legs show up clearly
        legGroup.position.set(xOffset, 0.42, zOffset);

        return legGroup;
    }

    // Wider spacing so both feet are visible
    raven.add(makeLeg(0.22, 0.11));   // left foot
    raven.add(makeLeg(0.22, -0.11));  // right foot

    // ============================================================
    raven.scale.set(scale, scale, scale);
    return raven;
}
