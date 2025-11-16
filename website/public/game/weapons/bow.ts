export function bow() {
    // Bow materials
    const bowWood = new THREE.MeshPhongMaterial({ color: 0x7b4a12 });
    const bowStringMat = new THREE.MeshPhongMaterial({ color: 0xcccccc });

    // Bow curve shape
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-2, 0, 0),   // start
        new THREE.Vector3(0, 2.5, 0),  // control (curve height)
        new THREE.Vector3(2, 0, 0)     // end
    );

    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
    const bowMesh = new THREE.Mesh(tubeGeo, bowWood);

    // Bowstring
    const stringGeo = new THREE.BufferGeometry();
    const stringVertices = new Float32Array([
        -2, 0, 0,
        0, 2.3, 0,
        2, 0, 0
    ]);
    stringGeo.setAttribute('position', new THREE.BufferAttribute(stringVertices, 3));
    const stringLine = new THREE.Line(stringGeo, new THREE.LineBasicMaterial({ color: 0xffffff }));

    // Group
    const group = new THREE.Group();
    group.add(bowMesh);
    group.add(stringLine);

    // Optional handle wrap
    const handleGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
    const handle = new THREE.Mesh(handleGeo, steelMaterial);
    handle.position.set(0, 0, 0);
    group.add(handle);

    // Final position and rotation (similar to other weapons)
    group.rotation.z = Math.PI / 2;
    group.rotation.x = Math.PI / 8;
    group.position.set(-0.5, 0, -0.05);

    return group;
}
