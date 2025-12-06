export function createGrayAlienModel(options: {
    skinColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {
    const {
        skinColor = 0x9ea2a3, // light gray
        eyeColor = 0x111111,  // black eyes
        scale = 1,
    } = options;

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const alien = new THREE.Group();

    // ------------------------------------------------------------
    // TORSO – facing +X
    // ------------------------------------------------------------
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.2, 0.4),
        skinMat
    );
    torso.position.set(0, 1.2, 0); // center torso at about 1.2 high
    alien.add(torso);

    // Slight abdomen
    const abdomen = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.6, 0.32),
        skinMat
    );
    abdomen.position.set(0.0, -0.5, 0.0);
    torso.add(abdomen);

    // ------------------------------------------------------------
    // HEAD – in front of torso, also facing +X
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 16),
        skinMat
    );
    // No rotation on head at all
    head.scale.set(1.2, 1.5, 1.0); // elongated but still forward-facing
    head.position.set(0.7, 2.1, 0); // in front of torso along +X
    alien.add(head);

    // ------------------------------------------------------------
    // EYES – guaranteed aligned with torso (forward = +X)
    // ------------------------------------------------------------
    const eyeGeom = new THREE.SphereGeometry(0.18, 12, 12);

    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    // Slight almond shape but NO rotations – they just inherit head facing
    leftEye.scale.set(1.4, 0.7, 1.0);
    rightEye.scale.set(1.4, 0.7, 1.0);

    // Put them on the FRONT ( +X ) side of the head, symmetric in Z
    // This is the critical bit: X is clearly "front", like the torso.
    leftEye.position.set(0.32, 0.06, 0.20);
    rightEye.position.set(0.32, 0.06, -0.20);

    head.add(leftEye);
    head.add(rightEye);

    // ------------------------------------------------------------
    // ARMS – skinny grey alien arms
    // ------------------------------------------------------------
    function makeArm(side: 1 | -1) {
        const arm = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.7, 0.16),
            skinMat
        );
        upper.position.set(0, -0.35, 0);

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.65, 0.14),
            skinMat
        );
        lower.position.set(0, -0.55, 0);
        upper.add(lower);

        const hand = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.14, 0.2),
            skinMat
        );
        hand.position.set(0, -0.38, 0);
        lower.add(hand);

        // simple three fingers
        function finger(zOff: number) {
            const f = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.22, 0.06),
                skinMat
            );
            f.position.set(0, -0.16, zOff);
            return f;
        }
        hand.add(finger(0.10));
        hand.add(finger(0.0));
        hand.add(finger(-0.10));

        arm.add(upper);
        arm.position.set(0, 1.5, 0.30 * side); // attach at torso sides
        return arm;
    }

    alien.add(makeArm(1));
    alien.add(makeArm(-1));

    // ------------------------------------------------------------
    // LEGS – thin, spindly
    // ------------------------------------------------------------
    function makeLeg(side: 1 | -1) {
        const leg = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.85, 0.2),
            skinMat
        );
        thigh.position.set(0, -0.42, 0);

        const shin = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.8, 0.16),
            skinMat
        );
        shin.position.set(0, -0.7, 0);
        thigh.add(shin);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.18, 0.35),
            skinMat
        );
        foot.position.set(0.0, -0.45, 0);
        shin.add(foot);

        leg.add(thigh);
        leg.position.set(-0.05, 0.5, 0.17 * side); // under torso
        return leg;
    }

    alien.add(makeLeg(1));
    alien.add(makeLeg(-1));

    alien.scale.set(scale, scale, scale);

    return alien;
}
