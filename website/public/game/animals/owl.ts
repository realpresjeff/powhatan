export function createOwlModel(options: {
    bodyColor?: number;
    faceColor?: number;
    beakColor?: number;
    wingColor?: number;
    eyeColor?: number;
    legColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x5a4633,     // owl brown
        faceColor = 0xe7dfd5,     // facial disk (lighter)
        beakColor = 0xd8b248,     // yellowish beak
        wingColor = 0x4c392a,     // darker wings
        eyeColor = 0x111111,
        legColor = 0xc79a47,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const faceMat = new THREE.MeshStandardMaterial({ color: faceColor, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor, flatShading: true });
    const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });

    const owl = new THREE.Group();

    // ============================================================
    // BODY — plump owl body
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 18, 18),
        bodyMat
    );
    body.position.set(0, 0.7, 0);
    owl.add(body);

    // Chest puff
    const chest = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 18, 18),
        bodyMat
    );
    chest.position.set(0.12, 0.62, 0.10);
    owl.add(chest);

    // ============================================================
    // HEAD — large round owl head
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.40, 18, 18),
        bodyMat
    );
    head.position.set(0.45, 1.13, 0);
    owl.add(head);

    // ============================================================
    // FACIAL DISK — signature owl circle
    // ============================================================
    const disk = new THREE.Mesh(
        new THREE.SphereGeometry(0.39, 18, 18),
        faceMat
    );
    disk.scale.set(1, 1, 0.45);  // flatten into a face plate
    disk.position.set(0.07, 0.0, 0);
    head.add(disk);

    // ============================================================
    // EYES — huge forward-facing owl eyes
    // ============================================================
    const eyeWhiteGeom = new THREE.SphereGeometry(0.10, 10, 10);
    const eyeBlackGeom = new THREE.SphereGeometry(0.05, 10, 10);

    function makeEye(zOffset: number) {
        const eyeGroup = new THREE.Group();

        const white = new THREE.Mesh(eyeWhiteGeom, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        white.position.set(0.13, 0.05, zOffset);

        const pupil = new THREE.Mesh(eyeBlackGeom, eyeMat);
        pupil.position.set(0.18, 0.05, zOffset);

        eyeGroup.add(white);
        eyeGroup.add(pupil);
        return eyeGroup;
    }

    head.add(makeEye(0.18));
    head.add(makeEye(-0.18));

    // ============================================================
    // BEAK — small triangle
    // ============================================================
    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.25, 10),
        beakMat
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.25, -0.02, 0);
    head.add(beak);

    // ============================================================
    // WINGS — small, tucked, slightly angled
    // ============================================================
    function makeWing(mirror = 1) {
        const wing = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.70, 0.26),
            wingMat
        );
        wing.position.set(0, 0.72, 0.38 * mirror);
        wing.rotation.z = -0.22 * mirror;
        return wing;
    }

    owl.add(makeWing(1));
    owl.add(makeWing(-1));

    // ============================================================
    // TAIL — wide but short, owl-style
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.50, 0.18),
        wingMat
    );
    tail.position.set(-0.52, 0.72, 0);
    tail.rotation.x = 0.22;
    owl.add(tail);

    // ============================================================
    // LEGS + TALONS
    // ============================================================
    function makeLeg(zOffset: number) {
        const legGroup = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.22, 0.16),
            legMat
        );
        thigh.position.set(0, -0.12, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.10, 0.16),
            legMat
        );
        foot.position.set(0.14, -0.16, 0);

        legGroup.add(thigh);
        thigh.add(foot);

        legGroup.position.set(0.18, 0.45, zOffset);

        return legGroup;
    }

    owl.add(makeLeg(0.10));   // left
    owl.add(makeLeg(-0.10));  // right

    owl.scale.set(scale, scale, scale);
    return owl;
}
