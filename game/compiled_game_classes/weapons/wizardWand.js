export function wizardWand() {
    const group = new THREE.Group();
    // ----------------------------------------
    // MATERIALS
    // ----------------------------------------
    const woodMat = new THREE.MeshPhongMaterial({ color: 0x5a2b18 });
    const gemMat = new THREE.MeshPhongMaterial({ color: 0xcc4433, emissive: 0x551100 });
    // ----------------------------------------
    // HANDLE (long rectangle)
    // ----------------------------------------
    const handleGeo = new THREE.BoxGeometry(0.3, 3.8, 0.3);
    const handle = new THREE.Mesh(handleGeo, woodMat);
    handle.position.set(0, -1.2, 0);
    group.add(handle);
    // ----------------------------------------
    // TIP (square gem)
    // ----------------------------------------
    const tipGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const tip = new THREE.Mesh(tipGeo, gemMat);
    tip.position.set(0, 1.2, 0);
    tip.castShadow = true;
    group.add(tip);
    // Slight bevel / frame around gem
    const frameGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const frame = new THREE.Mesh(frameGeo, woodMat);
    frame.position.set(0, 1.2, 0);
    group.add(frame);
    // ----------------------------------------
    // FINAL ORIENTATION (matches other weapons)
    // ----------------------------------------
    group.position.set(-2, 0, -3);
    group.rotation.x = -6;
    return group;
}
