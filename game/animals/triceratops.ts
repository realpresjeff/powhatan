export function createTriceratopsModel(options: {
    bodyColor?: number;
    frillColor?: number;
    hornColor?: number;
    bellyColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x7b8f6a,   // green-brown
        frillColor = 0x8f6b4a,  // darker frill
        hornColor = 0xe8e2d6,   // ivory
        bellyColor = 0x9fb08a,
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const frillMat = new THREE.MeshStandardMaterial({ color: frillColor, flatShading: true });
    const hornMat = new THREE.MeshStandardMaterial({ color: hornColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const tri = new THREE.Group();

    // ------------------------------------------------------------
    // BODY — heavy, low torso
    // ------------------------------------------------------------
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 1.2, 1.4),
        bodyMat
    );
    body.position.set(0, 1.2, 0);
    tri.add(body);

    const belly = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.45, 1.3),
        bellyMat
    );
    belly.position.set(0, -0.35, 0);
    body.add(belly);

    // ------------------------------------------------------------
    // NECK
    // ------------------------------------------------------------
    const neck = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.7, 0.7),
        bodyMat
    );
    neck.position.set(1.7, 1.35, 0);
    tri.add(neck);

    // ------------------------------------------------------------
    // HEAD — big skull
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.6, 0.7),
        bodyMat
    );
    head.position.set(2.3, 1.45, 0);
    tri.add(head);

    // Beak / snout
    const beak = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.30, 0.45),
        bodyMat
    );
    beak.position.set(0.35, -0.05, 0);
    head.add(beak);

    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.07, 0.07, 0.07);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(-0.10, 0.10, 0.30);
    eyeR.position.set(-0.10, 0.10, -0.30);
    head.add(eyeL, eyeR);

    // ------------------------------------------------------------
    // FRILL — large shield behind head
    // ------------------------------------------------------------
    const frill = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 1.0, 1.3),
        frillMat
    );
    frill.position.set(-0.55, 0.10, 0);
    head.add(frill);

    // ------------------------------------------------------------
    // HORNS — three horns (2 brow + 1 nose)
    // ------------------------------------------------------------
    function makeHorn(x: number, y: number, z: number, len: number) {
        const horn = new THREE.Mesh(
            new THREE.CylinderGeometry(0.10, 0.16, len, 10),
            hornMat
        );
        horn.rotation.z = Math.PI / 2;
        horn.position.set(x, y, z);
        return horn;
    }

    // Brow horns
    head.add(makeHorn(0.15, 0.20, 0.30, 0.7));
    head.add(makeHorn(0.15, 0.20, -0.30, 0.7));

    // Nose horn
    head.add(makeHorn(0.45, -0.05, 0.0, 0.45));

    // ------------------------------------------------------------
    // LEGS — thick, powerful
    // ------------------------------------------------------------
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 1.0, 0.55),
            bodyMat
        );
        upper.position.set(0, -0.5, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.28, 0.65),
            bodyMat
        );
        foot.position.set(0, -0.7, 0);

        leg.add(upper);
        upper.add(foot);

        leg.position.set(x, 0.8, z);
        return leg;
    }

    tri.add(makeLeg(1.1, 0.6));
    tri.add(makeLeg(1.1, -0.6));
    tri.add(makeLeg(-1.1, 0.6));
    tri.add(makeLeg(-1.1, -0.6));

    // ------------------------------------------------------------
    // TAIL — short, heavy
    // ------------------------------------------------------------
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.35, 0.35),
        bodyMat
    );
    tail.position.set(-1.8, 1.2, 0);
    tri.add(tail);

    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    tri.scale.set(scale, scale, scale);

    tri.userData = {
        head,
        frill,
    };

    return tri;
}
