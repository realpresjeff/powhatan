export function createHawkModel(options: {
    bodyColor?: number;
    wingColor?: number;
    headColor?: number;
    beakColor?: number;
    eyeColor?: number;
    legColor?: number;
    tailColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x6b4a2d,    // reddish brown hawk body
        wingColor = 0x5a3c26,    // darker wings
        headColor = 0xcbbba4,    // pale hawk head
        beakColor = 0xdcc25b,    // yellow beak
        eyeColor = 0x111111,
        legColor = 0xd9a14b,
        tailColor = 0x8b4f29,    // red tail
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, flatShading: true });
    const headMat = new THREE.MeshStandardMaterial({ color: headColor, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const tailMat = new THREE.MeshStandardMaterial({ color: tailColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const hawk = new THREE.Group();

    // ============================================================
    // BODY — leaner than eagle, sleeker profile
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.50, 16, 16),
        bodyMat
    );
    body.position.set(0, 0.75, 0);
    hawk.add(body);

    const chest = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 16, 16),
        bodyMat
    );
    chest.position.set(0.12, 0.68, 0.10);
    hawk.add(chest);

    // ============================================================
    // HEAD — smaller than eagle, sharper than owl
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.30, 16, 16),
        headMat
    );
    head.position.set(0.48, 1.12, 0);
    hawk.add(head);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.045, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.08, 0.02, 0.12);
    rightEye.position.set(0.08, 0.02, -0.12);
    head.add(leftEye, rightEye);

    // Beak — sharp hook
    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.10, 0.28, 12),
        beakMat
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.24, -0.02, 0);
    head.add(beak);

    // Tip hook
    const hook = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        beakMat
    );
    hook.position.set(0.10, -0.03, 0);
    beak.add(hook);

    // ============================================================
    // WINGS — narrower & longer than raven, sleeker than eagle
    // ============================================================
    function makeWing(mirror = 1) {
        const wingGroup = new THREE.Group();

        const shoulder = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.45, 0.34),
            wingMat
        );
        shoulder.position.set(0.02, 0.74, 0.28 * mirror);
        shoulder.rotation.z = -0.18 * mirror;
        wingGroup.add(shoulder);

        const midWing = new THREE.Mesh(
            new THREE.BoxGeometry(0.10, 0.70, 0.10),
            wingMat
        );
        midWing.position.set(-0.10, 0.40, 0);
        midWing.rotation.z = -0.30 * mirror;
        shoulder.add(midWing);

        return wingGroup;
    }

    hawk.add(makeWing(1));
    hawk.add(makeWing(-1));

    // ============================================================
    // TAIL — long steering tail (hawk signature)
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.80, 0.20),
        tailMat
    );
    tail.position.set(-0.60, 0.72, 0);
    tail.rotation.x = 0.22;
    hawk.add(tail);

    // ============================================================
    // LEGS & TALONS
    // ============================================================
    function makeLeg(zOffset: number) {
        const legGroup = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.07, 0.24, 8),
            legMat
        );
        thigh.position.set(0, -0.12, 0);

        const lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045, 0.045, 0.22, 8),
            legMat
        );
        lower.position.set(0, -0.20, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.30, 0.10, 0.20),
            legMat
        );
        foot.position.set(0.15, -0.15, 0);

        legGroup.add(thigh);
        thigh.add(lower);
        lower.add(foot);

        // Perched stance
        legGroup.position.set(0.18, 0.48, zOffset);

        return legGroup;
    }

    hawk.add(makeLeg(0.10));
    hawk.add(makeLeg(-0.10));

    hawk.scale.set(scale, scale, scale);
    return hawk;
}
