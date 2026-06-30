export function createBoarModel(options: {
    bodyColor?: number;
    snoutColor?: number;
    tuskColor?: number;
    hoofColor?: number;
    eyeColor?: number;
    bristleColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x5a3b2e,     // dark brown
        snoutColor = 0x8a6a55,    // lighter snout
        tuskColor = 0xe6e6e6,     // white tusks
        hoofColor = 0x2d2a28,
        eyeColor = 0x111111,
        bristleColor = 0x3b2b20,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const snoutMat = new THREE.MeshStandardMaterial({ color: snoutColor, flatShading: true });
    const tuskMat = new THREE.MeshStandardMaterial({ color: tuskColor, flatShading: true });
    const hoofMat = new THREE.MeshStandardMaterial({ color: hoofColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const bristleMat = new THREE.MeshStandardMaterial({ color: bristleColor, flatShading: true });

    const boar = new THREE.Group();

    // ============================================================
    // BODY — thick boar body
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.70, 20, 20),
        bodyMat
    );
    body.position.set(0, 0.75, 0);
    boar.add(body);

    // Chest bulge
    const chest = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 18, 18),
        bodyMat
    );
    chest.position.set(0.20, 0.70, 0.10);
    boar.add(chest);

    // ============================================================
    // HEAD — boar wedge shape
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.45, 0.45),
        bodyMat
    );
    head.position.set(0.75, 1.00, 0);
    head.rotation.z = 0.1;
    boar.add(head);

    // Snout
    const snout = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.20, 0.45, 12),
        snoutMat
    );
    snout.rotation.z = -Math.PI / 2;
    snout.position.set(0.32, -0.02, 0);
    head.add(snout);

    // Snout tip noseplate
    const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        snoutMat
    );
    nose.position.set(0.22, 0, 0);
    snout.add(nose);

    // Tusks
    function makeTusk(mirror = 1) {
        const tusk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.07, 0.25, 8),
            tuskMat
        );
        tusk.rotation.z = -Math.PI / 2;
        tusk.rotation.y = 0.8 * mirror;
        tusk.position.set(0.10, -0.05, 0.18 * mirror);
        return tusk;
    }
    head.add(makeTusk(1));
    head.add(makeTusk(-1));

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.055, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.12, 0.10, 0.20);
    rightEye.position.set(0.12, 0.10, -0.20);
    head.add(leftEye, rightEye);

    // Ears — pointed boar ears
    function makeEar(mirror = 1) {
        const ear = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.28, 0.12),
            bodyMat
        );
        ear.position.set(0.05, 0.22, 0.20 * mirror);
        ear.rotation.z = -0.3 * mirror;
        return ear;
    }
    head.add(makeEar(1));
    head.add(makeEar(-1));

    // ============================================================
    // BRISTLES — boar ridge along back
    // ============================================================
    const bristle = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.55, 0.25),
        bristleMat
    );
    bristle.position.set(-0.10, 1.05, 0);
    bristle.rotation.x = Math.PI * 0.04;
    boar.add(bristle);

    // ============================================================
    // LEGS — sturdy boar legs
    // ============================================================
    function makeLeg(xOffset: number, zOffset: number) {
        const legGroup = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.45, 0.22),
            bodyMat
        );
        upper.position.set(0, -0.22, 0);

        const hoof = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.20, 0.22),
            hoofMat
        );
        hoof.position.set(0, -0.30, 0);

        legGroup.add(upper);
        upper.add(hoof);

        legGroup.position.set(xOffset, 0.45, zOffset);
        return legGroup;
    }

    boar.add(makeLeg(0.32, 0.18));
    boar.add(makeLeg(0.32, -0.18));
    boar.add(makeLeg(-0.32, 0.18));
    boar.add(makeLeg(-0.32, -0.18));

    // ============================================================
    // TAIL — little curl
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.TorusGeometry(0.10, 0.04, 8, 16),
        bodyMat
    );
    tail.position.set(-0.70, 0.95, 0);
    tail.rotation.x = Math.PI / 2;
    boar.add(tail);

    // ============================================================
    boar.scale.set(scale, scale, scale);
    return boar;
}
