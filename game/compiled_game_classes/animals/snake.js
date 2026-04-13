export function createSnakeModel(options = {}) {
    const { bodyColor = 0x4f7a3d, // green snake
    bellyColor = 0x9bbf7a, eyeColor = 0x111111, tongueColor = 0xb02020, scale = 1, } = options;
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const tongueMat = new THREE.MeshStandardMaterial({ color: tongueColor, flatShading: true });
    const snake = new THREE.Group();
    // ------------------------------------------------------------
    // HEAD — wedge-like snake head (faces +X)
    // ------------------------------------------------------------
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.22, 0.28), bodyMat);
    head.position.set(0.25, 0.20, 0);
    snake.add(head);
    // Jaw / snout
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.16, 0.22), bodyMat);
    snout.position.set(0.25, -0.03, 0);
    head.add(snout);
    // Eyes — aligned with head & torso
    const eyeGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.10, 0.08, 0.14);
    eyeR.position.set(0.10, 0.08, -0.14);
    head.add(eyeL, eyeR);
    // Tongue (optional, simple fork)
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.02), tongueMat);
    tongue.position.set(0.38, -0.02, 0);
    head.add(tongue);
    // ------------------------------------------------------------
    // BODY — segmented for easy slither animation
    // ------------------------------------------------------------
    const segments = [];
    const segmentCount = 10;
    const segmentLength = 0.35;
    for (let i = 0; i < segmentCount; i++) {
        const t = i / (segmentCount - 1); // 0 → 1
        const width = THREE.MathUtils.lerp(0.30, 0.12, t);
        const height = THREE.MathUtils.lerp(0.22, 0.10, t);
        const segment = new THREE.Mesh(new THREE.BoxGeometry(segmentLength, height, width), bodyMat);
        segment.position.set(-i * segmentLength, 0.18, 0);
        snake.add(segment);
        segments.push(segment);
        // Belly plate
        const belly = new THREE.Mesh(new THREE.BoxGeometry(segmentLength * 0.9, height * 0.4, width * 0.9), bellyMat);
        belly.position.set(0, -height * 0.3, 0);
        segment.add(belly);
    }
    // ------------------------------------------------------------
    // TIP TAIL — small taper
    // ------------------------------------------------------------
    const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.08, 0.08), bodyMat);
    tailTip.position.set(-segmentCount * segmentLength - 0.10, 0.18, 0);
    snake.add(tailTip);
    // ------------------------------------------------------------
    // Final transform
    // ------------------------------------------------------------
    snake.scale.set(scale, scale, scale);
    // Expose segments for animation
    snake.userData.segments = segments;
    return snake;
}
