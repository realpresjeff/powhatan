export function pickaxe() {
    const steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
    const group = new THREE.Group();

    // --------------------------------------------------
    // MATERIALS
    // --------------------------------------------------
    const woodMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    const metalMat = new THREE.MeshPhongMaterial({ color: 0xb0b0b0 });

    // --------------------------------------------------
    // HANDLE (slightly tapered cylinder)
    // --------------------------------------------------
    const handleGeo = new THREE.CylinderGeometry(0.22, 0.30, 3.2, 10);
    const handle = new THREE.Mesh(handleGeo, woodMat);
    handle.position.set(0, -1.2, 0);
    group.add(handle);

    // --------------------------------------------------
    // CENTER HEAD BLOCK
    // --------------------------------------------------
    const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const head = new THREE.Mesh(headGeo, steelMaterial);
    head.position.set(0, 0.2, 0);
    group.add(head);

    // --------------------------------------------------
    // BLADE CURVE SHAPE (Bezier → TubeGeometry)
    // --------------------------------------------------
    const bladeCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1.2, 0.45, 0),
        new THREE.Vector3(2.1, 0.0, 0)
    );

    const bladeGeo = new THREE.TubeGeometry(bladeCurve, 20, 0.12, 8, false);
    const bladeMesh = new THREE.Mesh(bladeGeo, metalMat);

    // --------------------------------------------------
    // LEFT BLADE
    // --------------------------------------------------
    const leftBlade = bladeMesh.clone();
    leftBlade.rotation.y = Math.PI / 2;
    leftBlade.position.set(0, 0.2, 0.05);
    group.add(leftBlade);

    // --------------------------------------------------
    // RIGHT BLADE (mirrored)
    // --------------------------------------------------
    const rightBlade = bladeMesh.clone();
    rightBlade.rotation.y = -Math.PI / 2;
    rightBlade.position.set(0, 0.2, -0.05);
    group.add(rightBlade);

    // --------------------------------------------------
    // FINAL WEAPON ORIENTATION (matches bow)
    // --------------------------------------------------
    group.rotation.z = -Math.PI / 2;
    group.rotation.x = Math.PI / 8;
    group.position.set(1.8, -1.5, -0.05);

    return group;
}
