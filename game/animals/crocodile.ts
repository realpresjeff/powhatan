export function createCrocodileModel(options: {
    bodyColor?: number;
    bellyColor?: number;
    eyeColor?: number;
    toothColor?: number;
    scale?: number;
} = {}) {

    const {
        bodyColor = 0x4f6a47,     // crocodile green
        bellyColor = 0x9bb68a,    // lighter underside
        eyeColor = 0x111111,
        toothColor = 0xffffff,
        scale = 1,
    } = options;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const toothMat = new THREE.MeshStandardMaterial({ color: toothColor, flatShading: true });

    const croc = new THREE.Group();

    // ============================================================
    // MAIN BODY — long croc torso (rectangular)
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.55, 0.75),
        bodyMat
    );
    body.position.set(0, 0.7, 0);
    croc.add(body);

    // Belly underside
    const belly = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.25, 0.70),
        bellyMat
    );
    belly.position.set(0, -0.20, 0);
    body.add(belly);

    // ============================================================
    // HEAD — rectangular crocodile head
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.45, 0.45),
        bodyMat
    );
    head.position.set(1.35, 0.82, 0);
    croc.add(head);

    // =======================
    // LONG SNOUT
    // =======================
    const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.35, 0.40),
        bodyMat
    );
    snout.position.set(0.70, -0.05, 0);
    head.add(snout);

    // =======================
    // TEETH — small cubes
    // =======================
    function makeTooth(x: number, y: number, z: number) {
        const tooth = new THREE.Mesh(
            new THREE.BoxGeometry(0.10, 0.12, 0.10),
            toothMat
        );
        tooth.position.set(x, y, z);
        return tooth;
    }

    // Upper row
    snout.add(makeTooth(0.20, -0.18, 0.12));
    snout.add(makeTooth(0.40, -0.18, -0.12));
    snout.add(makeTooth(0.60, -0.18, 0.10));
    snout.add(makeTooth(0.75, -0.18, -0.10));

    // =======================
    // EYES — stylized cubes
    // =======================
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), eyeMat);
    const eyeR = eyeL.clone();
    eyeL.position.set(-0.10, 0.18, 0.18);
    eyeR.position.set(-0.10, 0.18, -0.18);
    head.add(eyeL, eyeR);

    // ============================================================
    // LEGS — 4 short croc legs
    // ============================================================
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.40, 0.35, 0.40),
            bodyMat
        );
        upper.position.set(0, -0.20, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.15, 0.45),
            bodyMat
        );
        foot.position.set(0, -0.25, 0);

        // Three claws
        function claw(offsetZ: number) {
            const c = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.12, 0.12),
                toothMat
            );
            c.position.set(0.22, -0.05, offsetZ);
            return c;
        }
        foot.add(claw(0.15));
        foot.add(claw(0));
        foot.add(claw(-0.15));

        leg.add(upper);
        upper.add(foot);

        leg.position.set(x, 0.45, z);
        return leg;
    }

    croc.add(makeLeg(0.85, 0.35)); // front right
    croc.add(makeLeg(0.85, -0.35)); // front left
    croc.add(makeLeg(-0.75, 0.35)); // back right
    croc.add(makeLeg(-0.75, -0.35)); // back left

    // ============================================================
    // TAIL — long tapering boxes
    // ============================================================
    const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.45, 0.55), bodyMat);
    const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.45), bodyMat);
    const tail3 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.28, 0.35), bodyMat);
    const tail4 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.20, 0.25), bodyMat);

    tail1.position.set(-1.35, 0.70, 0);
    tail2.position.set(-1.70, 0.67, 0);
    tail3.position.set(-2.00, 0.63, 0);
    tail4.position.set(-2.25, 0.60, 0);

    croc.add(tail1, tail2, tail3, tail4);

    // ============================================================
    // BACK ARMOR PLATES — croc scutes
    // ============================================================
    function makeScute(x: number, z: number) {
        const s = new THREE.Mesh(
            new THREE.BoxGeometry(0.30, 0.20, 0.30),
            bodyMat
        );
        s.position.set(x, 0.35, z);
        return s;
    }

    body.add(makeScute(-0.30, 0.20));
    body.add(makeScute(0.00, 0.00));
    body.add(makeScute(0.30, -0.20));

    // ============================================================
    croc.scale.set(scale, scale, scale);
    return croc;
}
