export function createGoatModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    headColor?: number;
    hornColor?: number;
    eyeColor?: number;
    hoofColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0xcabfaa,     // light brown/tan goat
        bellyColor = 0xdfd7c9,
        headColor = 0xc3b59a,
        hornColor = 0x6d6a63,
        eyeColor = 0x111111,
        hoofColor = 0x3d3a38,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const headMat = new THREE.MeshStandardMaterial({ color: headColor, flatShading: true });
    const hornMat = new THREE.MeshStandardMaterial({ color: hornColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const hoofMat = new THREE.MeshStandardMaterial({ color: hoofColor, flatShading: true });

    const goat = new THREE.Group();

    // ============================================================
    // BODY — barrel-shaped goat body
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 18, 18),
        bodyMat
    );
    body.position.set(0, 0.80, 0);
    goat.add(body);

    // Belly
    const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 18, 18),
        bellyMat
    );
    belly.scale.set(1, 0.6, 1);
    belly.position.set(0, 0.60, 0.10);
    goat.add(belly);

    // ============================================================
    // HEAD
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.40, 16, 16),
        headMat
    );
    head.position.set(0.75, 1.15, 0);
    goat.add(head);

    // Snout
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.25, 0.30),
        headMat
    );
    snout.position.set(0.30, -0.05, 0);
    head.add(snout);

    // Nose
    const nose = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 0.14),
        hoofMat
    );
    nose.position.set(0.20, -0.03, 0);
    snout.add(nose);

    // Beard
    const beard = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.30, 0.12),
        headMat
    );
    beard.position.set(0.05, -0.22, 0);
    snout.add(beard);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.055, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.10, 0.10, 0.18);
    rightEye.position.set(0.10, 0.10, -0.18);
    head.add(leftEye, rightEye);

    // ============================================================
    // HORNS — curled backward
    // ============================================================
    function makeHorn(mirror = 1) {
        const horn = new THREE.Mesh(
            new THREE.CylinderGeometry(0.10, 0.12, 0.45, 8),
            hornMat
        );
        horn.rotation.z = Math.PI / 2;
        horn.rotation.y = 0.4 * mirror;
        horn.position.set(0.00, 0.22, 0.22 * mirror);

        const curve = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.10, 0.40, 8),
            hornMat
        );
        curve.position.set(0.22, 0, 0);
        curve.rotation.z = 0.6;

        horn.add(curve);
        return horn;
    }

    head.add(makeHorn(1));
    head.add(makeHorn(-1));

    // ============================================================
    // LEGS — goat legs with angled hind legs
    // ============================================================
    function makeFrontLeg(zOffset: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.45, 0.18),
            bodyMat
        );
        upper.position.set(0, -0.22, 0);

        const hoof = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.15, 0.20),
            hoofMat
        );
        hoof.position.set(0, -0.30, 0);

        leg.add(upper);
        upper.add(hoof);

        leg.position.set(0.30, 0.50, zOffset);
        return leg;
    }

    function makeBackLeg(zOffset: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.45, 0.20),
            bodyMat
        );
        upper.position.set(0, -0.22, 0);
        upper.rotation.x = 0.25; // angled backwards

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.40, 0.16),
            bodyMat
        );
        lower.position.set(0, -0.32, -0.05);

        const hoof = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.15, 0.20),
            hoofMat
        );
        hoof.position.set(0, -0.25, 0.03);

        leg.add(upper);
        upper.add(lower);
        lower.add(hoof);

        leg.position.set(-0.30, 0.52, zOffset);
        return leg;
    }

    goat.add(makeFrontLeg(0.18));
    goat.add(makeFrontLeg(-0.18));
    goat.add(makeBackLeg(0.18));
    goat.add(makeBackLeg(-0.18));

    // ============================================================
    goat.scale.set(scale, scale, scale);
    return goat;
}
