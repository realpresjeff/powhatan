export function createMastodonModel(options: {
    bodyColor?: number;
    furColor?: number;
    tuskColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x6b5a4a,   // dark brown mastodon fur
        furColor = 0x7a6a58,   // lighter shag accents
        tuskColor = 0xf0eadf,   // ivory
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const furMat = new THREE.MeshStandardMaterial({ color: furColor, flatShading: true });
    const tuskMat = new THREE.MeshStandardMaterial({ color: tuskColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const mastodon = new THREE.Group();

    // ------------------------------------------------------------
    // BODY — huge, shaggy mass
    // ------------------------------------------------------------
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.8, 1.6),
        bodyMat
    );
    body.position.set(0, 1.9, 0);
    mastodon.add(body);

    // Fur hump
    const hump = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.9, 1.4),
        furMat
    );
    hump.position.set(-0.3, 0.9, 0);
    body.add(hump);

    // ------------------------------------------------------------
    // HEAD — taller dome than elephant
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.2, 1.1),
        bodyMat
    );
    head.position.set(2.1, 2.4, 0);
    mastodon.add(head);

    // Forehead dome
    const dome = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.7, 1.0),
        furMat
    );
    dome.position.set(-0.2, 0.55, 0);
    head.add(dome);

    // ------------------------------------------------------------
    // EYES — small, forward-facing
    // ------------------------------------------------------------
    const eyeGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);

    eyeL.position.set(0.10, 0.10, 0.45);
    eyeR.position.set(0.10, 0.10, -0.45);
    head.add(eyeL, eyeR);

    // ------------------------------------------------------------
    // TRUNK — segmented cylinder (easy to animate)
    // ------------------------------------------------------------
    const trunkSegments: THREE.Mesh[] = [];
    const trunkCount = 4;

    for (let i = 0; i < trunkCount; i++) {
        const seg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.20 - i * 0.03, 0.22 - i * 0.03, 0.6, 10),
            bodyMat
        );
        seg.rotation.z = Math.PI / 2;
        seg.position.set(
            0.9 + i * 0.45,
            -0.4 - i * 0.1,
            0
        );
        head.add(seg);
        trunkSegments.push(seg);
    }

    // ------------------------------------------------------------
    // TUSKS — curved outward
    // ------------------------------------------------------------
    function makeTusk(side: 1 | -1) {
        const tusk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.10, 0.14, 1.4, 12),
            tuskMat
        );
        tusk.rotation.z = Math.PI / 2;
        tusk.rotation.y = side * 0.35;
        tusk.position.set(0.75, -0.25, 0.45 * side);
        return tusk;
    }

    head.add(makeTusk(1));
    head.add(makeTusk(-1));

    // ------------------------------------------------------------
    // EARS — smaller than elephant, furred
    // ------------------------------------------------------------
    function makeEar(side: 1 | -1) {
        const ear = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.90, 0.90),
            furMat
        );
        ear.position.set(-0.30, 0.10, 0.75 * side);
        ear.rotation.x = side * 0.15;
        return ear;
    }

    head.add(makeEar(1));
    head.add(makeEar(-1));

    // ------------------------------------------------------------
    // LEGS — thick pillars
    // ------------------------------------------------------------
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.4, 0.6),
            bodyMat
        );
        upper.position.set(0, -0.7, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.35, 0.75),
            bodyMat
        );
        foot.position.set(0, -0.9, 0);

        leg.add(upper);
        upper.add(foot);

        leg.position.set(x, 1.1, z);
        return leg;
    }

    mastodon.add(makeLeg(1.1, 0.7));
    mastodon.add(makeLeg(1.1, -0.7));
    mastodon.add(makeLeg(-1.1, 0.7));
    mastodon.add(makeLeg(-1.1, -0.7));

    // ------------------------------------------------------------
    // TAIL — small and shaggy
    // ------------------------------------------------------------
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        furMat
    );
    tail.position.set(-1.8, 2.1, 0);
    mastodon.add(tail);

    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    mastodon.scale.set(scale, scale, scale);

    mastodon.userData = {
        trunkSegments
    };

    return mastodon;
}
