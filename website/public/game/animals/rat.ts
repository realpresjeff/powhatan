export function createRatModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    earColor?: number;
    eyeColor?: number;
    tailColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x6b6b6b,   // gray rat
        bellyColor = 0x8a8a8a,
        earColor = 0x9a7a7a,    // pinkish ears
        eyeColor = 0x111111,
        tailColor = 0x8a6a6a,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const earMat = new THREE.MeshStandardMaterial({ color: earColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const tailMat = new THREE.MeshStandardMaterial({ color: tailColor, flatShading: true });

    const rat = new THREE.Group();

    // ------------------------------------------------------------
    // BODY — rounded but simple
    // ------------------------------------------------------------
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 14, 14),
        bodyMat
    );
    body.scale.set(1.4, 1.0, 0.9);
    body.position.set(0, 0.55, 0);
    rat.add(body);

    // Belly
    const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 12, 12),
        bellyMat
    );
    belly.scale.set(1.3, 0.7, 0.9);
    belly.position.set(0.10, -0.10, 0);
    body.add(belly);

    // ------------------------------------------------------------
    // HEAD — small with pointed snout
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.30, 14, 14),
        bodyMat
    );
    head.position.set(0.60, 0.70, 0);
    rat.add(head);

    // Snout
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.30, 0.20, 0.20),
        bodyMat
    );
    snout.position.set(0.28, -0.05, 0);
    head.add(snout);

    // Nose
    const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        earMat
    );
    nose.position.set(0.18, 0, 0);
    snout.add(nose);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.05, 0.08, 0.14);
    eyeR.position.set(0.05, 0.08, -0.14);
    head.add(eyeL, eyeR);

    // ------------------------------------------------------------
    // EARS — big rat ears
    // ------------------------------------------------------------
    function makeEar(side: 1 | -1) {
        const ear = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 10, 10),
            earMat
        );
        ear.scale.set(0.6, 1.0, 1.0);
        ear.position.set(-0.10, 0.20, 0.20 * side);
        return ear;
    }

    head.add(makeEar(1));
    head.add(makeEar(-1));

    // ------------------------------------------------------------
    // LEGS — small, quick
    // ------------------------------------------------------------
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.20, 0.12),
            bodyMat
        );
        upper.position.set(0, -0.10, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.08, 0.20),
            bodyMat
        );
        foot.position.set(0, -0.12, 0);

        leg.add(upper);
        upper.add(foot);

        leg.position.set(x, 0.30, z);
        return leg;
    }

    rat.add(makeLeg(0.20, 0.18));
    rat.add(makeLeg(0.20, -0.18));
    rat.add(makeLeg(-0.20, 0.18));
    rat.add(makeLeg(-0.20, -0.18));

    // ------------------------------------------------------------
    // TAIL — long, thin, iconic rat tail
    // ------------------------------------------------------------
    const tail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.02, 1.6, 10),
        tailMat
    );
    tail.rotation.z = Math.PI / 2;
    tail.position.set(-0.80, 0.55, 0);
    rat.add(tail);

    // ------------------------------------------------------------
    rat.scale.set(scale, scale, scale);
    return rat;
}
