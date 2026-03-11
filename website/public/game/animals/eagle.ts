export function createEagleModel(options: {
    bodyColor?: number;
    wingColor?: number;
    headColor?: number;
    beakColor?: number;
    talonColor?: number;
    eyeColor?: number;
    tailColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x4a3728,     // brown body
        wingColor = 0x3b2a1d,     // darker wings
        headColor = 0xffffff,     // white head (bald eagle)
        beakColor = 0xf2d056,     // yellow beak
        talonColor = 0xf2c75c,    // yellow talons
        eyeColor = 0x111111,
        tailColor = 0xffffff,     // white tail feathers
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, flatShading: true });
    const headMat = new THREE.MeshStandardMaterial({ color: headColor, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor, flatShading: true });
    const talonMat = new THREE.MeshStandardMaterial({ color: talonColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const tailMat = new THREE.MeshStandardMaterial({ color: tailColor, flatShading: true });

    const eagle = new THREE.Group();

    // ============================================================
    // BODY — strong eagle chest
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 16, 16),
        bodyMat
    );
    body.position.set(0, 0.8, 0);
    eagle.add(body);

    // ============================================================
    // HEAD
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.33, 16, 16),
        headMat
    );
    head.position.set(0.45, 1.25, 0);
    eagle.add(head);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.045, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.07, 0.03, 0.14);
    rightEye.position.set(0.07, 0.03, -0.14);
    head.add(leftEye, rightEye);

    // Beak
    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.30, 12),
        beakMat
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.24, -0.03, 0);
    head.add(beak);

    // Hook tip
    const hook = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        beakMat
    );
    hook.position.set(0.10, -0.04, 0);
    beak.add(hook);

    // ============================================================
    // WINGS — folded against body
    // ============================================================
    function makeWing(mirror = 1) {
        const wing = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.9, 0.55),
            wingMat
        );
        wing.position.set(0, 0.75, 0.45 * mirror);
        wing.rotation.x = mirror * 0.12;
        wing.rotation.z = mirror * -0.35;
        return wing;
    }

    eagle.add(makeWing(1));
    eagle.add(makeWing(-1));

    // ============================================================
    // TAIL FEATHERS
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.30, 0.50, 0.15),
        tailMat
    );
    tail.position.set(-0.55, 0.68, 0);
    tail.rotation.x = 0.25;
    eagle.add(tail);

    // ============================================================
    // LEGS + TALONS
    // ============================================================
    function makeLeg(xOffset) {
        const legGroup = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.12, 0.25, 8),
            talonMat
        );
        thigh.position.set(0, -0.12, 0);

        const lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.07, 0.28, 8),
            talonMat
        );
        lower.position.set(0, -0.22, 0);

        const talon = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.10, 0.30),
            talonMat
        );
        talon.position.set(0, -0.16, 0.10);

        legGroup.add(thigh);
        thigh.add(lower);
        lower.add(talon);

        legGroup.position.set(xOffset, 0.55, 0);
        return legGroup;
    }

    eagle.add(makeLeg(0.18));
    eagle.add(makeLeg(-0.18));

    eagle.scale.set(scale, scale, scale);
    return eagle;
}
