export function createAnkylosaurusModel(options: {
    bodyColor?: number;
    armorColor?: number;
    bellyColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x6f7f6a,    // olive gray
        armorColor = 0x8a6b4a,   // darker armor
        bellyColor = 0x9cab8a,
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const armorMat = new THREE.MeshStandardMaterial({ color: armorColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const anky = new THREE.Group();

    // ------------------------------------------------------------
    // BODY — low, wide, tank-like
    // ------------------------------------------------------------
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.0, 1.6),
        bodyMat
    );
    body.position.set(0, 1.1, 0);
    anky.add(body);

    const belly = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 0.35, 1.5),
        bellyMat
    );
    belly.position.set(0, -0.30, 0);
    body.add(belly);

    // ------------------------------------------------------------
    // HEAD — small, armored
    // ------------------------------------------------------------
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.45, 0.55),
        bodyMat
    );
    head.position.set(1.9, 1.15, 0);
    anky.add(head);

    // Snout
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.30, 0.25, 0.35),
        bodyMat
    );
    snout.position.set(0.28, -0.05, 0);
    head.add(snout);

    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(-0.10, 0.10, 0.25);
    eyeR.position.set(-0.10, 0.10, -0.25);
    head.add(eyeL, eyeR);

    // ------------------------------------------------------------
    // ARMOR PLATES — along back + sides
    // ------------------------------------------------------------
    const armorCount = 6;
    for (let i = 0; i < armorCount; i++) {
        const plate = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.30, 0.60),
            armorMat
        );

        plate.position.set(
            -0.9 + i * 0.45,
            1.70,
            i % 2 === 0 ? 0.55 : -0.55
        );

        anky.add(plate);
    }

    // ------------------------------------------------------------
    // LEGS — short, thick
    // ------------------------------------------------------------
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.8, 0.45),
            bodyMat
        );
        upper.position.set(0, -0.40, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.25, 0.55),
            bodyMat
        );
        foot.position.set(0, -0.55, 0);

        leg.add(upper);
        upper.add(foot);

        leg.position.set(x, 0.75, z);
        return leg;
    }

    anky.add(makeLeg(1.1, 0.6));
    anky.add(makeLeg(1.1, -0.6));
    anky.add(makeLeg(-1.1, 0.6));
    anky.add(makeLeg(-1.1, -0.6));

    // ------------------------------------------------------------
    // TAIL — segmented + club
    // ------------------------------------------------------------
    const tailSegments: THREE.Mesh[] = [];
    const tailCount = 3;

    for (let i = 0; i < tailCount; i++) {
        const seg = new THREE.Mesh(
            new THREE.BoxGeometry(0.7 - i * 0.15, 0.35, 0.35),
            bodyMat
        );
        seg.position.set(-1.8 - i * 0.45, 1.1, 0);
        anky.add(seg);
        tailSegments.push(seg);
    }

    // Tail club
    const club = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.45, 0.6),
        armorMat
    );
    club.position.set(-3.2, 1.1, 0);
    anky.add(club);

    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    anky.scale.set(scale, scale, scale);

    anky.userData = {
        tailSegments,
        club,
    };

    return anky;
}
