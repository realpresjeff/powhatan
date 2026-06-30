export function rifle() {
    const group = new THREE.Group();

    // -------------------------
    // MATERIALS
    // -------------------------
    const metalMat = new THREE.MeshPhongMaterial({ color: 0x3a3a3a });
    const darkMetal = new THREE.MeshPhongMaterial({ color: 0x2a2a2a });
    const gripMat = new THREE.MeshPhongMaterial({ color: 0x4a4a4a });

    // -------------------------
    // BARREL
    // -------------------------
    const barrelGeo = new THREE.BoxGeometry(6.2, 0.45, 0.45);
    const barrel = new THREE.Mesh(barrelGeo, metalMat);
    barrel.position.set(3.2, 0.8, 0);
    group.add(barrel);

    // -------------------------
    // MUZZLE
    // -------------------------
    const muzzleGeo = new THREE.BoxGeometry(0.6, 0.5, 0.5);
    const muzzle = new THREE.Mesh(muzzleGeo, darkMetal);
    muzzle.position.set(6.6, 0.8, 0);
    group.add(muzzle);

    // -------------------------
    // RECEIVER
    // -------------------------
    const receiverGeo = new THREE.BoxGeometry(2.2, 1.2, 0.9);
    const receiver = new THREE.Mesh(receiverGeo, metalMat);
    receiver.position.set(1.6, 0.5, 0);
    group.add(receiver);

    // -------------------------
    // CARRY HANDLE / TOP RAIL
    // -------------------------
    const handleGeo = new THREE.BoxGeometry(1.8, 0.4, 0.6);
    const handle = new THREE.Mesh(handleGeo, darkMetal);
    handle.position.set(1.6, 1.2, 0);
    group.add(handle);

    // -------------------------
    // STOCK
    // -------------------------
    const stockGeo = new THREE.BoxGeometry(2.0, 1.0, 0.7);
    const stock = new THREE.Mesh(stockGeo, darkMetal);
    stock.position.set(-0.8, 0.4, 0);
    stock.rotation.z = -Math.PI / 18;
    group.add(stock);

    // -------------------------
    // GRIP
    // -------------------------
    const gripGeo = new THREE.BoxGeometry(0.6, 1.6, 0.6);
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(1.1, -0.9, 0);
    grip.rotation.z = -Math.PI / 12;
    group.add(grip);

    // -------------------------
    // MAGAZINE
    // -------------------------
    const magGeo = new THREE.BoxGeometry(0.7, 1.9, 0.55);
    const mag = new THREE.Mesh(magGeo, darkMetal);
    mag.position.set(1.8, -1.4, 0);
    mag.rotation.z = Math.PI / 18;
    group.add(mag);

    // -------------------------
    // TRIGGER GUARD
    // -------------------------
    const guardGeo = new THREE.TorusGeometry(0.35, 0.08, 6, 12, Math.PI);
    const guard = new THREE.Mesh(guardGeo, darkMetal);
    guard.position.set(1.4, -0.3, 0);
    guard.rotation.z = Math.PI / 2;
    group.add(guard);

    // -------------------------
    // TRIGGER
    // -------------------------
    const triggerGeo = new THREE.BoxGeometry(0.15, 0.4, 0.1);
    const trigger = new THREE.Mesh(triggerGeo, darkMetal);
    trigger.position.set(1.45, -0.55, 0);
    group.add(trigger);

    // -------------------------
    // FINAL ORIENTATION (matches shotgun/pistol)
    // -------------------------
    // group.rotation.z = Math.PI / 2;
    // group.rotation.x = Math.PI / 10;
    group.rotation.y = -9.5;
    group.position.set(-0.6, 0, -0.05);

    return group;
}