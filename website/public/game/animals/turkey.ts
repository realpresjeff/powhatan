export function createTurkeyModel(options: {
    bodyColor?: number;
    featherColor?: number;
    tailTipColor?: number;
    beakColor?: number;
    wattleColor?: number;
    legColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x4b2e1a,      // dark brown
        featherColor = 0x7b4b2a,   // lighter wing feathers
        tailTipColor = 0xd9c3a5,   // white tail tips
        beakColor = 0xf2d056,      // yellow-orange
        wattleColor = 0xc92d39,    // red
        legColor = 0xd9a14b,       // turkey legs
        eyeColor = 0x111111,
        scale = 1
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const featherMat = new THREE.MeshStandardMaterial({ color: featherColor, flatShading: true });
    const tailTipMat = new THREE.MeshStandardMaterial({ color: tailTipColor, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor, flatShading: true });
    const wattleMat = new THREE.MeshStandardMaterial({ color: wattleColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const turkey = new THREE.Group();

    // ============================================================
    // BODY (round, fat turkey body)
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 24, 24),
        bodyMat
    );
    body.position.set(0, 0.75, 0);
    turkey.add(body);

    // Chest puff
    const chest = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 24, 24),
        bodyMat
    );
    chest.position.set(0.2, 0.70, 0.15);
    turkey.add(chest);

    // ============================================================
    // HEAD
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        bodyMat
    );
    head.position.set(0.55, 1.25, 0);
    turkey.add(head);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.04, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.10, 0.06, 0.11);
    rightEye.position.set(0.10, 0.06, -0.11);

    head.add(leftEye, rightEye);

    // Beak
    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.10, 0.25, 8),
        beakMat
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.21, -0.02, 0);
    head.add(beak);

    // Wattle (red dangly thing)
    const wattle = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        wattleMat
    );
    wattle.position.set(0.18, -0.08, 0.05);
    head.add(wattle);

    // ============================================================
    // WINGS (tucked against body)
    // ============================================================
    function makeWing(mirror = 1) {
        const wing = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.6, 0.45),
            featherMat
        );
        wing.position.set(0.0, 0.65, 0.40 * mirror);
        wing.rotation.x = 0.15 * mirror;
        wing.rotation.z = 0.3 * mirror;
        return wing;
    }

    turkey.add(makeWing(1));
    turkey.add(makeWing(-1));

    // ============================================================
    // FAN TAIL (iconic turkey tail)
    // ============================================================
    const tailGroup = new THREE.Group();

    for (let i = -4; i <= 4; i++) {
        const feather = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.90, 0.05),
            i === -4 || i === 4 ? tailTipMat : featherMat
        );

        feather.position.set(0, 0, 0.4);
        feather.rotation.y = (i * Math.PI) / 22;
        feather.position.x = (i * 0.12);

        tailGroup.add(feather);
    }

    tailGroup.position.set(-0.75, 1.00, 0);
    tailGroup.rotation.y = Math.PI / 2;
    turkey.add(tailGroup);

    // ============================================================
    // LEGS
    // ============================================================
    function makeLeg(xOffset) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.10, 0.35, 8),
            legMat
        );
        upper.position.set(0, -0.18, 0);

        const lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.07, 0.25, 8),
            legMat
        );
        lower.position.set(0, -0.30, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.10, 0.30),
            legMat
        );
        foot.position.set(0, -0.15, 0.05);

        leg.add(upper);
        upper.add(lower);
        lower.add(foot);

        leg.position.set(xOffset, 0.40, 0.0);
        return leg;
    }

    turkey.add(makeLeg(0.25));
    turkey.add(makeLeg(-0.25));

    turkey.scale.set(scale, scale, scale);
    return turkey;
}
