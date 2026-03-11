export function createTurtleModel(options: {
    shellColor?: number;
    bodyColor?: number;
    plateColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {

    const {
        shellColor = 0x4a5f39,   // olive green shell
        bodyColor = 0x7a8e63,    // lighter green body
        plateColor = 0x3b4b2d,   // darker plate segments
        eyeColor = 0x111111,
        scale = 1,
    } = options;

    const shellMat = new THREE.MeshStandardMaterial({ color: shellColor, flatShading: true });
    const plateMat = new THREE.MeshStandardMaterial({ color: plateColor, flatShading: true });
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });

    const turtle = new THREE.Group();

    // ============================================================
    // SHELL — a large boxed dome (stylized look)
    // ============================================================
    const shellBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.45, 1.15),
        shellMat
    );
    shellBase.position.set(0, 0.75, 0);
    turtle.add(shellBase);

    // Plates on top (three segments)
    function makePlate(x: number, z: number) {
        const plate = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.20, 0.45),
            plateMat
        );
        plate.position.set(x, 0.15, z);
        return plate;
    }

    shellBase.add(makePlate(-0.45, 0));
    shellBase.add(makePlate(0, 0));
    shellBase.add(makePlate(0.45, 0));

    // ============================================================
    // HEAD — simple rectangular head
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.40, 0.40),
        bodyMat
    );
    head.position.set(1.0, 0.82, 0);
    turtle.add(head);

    // Beak (turtle mouth)
    const beak = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.15, 0.30),
        bodyMat
    );
    beak.position.set(0.32, -0.05, 0);
    head.add(beak);

    // Eyes (square style)
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.10, 0.10), eyeMat);
    const eyeR = eyeL.clone();
    eyeL.position.set(0.20, 0.10, 0.18);
    eyeR.position.set(0.20, 0.10, -0.18);
    head.add(eyeL, eyeR);

    // ============================================================
    // LEGS — four chunky turtle legs with small claws
    // ============================================================
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Group();

        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.35, 0.35),
            bodyMat
        );
        upper.position.set(0, -0.18, 0);

        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.38, 0.18, 0.38),
            bodyMat
        );
        foot.position.set(0, -0.22, 0);

        // Simple claws: three box bumps
        function makeClaw(offsetZ: number) {
            const claw = new THREE.Mesh(
                new THREE.BoxGeometry(0.10, 0.10, 0.10),
                plateMat
            );
            claw.position.set(0.18, -0.05, offsetZ);
            return claw;
        }

        foot.add(makeClaw(0.12));
        foot.add(makeClaw(0));
        foot.add(makeClaw(-0.12));

        leg.add(upper);
        upper.add(foot);

        leg.position.set(x, 0.40, z);
        return leg;
    }

    turtle.add(makeLeg(0.65, 0.40)); // front right
    turtle.add(makeLeg(0.65, -0.40)); // front left
    turtle.add(makeLeg(-0.65, 0.40)); // back right
    turtle.add(makeLeg(-0.65, -0.40)); // back left

    // ============================================================
    // TAIL — small box tail
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.22, 0.22),
        bodyMat
    );
    tail.position.set(-0.95, 0.75, 0);
    turtle.add(tail);

    // ============================================================
    turtle.scale.set(scale, scale, scale);
    return turtle;
}
