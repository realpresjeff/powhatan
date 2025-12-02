// createWolfModel.ts
// Assumes THREE is available or imported.

export function createWolfModel(options: {
    coatColor?: number;
    legColor?: number;
    muzzleColor?: number;
    earInnerColor?: number;
    eyeColor?: number;
    scale?: number;
} = {}) {
    const {
        coatColor = 0x666666,
        legColor = 0x444444,
        muzzleColor = 0xbbbbbb,
        earInnerColor = 0xaa8888,
        eyeColor = 0x222222,
        scale = 1,
    } = options;

    const wolf = new THREE.Group();

    const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, flatShading: true });
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, flatShading: true });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: muzzleColor, flatShading: true });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: earInnerColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, flatShading: true });

    // BODY (torso)
    const bodyGeom = new THREE.BoxGeometry(2.0, 0.6, 0.6);
    const body = new THREE.Mesh(bodyGeom, coatMat);
    body.position.set(0, 0.8, 0);
    body.castShadow = body.receiveShadow = true;
    wolf.add(body);

    // NECK / CHEST
    const neckGeom = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const neck = new THREE.Mesh(neckGeom, coatMat);
    neck.position.set(0.8, 0.95, 0);
    neck.castShadow = neck.receiveShadow = true;
    wolf.add(neck);

    // HEAD
    const headGeom = new THREE.BoxGeometry(0.7, 0.45, 0.45);
    const head = new THREE.Mesh(headGeom, coatMat);
    head.position.set(1.2, 1.0, 0);
    head.castShadow = head.receiveShadow = true;
    wolf.add(head);

    // MUZZLE
    const muzzleGeom = new THREE.BoxGeometry(0.5, 0.28, 0.28);
    const muzzle = new THREE.Mesh(muzzleGeom, muzzleMat);
    muzzle.position.set(0.35, 0, 0);
    head.add(muzzle);

    // NOSE
    const noseGeom = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, flatShading: true });
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0.18, 0, 0);
    muzzle.add(nose);

    // EARS
    const earOuterGeom = new THREE.BoxGeometry(0.16, 0.3, 0.1);
    const earInnerGeom = new THREE.BoxGeometry(0.1, 0.22, 0.06);

    const leftEar = new THREE.Mesh(earOuterGeom, coatMat);
    const rightEar = new THREE.Mesh(earOuterGeom, coatMat);
    const leftEarInner = new THREE.Mesh(earInnerGeom, earInnerMat);
    const rightEarInner = new THREE.Mesh(earInnerGeom, earInnerMat);

    leftEar.position.set(0.2, 0.3, 0.18);
    rightEar.position.set(0.2, 0.3, -0.18);
    leftEar.rotation.z = -0.3;
    rightEar.rotation.z = -0.3;

    leftEarInner.position.set(0, 0, 0.03);
    rightEarInner.position.set(0, 0, -0.03);

    leftEar.add(leftEarInner);
    rightEar.add(rightEarInner);
    head.add(leftEar, rightEar);

    // EYES (simple cubes)
    const eyeGeom = new THREE.BoxGeometry(0.06, 0.06, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(0.15, 0.05, 0.19);
    rightEye.position.set(0.15, 0.05, -0.19);
    head.add(leftEye, rightEye);

    // TAIL
    const tailGeom = new THREE.BoxGeometry(0.7, 0.2, 0.2);
    const tail = new THREE.Mesh(tailGeom, coatMat);
    tail.position.set(-1.2, 0.7, 0);
    tail.rotation.z = 0.6;
    tail.castShadow = tail.receiveShadow = true;
    wolf.add(tail);

    // LEGS (upper + lower)
    const upperLegGeom = new THREE.BoxGeometry(0.18, 0.5, 0.18);
    const lowerLegGeom = new THREE.BoxGeometry(0.16, 0.55, 0.16);

    function makeLeg(offsetX: number, offsetZ: number) {
        const group = new THREE.Group();
        const upper = new THREE.Mesh(upperLegGeom, legMat);
        const lower = new THREE.Mesh(lowerLegGeom, legMat);

        group.position.set(offsetX, 0.55, offsetZ);
        upper.position.set(0, -0.25, 0);
        lower.position.set(0, -0.5, 0);

        group.add(upper);
        upper.add(lower);

        upper.castShadow = upper.receiveShadow =
            lower.castShadow = lower.receiveShadow = true;

        return { group, upper, lower };
    }

    const frontLeft = makeLeg(0.7, 0.25);
    const frontRight = makeLeg(0.7, -0.25);
    const backLeft = makeLeg(-0.7, 0.25);
    const backRight = makeLeg(-0.7, -0.25);

    wolf.add(
        frontLeft.group,
        frontRight.group,
        backLeft.group,
        backRight.group
    );

    wolf.scale.set(scale, scale, scale);

    wolf.userData.rig = {
        body,
        neck,
        head,
        muzzle,
        tail,
        leftEar,
        rightEar,
        legs: {
            frontLeft,
            frontRight,
            backLeft,
            backRight,
        },
    };

    return wolf;
}
