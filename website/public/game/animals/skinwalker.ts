export function createSkinwalkerDeerModel(options: {
    skinColor?: number;
    boneColor?: number;
    antlerColor?: number;
    eyeColor?: number;
    clawColor?: number;
    scale?: number;
} = {}) {

    const {
        skinColor = 0x3a2e27,     // dark creature skin
        boneColor = 0xded2c2,     // deer skull color
        antlerColor = 0xbba78c,
        eyeColor = 0x111111,
        clawColor = 0x1a1a1a,
        scale = 1,
    } = options;

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const boneMat = new THREE.MeshStandardMaterial({ color: boneColor, flatShading: true });
    const antlerMat = new THREE.MeshStandardMaterial({ color: antlerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const clawMat = new THREE.MeshStandardMaterial({ color: clawColor, flatShading: true });

    const creature = new THREE.Group();

    // ============================================================
    // TORSO — lean humanoid torso
    // ============================================================
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.6, 0.5),
        skinMat
    );
    torso.position.set(0, 1.6, 0);
    creature.add(torso);

    // Rib accents (creepy)
    function rib(yOffset: number, width: number) {
        const r = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.15, 0.45),
            boneMat
        );
        r.position.set(0.05, yOffset, 0);
        torso.add(r);
    }
    rib(0.40, 0.7);
    rib(0.10, 0.8);
    rib(-0.20, 0.9);

    // ============================================================
    // HEAD — deer skull shape
    // ============================================================
    const skull = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.75, 0.45),
        boneMat
    );
    skull.position.set(0, 2.55, 0);
    creature.add(skull);

    // Snout (elongated)
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.40, 0.35, 0.35),
        boneMat
    );
    snout.position.set(0, -0.25, 0.10);
    skull.add(snout);

    // Eye sockets (dark)
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), eyeMat);
    const eyeR = eyeL.clone();
    eyeL.position.set(0.15, 0.10, 0.22);
    eyeR.position.set(0.15, 0.10, -0.22);
    skull.add(eyeL, eyeR);

    // ============================================================
    // ANTLERS — stylized branching boxes
    // ============================================================
    function makeAntler(mirror = 1) {
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.70, 0.15),
            antlerMat
        );
        base.position.set(-0.20, 0.40, 0.30 * mirror);
        base.rotation.z = mirror * 0.25;

        const branch1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.45, 0.12),
            antlerMat
        );
        branch1.position.set(0, 0.30, 0.20 * mirror);
        branch1.rotation.z = mirror * 0.35;

        const branch2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.10, 0.35, 0.10),
            antlerMat
        );
        branch2.position.set(0.10, 0.15, -0.20 * mirror);
        branch2.rotation.z = mirror * -0.25;

        base.add(branch1);
        base.add(branch2);

        skull.add(base);
    }
    makeAntler(1);
    makeAntler(-1);

    // ============================================================
    // ARMS — long, creepy limbs
    // ============================================================
    function makeArm(mirror = 1) {
        const arm = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.95, 0.25),
            skinMat
        );
        upper.position.set(0, -0.50, 0);

        const lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.20, 0.90, 0.20),
            skinMat
        );
        lower.position.set(0, -0.75, 0);
        upper.add(lower);

        const hand = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.18, 0.35),
            skinMat
        );
        hand.position.set(0, -0.45, 0);
        lower.add(hand);

        // Claws
        function claw(offsetZ: number) {
            const c = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.28, 0.12),
                clawMat
            );
            c.position.set(0.18, -0.10, offsetZ);
            c.rotation.z = 0.3;
            return c;
        }
        hand.add(claw(0.12));
        hand.add(claw(0));
        hand.add(claw(-0.12));

        arm.add(upper);
        arm.position.set(0.55 * mirror, 1.85, 0);
        arm.rotation.z = mirror * 0.15;
        return arm;
    }

    creature.add(makeArm(1));
    creature.add(makeArm(-1));

    // ============================================================
    // LEGS — digitigrade (creature stance)
    // ============================================================
    function makeLeg(mirror = 1) {
        const leg = new THREE.Group();

        const thigh = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.90, 0.35),
            skinMat
        );
        thigh.position.set(0, -0.45, 0);
        thigh.rotation.x = 0.25;

        const shin = new THREE.Mesh(
            new THREE.BoxGeometry(0.30, 0.90, 0.30),
            skinMat
        );
        shin.position.set(0, -0.75, -0.10);
        thigh.add(shin);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.22, 0.45),
            skinMat
        );
        foot.position.set(0, -0.45, 0.05);
        shin.add(foot);

        // Claws
        function toe(zOff: number) {
            const t = new THREE.Mesh(
                new THREE.BoxGeometry(0.14, 0.20, 0.14),
                clawMat
            );
            t.position.set(0.20, -0.05, zOff);
            return t;
        }
        foot.add(toe(0.15));
        foot.add(toe(0));
        foot.add(toe(-0.15));

        leg.add(thigh);
        leg.position.set(0.35 * mirror, 0.85, 0);
        return leg;
    }

    creature.add(makeLeg(1));
    creature.add(makeLeg(-1));

    // ============================================================
    creature.scale.set(scale, scale, scale);
    return creature;
}
