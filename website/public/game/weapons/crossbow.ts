export function crossbow() {
    const steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
    const group = new THREE.Group();

    // --------------------------------------------------
    // MATERIALS
    // --------------------------------------------------
    const woodMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    const metalMat = new THREE.MeshPhongMaterial({ color: 0xb0b0b0 });
    const stringMat = new THREE.LineBasicMaterial({ color: 0xe6c78c });

    // --------------------------------------------------
    // HANDLE (tapered cylinder)
    // --------------------------------------------------
    const handleGeo = new THREE.CylinderGeometry(0.22, 0.30, 3.2, 10);
    const handle = new THREE.Mesh(handleGeo, woodMat);
    handle.position.set(0, -1.2, 0);
    group.add(handle);

    // --------------------------------------------------
    // BLADE CURVE SHAPE
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
    // BOWSTRING (new)
    // --------------------------------------------------
    const stringGeo = new THREE.BufferGeometry();
    const verts = new Float32Array([
        // left tip
        -0.05, 0.2, 2.1,
        // center pull point (slightly back)
        0.0, 0.15, 0.0,
        // right tip
        -0.05, 0.2, -2.1
    ]);

    stringGeo.setAttribute("position", new THREE.BufferAttribute(verts, 3));

    const string = new THREE.Line(stringGeo, stringMat);
    group.add(string);

    // --------------------------------------------------
    // FINAL ORIENTATION
    // --------------------------------------------------
    group.rotation.z = Math.PI / 2;
    group.rotation.x = Math.PI / 8;
    group.position.set(-3.0, 0, -0.05);

    return group;
}
