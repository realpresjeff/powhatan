export function createChickenModel(options: {
    bodyColor?: number;
    beakColor?: number;
    combColor?: number;
    legColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {
    const {
        bodyColor = 0xFFFFFF,      // white chicken
        beakColor = 0xD9A441,      // yellow-orange beak
        combColor = 0xCC2E2E,      // red comb & wattle
        legColor = 0xD9A441,       // yellow legs/feet
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const chicken = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor, flatShading: true });
    const combMat = new THREE.MeshStandardMaterial({ color: combColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });

    // ============================================================
    // BODY (roundish cube)
    // ============================================================
    const bodyGeom = new THREE.BoxGeometry(1.3, 1.3, 1.1);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0.9, 0);
    chicken.add(body);

    // ============================================================
    // HEAD
    // ============================================================
    const headGeom = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0.65, 1.35, 0);
    chicken.add(head);

    // ============================================================
    // BEAK (pointed block)
    // ============================================================
    const beakGeom = new THREE.BoxGeometry(0.30, 0.18, 0.18);
    const beak = new THREE.Mesh(beakGeom, beakMat);
    beak.position.set(0.38, -0.02, 0);
    head.add(beak);

    // ============================================================
    // COMB (top of head)
    // ============================================================
    const combGeom = new THREE.BoxGeometry(0.30, 0.20, 0.45);
    const comb = new THREE.Mesh(combGeom, combMat);
    comb.position.set(0, 0.32, 0);
    head.add(comb);

    // ============================================================
    // WATTLE (under chin)
    // ============================================================
    const wattleGeom = new THREE.BoxGeometry(0.20, 0.30, 0.20);
    const wattle = new THREE.Mesh(wattleGeom, combMat);
    wattle.position.set(0.10, -0.35, 0);
    head.add(wattle);

    // ============================================================
    // EYES
    // ============================================================
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.15, 0.05, 0.18);
    rightEye.position.set(0.15, 0.05, -0.18);

    head.add(leftEye, rightEye);

    // ============================================================
    // WINGS (small square folded wings)
    // ============================================================
    const wingGeom = new THREE.BoxGeometry(0.55, 0.75, 0.15);

    const leftWing = new THREE.Mesh(wingGeom, bodyMat);
    leftWing.position.set(0, 0.1, 0.55);
    leftWing.rotation.z = 0.12;

    const rightWing = new THREE.Mesh(wingGeom, bodyMat);
    rightWing.position.set(0, 0.1, -0.55);
    rightWing.rotation.z = -0.12;

    body.add(leftWing, rightWing);

    // ============================================================
    // TAIL (angled upward block)
    // ============================================================
    const tailGeom = new THREE.BoxGeometry(0.60, 0.50, 0.20);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    tail.position.set(-0.85, 1.1, 0);
    tail.rotation.z = -0.4;
    chicken.add(tail);

    // ============================================================
    // LEGS (thin bird legs)
    // ============================================================
    const upperLegGeom = new THREE.BoxGeometry(0.12, 0.35, 0.12);
    const lowerLegGeom = new THREE.BoxGeometry(0.10, 0.35, 0.10);

    function makeLeg(x: number, z: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, legMat);
        const lower = new THREE.Mesh(lowerLegGeom, legMat);

        group.position.set(x, 0.40, z);
        upper.position.set(0, -0.18, 0);
        lower.position.set(0, -0.30, 0);

        group.add(upper);
        upper.add(lower);

        return { group, upper, lower };
    }

    const leftLeg = makeLeg(0.25, 0.18);
    const rightLeg = makeLeg(0.25, -0.18);

    chicken.add(leftLeg.group, rightLeg.group);

    // ============================================================
    // FEET (3 toes)
    // ============================================================
    function createFoot(parent: THREE.Object3D) {
        const toeGeom = new THREE.BoxGeometry(0.20, 0.08, 0.08);

        const center = new THREE.Mesh(toeGeom, legMat);
        center.position.set(0.10, -0.22, 0);
        parent.add(center);

        const leftToe = new THREE.Mesh(toeGeom, legMat);
        leftToe.position.set(0.10, -0.22, 0.12);
        parent.add(leftToe);

        const rightToe = new THREE.Mesh(toeGeom, legMat);
        rightToe.position.set(0.10, -0.22, -0.12);
        parent.add(rightToe);
    }

    createFoot(leftLeg.lower);
    createFoot(rightLeg.lower);

    // ============================================================
    // RIG EXPORT
    // ============================================================
    chicken.userData.rig = {
        body,
        head,
        beak,
        comb,
        wattle,
        wings: { leftWing, rightWing },
        tail,
        legs: {
            leftLeg,
            rightLeg,
        }
    };

    chicken.scale.set(scale, scale, scale);
    return chicken;
}
