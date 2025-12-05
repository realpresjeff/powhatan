export function createHorseModel(options: {
    coatColor?: number;
    maneColor?: number;
    eyeColor?: number;
    hoofColor?: number;
    scale?: number;
} = {}) {

    const {
        coatColor = 0x8c6239,   // brown
        maneColor = 0x3a2c20,   // dark mane
        eyeColor = 0x111111,
        hoofColor = 0x2a2624,
        scale = 1,
    } = options;

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const maneMat = new THREE.MeshStandardMaterial({ color: maneColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const hoofMat = new THREE.MeshStandardMaterial({ color: hoofColor, flatShading: true });

    const horse = new THREE.Group();

    // ============================================================
    // BODY — long rectangular torso (stylized realistic)
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.85, 0.55),
        coatMat
    );
    body.position.set(0, 1.1, 0);
    horse.add(body);

    // Chest (slightly deeper)
    const chest = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.80, 0.60),
        coatMat
    );
    chest.position.set(0.60, 1.08, 0);
    horse.add(chest);

    // ============================================================
    // NECK — angled, long, elegant
    // ============================================================
    const neck = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 1.00, 0.45),
        coatMat
    );
    neck.position.set(0.95, 1.65, 0);
    neck.rotation.z = -0.45;
    horse.add(neck);

    // ============================================================
    // HEAD — rectangular but shaped like a horse head
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.45, 0.40),
        coatMat
    );
    head.position.set(1.45, 1.95, 0);
    head.rotation.z = -0.10;
    horse.add(head);

    // Muzzle
    const muzzle = new THREE.Mesh(
        new THREE.BoxGeometry(0.40, 0.28, 0.32),
        coatMat
    );
    muzzle.position.set(0.40, -0.02, 0);
    head.add(muzzle);

    // Nostrils (small cubes)
    const nostrilL = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.10, 0.10),
        hoofMat
    );
    const nostrilR = nostrilL.clone();
    nostrilL.position.set(0.20, 0, 0.11);
    nostrilR.position.set(0.20, 0, -0.11);
    muzzle.add(nostrilL, nostrilR);

    // Eyes — stylized cubes
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.10, 0.10), eyeMat);
    const eyeR = eyeL.clone();
    eyeL.position.set(0.10, 0.12, 0.23);
    eyeR.position.set(0.10, 0.12, -0.23);
    head.add(eyeL, eyeR);

    // Ears
    function makeEar(mirror = 1) {
        const ear = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.35, 0.12),
            coatMat
        );
        ear.position.set(-0.10, 0.24, 0.18 * mirror);
        ear.rotation.z = 0.22 * mirror;
        return ear;
    }
    head.add(makeEar(1));
    head.add(makeEar(-1));

    // ============================================================
    // MANE — top-centered and down the neck
    // ============================================================
    // const mane = new THREE.Mesh(
    //     new THREE.BoxGeometry(0.20, 1.15, 0.20),
    //     maneMat
    // );
    // mane.position.set(0.60, 1.60, 0);
    // horse.add(mane);

    // Forelock (front mane)
    const forelock = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.32, 0.25),
        maneMat
    );
    forelock.position.set(1.15, 1.95, 0);
    horse.add(forelock);

    // ============================================================
    // LEGS — long, straight, realistic
    // ============================================================
    function makeFrontLeg(zOffset: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.70, 0.22),
            coatMat
        );
        upper.position.set(0, -0.35, 0);

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.70, 0.18),
            coatMat
        );
        lower.position.set(0, -0.55, 0);

        const hoof = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.20, 0.24),
            hoofMat
        );
        hoof.position.set(0, -0.50, 0);

        leg.add(upper);
        upper.add(lower);
        lower.add(hoof);

        leg.position.set(0.55, 0.55, zOffset);
        return leg;
    }

    function makeBackLeg(zOffset: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.75, 0.25),
            coatMat
        );
        upper.position.set(0, -0.35, 0);
        upper.rotation.x = 0.22; // realistic back-leg angle

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.70, 0.20),
            coatMat
        );
        lower.position.set(0, -0.55, -0.05);

        const hoof = new THREE.Mesh(
            new THREE.BoxGeometry(0.26, 0.22, 0.26),
            hoofMat
        );
        hoof.position.set(0, -0.50, 0.05);

        leg.add(upper);
        upper.add(lower);
        lower.add(hoof);

        leg.position.set(-0.55, 0.60, zOffset);
        return leg;
    }

    horse.add(makeFrontLeg(0.22));
    horse.add(makeFrontLeg(-0.22));
    horse.add(makeBackLeg(0.22));
    horse.add(makeBackLeg(-0.22));

    // ============================================================
    // TAIL — clean box-based tail
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.90, 0.25),
        maneMat
    );
    tail.position.set(-0.95, 1.10, 0);
    tail.rotation.x = 0.45;
    horse.add(tail);

    // ============================================================
    horse.scale.set(scale, scale, scale);
    return horse;
}
