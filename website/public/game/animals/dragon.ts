export function createDragonModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    wingColor?: number;
    hornColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x4a2f2f,   // dark red/brown dragon scales
        bellyColor = 0x8b5a4a,  // lighter underside
        wingColor = 0x3b1f1f,
        hornColor = 0xf0e6d2,
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, flatShading: true });
    const hornMat = new THREE.MeshStandardMaterial({ color: hornColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const dragon = new THREE.Group();

    // ============================================================
    // BODY — long dragon torso
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.70, 0.75),
        bodyMat
    );
    body.position.set(0, 1.1, 0);
    dragon.add(body);

    // Belly plates
    const belly = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.30, 0.70),
        bellyMat
    );
    belly.position.set(0, -0.25, 0);
    body.add(belly);

    // ============================================================
    // NECK — long box neck
    // ============================================================
    const neck = new THREE.Mesh(
        new THREE.BoxGeometry(0.40, 1.10, 0.45),
        bodyMat
    );
    neck.position.set(1.0, 1.65, 0);
    neck.rotation.z = -0.45;
    dragon.add(neck);

    // ============================================================
    // HEAD — box-shaped dragon head
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.45, 0.45),
        bodyMat
    );
    head.position.set(1.55, 1.95, 0);
    head.rotation.z = -0.10;
    dragon.add(head);

    // SNOUT
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.32, 0.40),
        bodyMat
    );
    snout.position.set(0.45, -0.02, 0);
    head.add(snout);

    // TEETH
    function makeFang(offsetZ: number) {
        const fang = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.20, 0.12),
            hornMat
        );
        fang.position.set(0.20, -0.18, offsetZ);
        return fang;
    }
    snout.add(makeFang(0.12));
    snout.add(makeFang(-0.12));

    // EYES (small spheres)
    const eyeGeom = new THREE.SphereGeometry(0.10, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.10, 0.10, 0.22);
    eyeR.position.set(0.10, 0.10, -0.22);
    head.add(eyeL, eyeR);

    // HORNS
    const hornGeom = new THREE.BoxGeometry(0.10, 0.40, 0.10);
    const hornL = new THREE.Mesh(hornGeom, hornMat);
    const hornR = new THREE.Mesh(hornGeom, hornMat);
    hornL.position.set(-0.25, 0.20, 0.18);
    hornR.position.set(-0.25, 0.20, -0.18);
    hornL.rotation.z = 0.40;
    hornR.rotation.z = 0.40;
    head.add(hornL, hornR);

    // BACK SPIKES
    function makeSpike(x: number, y: number, z: number) {
        const spike = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.40, 0.22),
            hornMat
        );
        spike.position.set(x, y, z);
        return spike;
    }
    body.add(makeSpike(-0.40, 0.45, 0));
    body.add(makeSpike(0.00, 0.48, 0));
    body.add(makeSpike(0.40, 0.45, 0));

    // ============================================================
    // LEGS — thicker than crocodile
    // ============================================================
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.30, 0.50, 0.30),
            bodyMat
        );
        upper.position.set(0, -0.25, 0);

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.45, 0.25),
            bodyMat
        );
        lower.position.set(0, -0.40, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.20, 0.35),
            bellyMat
        );
        foot.position.set(0, -0.25, 0);

        leg.add(upper);
        upper.add(lower);
        lower.add(foot);

        leg.position.set(x, 0.70, z);
        return leg;
    }

    dragon.add(makeLeg(0.70, 0.35));
    dragon.add(makeLeg(0.70, -0.35));
    dragon.add(makeLeg(-0.65, 0.35));
    dragon.add(makeLeg(-0.65, -0.35));

    // ============================================================
    // WINGS — simple stylized bat wings
    // ============================================================
    function makeWing(mirror = 1) {
        const wing = new THREE.Group();

        const bone = new THREE.Mesh(
            new THREE.BoxGeometry(0.80, 0.15, 0.15),
            wingMat
        );

        const membrane = new THREE.Mesh(
            new THREE.BoxGeometry(0.80, 0.50, 0.02),
            wingMat
        );
        membrane.position.set(0.40, -0.25, 0);

        wing.add(bone);
        wing.add(membrane);

        wing.position.set(0, 1.10, 0.55 * mirror);
        wing.rotation.y = mirror * 0.55;
        return wing;
    }

    dragon.add(makeWing(1));
    dragon.add(makeWing(-1));

    // ============================================================
    // TAIL — long taper
    // ============================================================
    function tailSegment(size: number, x: number) {
        const seg = new THREE.Mesh(
            new THREE.BoxGeometry(size, 0.30, 0.30),
            bodyMat
        );
        seg.position.set(x, 1.0, 0);
        return seg;
    }
    dragon.add(tailSegment(0.55, -1.30));
    dragon.add(tailSegment(0.45, -1.60));
    dragon.add(tailSegment(0.35, -1.85));
    dragon.add(tailSegment(0.22, -2.05));

    // ============================================================
    dragon.scale.set(scale, scale, scale);
    return dragon;
}
