export function axe() {
    const group = new THREE.Group();

    // ----------------------------------------
    // MATERIALS
    // ----------------------------------------
    const woodMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    const steelMat = new THREE.MeshPhongMaterial({ color: 0xbfc7cc });

    // ----------------------------------------
    // HANDLE
    // ----------------------------------------
    const handleGeo = new THREE.BoxGeometry(0.45, 3.8, 0.45);
    const handle = new THREE.Mesh(handleGeo, woodMat);
    handle.position.set(0, -1.2, 0);
    handle.castShadow = true;
    group.add(handle);

    // ----------------------------------------
    // AXE HEAD (main body)
    // ----------------------------------------
    const headCoreGeo = new THREE.BoxGeometry(1.2, 1.2, 0.8);
    const headCore = new THREE.Mesh(headCoreGeo, steelMat);
    headCore.position.set(0, 0.6, 0);
    headCore.castShadow = true;
    group.add(headCore);

    // ----------------------------------------
    // BLADE (front flare)
    // ----------------------------------------
    const bladeGeo = new THREE.BoxGeometry(1.8, 1.6, 0.25);
    const blade = new THREE.Mesh(bladeGeo, steelMat);
    blade.position.set(0.9, 0.6, 0);
    blade.rotation.z = -Math.PI / 12;
    blade.castShadow = true;
    group.add(blade);

    // ----------------------------------------
    // BACK SPIKE / COUNTERWEIGHT
    // ----------------------------------------
    const backGeo = new THREE.BoxGeometry(0.6, 0.6, 0.4);
    const back = new THREE.Mesh(backGeo, steelMat);
    back.position.set(-0.7, 0.6, 0);
    back.castShadow = true;
    group.add(back);

    // ----------------------------------------
    // FINAL ORIENTATION (matches your weapons)
    // ----------------------------------------
    group.rotation.x = 8;
    group.rotation.z = -Math.PI / 2;
    // group.position.set(-0.5, 0, -0.05);

    group.position.set(1.8, -1.5, 0.10);

    return group;
}