export function addHoodedCloak(color = 0x4b295f, trimColor = 0x2a123a, gemColor = 0xaa0033) {
    const cloak = new THREE.Group();
    const mat = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
        side: THREE.DoubleSide
    });
    const trimMat = new THREE.MeshPhongMaterial({
        color: trimColor,
        flatShading: true
    });
    const gemMat = new THREE.MeshPhongMaterial({
        color: gemColor,
        flatShading: true
    });
    // --------------------------------------------------
    // 1. HOOD (outer shell)
    // --------------------------------------------------
    const hoodOuter = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.4, 2.2), mat);
    hoodOuter.position.set(0, 2.8, 0.3);
    hoodOuter.scale.set(1.15, 1.0, 1.1);
    cloak.add(hoodOuter);
    // Inner cavity so face is visible
    const hoodInner = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 1.1), new THREE.MeshPhongMaterial({ color: 0x000000 }));
    hoodInner.position.set(0, 2.7, 1.1);
    cloak.add(hoodInner);
    // --------------------------------------------------
    // 2. CAPE FRONT PANELS (two halves)
    // --------------------------------------------------
    const frontShape = new THREE.Shape();
    frontShape.moveTo(0, 2.0);
    frontShape.bezierCurveTo(0.9, 1.2, 1.4, -0.8, 1.2, -3.2);
    frontShape.lineTo(0, -3.6);
    const frontGeo = new THREE.ExtrudeGeometry(frontShape, {
        depth: 0.4,
        bevelEnabled: false
    });
    const frontLeft = new THREE.Mesh(frontGeo, mat);
    frontLeft.position.set(-1.0, -0.5, 0.7);
    cloak.add(frontLeft);
    const frontRight = frontLeft.clone();
    frontRight.position.set(1.0, -0.5, 0.7);
    frontRight.scale.x = -1;
    cloak.add(frontRight);
    // --------------------------------------------------
    // 3. BACK CLOAK (wide & flowing)
    // --------------------------------------------------
    const backShape = new THREE.Shape();
    backShape.moveTo(-2.5, 2.2);
    backShape.bezierCurveTo(-3.5, 0.0, -3.3, -2.8, 0, -3.8);
    backShape.bezierCurveTo(3.3, -2.8, 3.5, 0.0, 2.5, 2.2);
    const backGeo = new THREE.ExtrudeGeometry(backShape, {
        depth: 0.6,
        bevelEnabled: false
    });
    const back = new THREE.Mesh(backGeo, mat);
    back.position.set(0, -0.4, -1.3);
    cloak.add(back);
    // --------------------------------------------------
    // 4. SHOULDER WRAPS (rounded)
    // --------------------------------------------------
    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 1.2), mat);
    const leftShoulder = shoulder.clone();
    leftShoulder.position.set(2.0, 1.4, -0.1);
    leftShoulder.rotation.z = Math.PI / 20;
    cloak.add(leftShoulder);
    const rightShoulder = shoulder.clone();
    rightShoulder.position.set(-2.0, 1.4, -0.1);
    rightShoulder.rotation.z = -Math.PI / 20;
    cloak.add(rightShoulder);
    // --------------------------------------------------
    // 5. CLOAK GEM / CLASP
    // --------------------------------------------------
    const gem = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), gemMat);
    gem.position.set(0, 1.0, 1.1);
    cloak.add(gem);
    // --------------------------------------------------
    // APPLY POSITION
    // --------------------------------------------------
    cloak.position.set(0, 0.3, 0);
    this.base.add(cloak);
    this.mysticCloak = cloak;
}
