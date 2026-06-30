export function createRaptorModel(options = {}) {
    const { bodyColor = 0x6f7a6a, // muted green/gray
    bellyColor = 0x9aa78f, eyeColor = 0x111111, clawColor = 0x1a1a1a, scale = 1, } = options;
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const clawMat = new THREE.MeshStandardMaterial({ color: clawColor, flatShading: true });
    const raptor = new THREE.Group();
    // ------------------------------------------------------------
    // TORSO — lean, forward-tilted
    // ------------------------------------------------------------
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.6), bodyMat);
    torso.position.set(0, 1.35, 0);
    raptor.add(torso);
    const belly = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.30, 0.55), bellyMat);
    belly.position.set(0, -0.28, 0);
    torso.add(belly);
    // ------------------------------------------------------------
    // NECK + HEAD
    // ------------------------------------------------------------
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), bodyMat);
    neck.position.set(1.05, 1.55, 0);
    raptor.add(neck);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.35, 0.35), bodyMat);
    head.position.set(1.55, 1.60, 0);
    raptor.add(head);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.28), bodyMat);
    snout.position.set(0.30, -0.05, 0);
    head.add(snout);
    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(-0.10, 0.08, 0.18);
    eyeR.position.set(-0.10, 0.08, -0.18);
    head.add(eyeL, eyeR);
    // ------------------------------------------------------------
    // ARMS — small graspers
    // ------------------------------------------------------------
    function makeArm(side) {
        const arm = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.18), bodyMat);
        upper.position.set(0, -0.18, 0);
        const fore = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.30, 0.16), bodyMat);
        fore.position.set(0, -0.26, 0);
        upper.add(fore);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.18), bodyMat);
        hand.position.set(0, -0.22, 0);
        fore.add(hand);
        arm.add(upper);
        arm.position.set(0.55, 1.45, 0.30 * side);
        arm.rotation.z = side * 0.35;
        return arm;
    }
    raptor.add(makeArm(1));
    raptor.add(makeArm(-1));
    // ------------------------------------------------------------
    // LEGS — digitigrade with sickle claw
    // ------------------------------------------------------------
    function makeLeg(side) {
        const leg = new THREE.Group();
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.75, 0.35), bodyMat);
        thigh.position.set(0, -0.38, 0);
        const shin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.70, 0.28), bodyMat);
        shin.position.set(0, -0.60, -0.05);
        thigh.add(shin);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.20, 0.30), bodyMat);
        foot.position.set(0.10, -0.45, 0);
        shin.add(foot);
        // Sickle claw
        const claw = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.35, 0.10), clawMat);
        claw.position.set(0.28, -0.10, 0.10);
        claw.rotation.z = Math.PI / 4;
        foot.add(claw);
        leg.add(thigh);
        leg.position.set(-0.35, 0.75, 0.40 * side);
        return leg;
    }
    raptor.add(makeLeg(1));
    raptor.add(makeLeg(-1));
    // ------------------------------------------------------------
    // TAIL — long, stiff, balancing
    // ------------------------------------------------------------
    const tailSegments = [];
    const tailCount = 6;
    for (let i = 0; i < tailCount; i++) {
        const t = i / (tailCount - 1);
        const seg = new THREE.Mesh(new THREE.BoxGeometry(THREE.MathUtils.lerp(0.8, 0.25, t), THREE.MathUtils.lerp(0.35, 0.18, t), THREE.MathUtils.lerp(0.35, 0.18, t)), bodyMat);
        seg.position.set(-1.0 - i * 0.45, 1.35, 0);
        raptor.add(seg);
        tailSegments.push(seg);
    }
    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    raptor.scale.set(scale, scale, scale);
    raptor.userData = {
        tailSegments,
    };
    return raptor;
}
