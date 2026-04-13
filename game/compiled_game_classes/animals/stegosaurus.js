export function createStegosaurusModel(options = {}) {
    const { bodyColor = 0x6f8b5a, // greenish body
    plateColor = 0xa55c3a, // reddish plates
    bellyColor = 0x9fb58a, eyeColor = 0x111111, scale = 1, } = options;
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const plateMat = new THREE.MeshStandardMaterial({ color: plateColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const stego = new THREE.Group();
    // ------------------------------------------------------------
    // BODY — long, low torso
    // ------------------------------------------------------------
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.1, 1.2), bodyMat);
    body.position.set(0, 1.2, 0);
    stego.add(body);
    // Belly
    const belly = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 1.1), bellyMat);
    belly.position.set(0, -0.35, 0);
    body.add(belly);
    // ------------------------------------------------------------
    // NECK
    // ------------------------------------------------------------
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), bodyMat);
    neck.position.set(1.7, 1.35, 0);
    stego.add(neck);
    // ------------------------------------------------------------
    // HEAD — small (accurate stegosaurus proportion)
    // ------------------------------------------------------------
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.35), bodyMat);
    head.position.set(2.1, 1.35, 0);
    stego.add(head);
    // Snout
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.28), bodyMat);
    snout.position.set(0.28, -0.05, 0);
    head.add(snout);
    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.05, 0.08, 0.20);
    eyeR.position.set(0.05, 0.08, -0.20);
    head.add(eyeL, eyeR);
    // ------------------------------------------------------------
    // BACK PLATES — iconic stegosaurus feature
    // ------------------------------------------------------------
    const plates = [];
    const plateCount = 6;
    for (let i = 0; i < plateCount; i++) {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.80, 0.60), plateMat);
        plate.position.set(-0.8 + i * 0.5, 1.95, i % 2 === 0 ? 0.35 : -0.35 // alternating rows
        );
        stego.add(plate);
        plates.push(plate);
    }
    // ------------------------------------------------------------
    // LEGS — four sturdy legs
    // ------------------------------------------------------------
    function makeLeg(x, z) {
        const leg = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 0.45), bodyMat);
        upper.position.set(0, -0.45, 0);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.55), bodyMat);
        foot.position.set(0, -0.6, 0);
        leg.add(upper);
        upper.add(foot);
        leg.position.set(x, 0.75, z);
        return leg;
    }
    stego.add(makeLeg(1.0, 0.5));
    stego.add(makeLeg(1.0, -0.5));
    stego.add(makeLeg(-1.0, 0.5));
    stego.add(makeLeg(-1.0, -0.5));
    // ------------------------------------------------------------
    // TAIL — long with thagomizer spikes
    // ------------------------------------------------------------
    const tailSegments = [];
    const tailCount = 4;
    for (let i = 0; i < tailCount; i++) {
        const seg = new THREE.Mesh(new THREE.BoxGeometry(THREE.MathUtils.lerp(0.8, 0.3, i / (tailCount - 1)), 0.35, 0.35), bodyMat);
        seg.position.set(-1.8 - i * 0.5, 1.2, 0);
        stego.add(seg);
        tailSegments.push(seg);
    }
    // Thagomizer spikes
    function makeSpike(z) {
        const spike = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), plateMat);
        spike.rotation.z = Math.PI / 4;
        spike.position.set(-3.4, 1.2, z);
        return spike;
    }
    stego.add(makeSpike(0.25));
    stego.add(makeSpike(-0.25));
    stego.add(makeSpike(0.45));
    stego.add(makeSpike(-0.45));
    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    stego.scale.set(scale, scale, scale);
    stego.userData = {
        tailSegments,
        plates,
    };
    return stego;
}
