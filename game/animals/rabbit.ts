export function createRabbitModel(options: {
    furColor?: number;
    bellyColor?: number;
    earInnerColor?: number;
    eyeColor?: number;
    noseColor?: number;
    pawColor?: number;
    scale?: number;
} = {}) {
    const {
        furColor = 0xffffff,
        bellyColor = 0xf2f2f2,
        earInnerColor = 0xf0c2c2,
        eyeColor = 0x111111,
        noseColor = 0x222222,
        pawColor = 0x333333,
        scale = 1,
    } = options;

    const furMat = new THREE.MeshStandardMaterial({ color: furColor, flatShading: true });
    const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const noseMat = new THREE.MeshStandardMaterial({ color: noseColor });
    const pawMat = new THREE.MeshStandardMaterial({ color: pawColor });

    const rabbit = new THREE.Group();

    // ============================================================
    // BODY — round and visible
    // ============================================================
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        furMat
    );
    body.position.set(0, 0.6, 0);
    rabbit.add(body);

    // Belly (slightly flattened)
    const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        bellyMat
    );
    belly.position.set(0, 0.4, 0.15);
    belly.scale.set(1, 0.5, 1);
    body.add(belly);

    // ============================================================
    // HEAD — round and cute
    // ============================================================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 16, 16),
        furMat
    );
    head.position.set(0.0, 1.0, 0.25);
    rabbit.add(head);

    // Nose
    const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        noseMat
    );
    nose.position.set(0, -0.05, 0.32);
    head.add(nose);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.06, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);

    leftEye.position.set(0.15, 0.05, 0.26);
    rightEye.position.set(-0.15, 0.05, 0.26);

    head.add(leftEye, rightEye);

    // ============================================================
    // EARS — tall, clear, visible
    // ============================================================
    const earOuterGeom = new THREE.BoxGeometry(0.22, 0.80, 0.15);
    const earInnerGeom = new THREE.BoxGeometry(0.12, 0.70, 0.10);

    function makeEar(x: number) {
        const ear = new THREE.Group();

        const outer = new THREE.Mesh(earOuterGeom, furMat);
        const inner = new THREE.Mesh(earInnerGeom, earInnerMat);

        inner.position.set(0, -0.02, 0.01);

        ear.add(outer);
        outer.add(inner);

        ear.position.set(x, 1.35, 0.1);
        ear.rotation.x = -0.25;

        return ear;
    }

    const leftEar = makeEar(0.18);
    const rightEar = makeEar(-0.18);

    rabbit.add(leftEar, rightEar);

    // ============================================================
    // LEGS — small, simple, visible
    // ============================================================
    function makeLeg(x: number, z: number) {
        const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.30, 0.22),
            pawMat
        );
        leg.position.set(x, 0.25, z);
        return leg;
    }

    rabbit.add(makeLeg(0.30, 0.10));  // front left
    rabbit.add(makeLeg(-0.30, 0.10)); // front right
    rabbit.add(makeLeg(0.30, -0.05)); // back left
    rabbit.add(makeLeg(-0.30, -0.05)); // back right

    // ============================================================
    // TAIL — visible puff
    // ============================================================
    const tail = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        furMat
    );
    tail.position.set(0, 0.65, -0.45);
    rabbit.add(tail);

    rabbit.scale.set(scale, scale, scale);
    return rabbit;
}
