export function createDutchMarine1575Model(options: {
    coatColor?: number;
    pantsColor?: number;
    hatColor?: number;
    leatherColor?: number;
    skinColor?: number;
    eyeColor?: number;
    woodColor?: number;
    metalColor?: number;
    scale?: number;
} = {}) {

    const {
        coatColor = 0x3f4f5a,   // blue-gray coat
        pantsColor = 0x5a5a4a,  // canvas trousers
        hatColor = 0x2a2a2a,    // dark felt cap
        leatherColor = 0x5a3b1e,
        skinColor = 0xd6c4a4,
        eyeColor = 0x111111,
        woodColor = 0x6b4a2d,
        metalColor = 0x666666,
        scale = 1,
    } = options;

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, flatShading: true });
    const hatMat = new THREE.MeshStandardMaterial({ color: hatColor, flatShading: true });
    const leatherMat = new THREE.MeshStandardMaterial({ color: leatherColor, flatShading: true });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, flatShading: true });
    const metalMat = new THREE.MeshStandardMaterial({
        color: metalColor,
        metalness: 0.55,
        roughness: 0.55
    });

    const marine = new THREE.Group();

    // ============================================================
    // TORSO — short naval coat
    // ============================================================
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.95, 0.45),
        coatMat
    );
    torso.position.set(0, 1.30, 0);
    marine.add(torso);

    // Leather belt
    const belt = new THREE.Mesh(
        new THREE.BoxGeometry(0.70, 0.12, 0.50),
        leatherMat
    );
    belt.position.set(0, -0.32, 0);
    torso.add(belt);

    // ============================================================
    // HEAD
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.40, 0.45, 0.40),
        skinMat
    );
    head.position.set(0.30, 0.85, 0);
    torso.add(head);

    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.12, 0.05, 0.14);
    eyeR.position.set(0.12, 0.05, -0.14);
    head.add(eyeL, eyeR);

    // Felt sailor cap (common among Sea Beggars)
    const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.18, 0.48),
        hatMat
    );
    cap.position.set(0, 0.18, 0);
    head.add(cap);

    // ============================================================
    // ARMS — holding arquebus (boarding posture)
    // ============================================================
    function makeArm(side: 1 | -1) {
        const arm = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.44, 0.24),
            coatMat
        );
        upper.position.set(0, -0.22, 0);

        const fore = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.44, 0.20),
            coatMat
        );
        fore.position.set(0, -0.40, 0);
        upper.add(fore);

        const hand = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.14, 0.14),
            skinMat
        );
        hand.position.set(0, -0.32, 0);
        fore.add(hand);

        arm.add(upper);
        arm.position.set(0.35, 1.50, 0.30 * side);

        return { arm, upper, fore, hand };
    }

    const leftArm = makeArm(-1);
    const rightArm = makeArm(1);
    marine.add(leftArm.arm, rightArm.arm);

    // Pose arms for firearm use
    // rightArm.upper.rotation.z = -0.9;
    // rightArm.upper.rotation.x = 0.25;
    // rightArm.fore.rotation.z = -0.55;
    // rightArm.hand.rotation.y = Math.PI / 2;

    // leftArm.upper.rotation.z = -0.6;
    // leftArm.upper.rotation.x = 0.2;
    // leftArm.fore.rotation.z = -0.35;
    // leftArm.hand.rotation.y = Math.PI / 2;

    // ============================================================
    // DUTCH ARQUEBUS (naval issue)
    // ============================================================
    const gun = new THREE.Group();

    const stock = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.14, 0.12),
        woodMat
    );
    gun.add(stock);

    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.6, 10),
        metalMat
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.8, 0, 0);
    gun.add(barrel);

    const lock = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.10, 0.10),
        metalMat
    );
    lock.position.set(-0.2, 0.10, 0);
    gun.add(lock);

    gun.rotation.z = Math.PI / 2;
    gun.position.set(0.12, -0.04, 0);
    rightArm.hand.add(gun);

    // ============================================================
    // LEGS — wide sailor trousers
    // ============================================================
    function makeLeg(side: 1 | -1) {
        const leg = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.BoxGeometry(0.34, 0.55, 0.34),
            pantsMat
        );
        thigh.position.set(0, -0.28, 0);

        const shin = new THREE.Mesh(
            new THREE.BoxGeometry(0.26, 0.55, 0.26),
            pantsMat
        );
        shin.position.set(0, -0.48, 0);
        thigh.add(shin);

        const shoe = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.12, 0.45),
            leatherMat
        );
        shoe.position.set(0.05, -0.40, 0);
        shin.add(shoe);

        leg.add(thigh);
        leg.position.set(-0.10, 0.78, 0.20 * side);
        return leg;
    }

    marine.add(makeLeg(1));
    marine.add(makeLeg(-1));

    // ============================================================
    marine.scale.set(scale, scale, scale);

    marine.userData = {
        head,
        gun,
        rightArm,
        leftArm,
    };

    return marine;
}
