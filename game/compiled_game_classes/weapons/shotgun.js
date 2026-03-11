export function shotgun() {
    const group = new THREE.Group();
    // -------------------------
    // MATERIALS
    // -------------------------
    const metalMat = new THREE.MeshPhongMaterial({ color: 0x2b2b2b });
    const woodMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    // -------------------------
    // BARREL (long & thick)
    // -------------------------
    const barrelGeo = new THREE.BoxGeometry(5.2, 0.6, 0.6);
    const barrel = new THREE.Mesh(barrelGeo, metalMat);
    barrel.position.set(2.6, 0.7, 0);
    group.add(barrel);
    // -------------------------
    // TOP RIB
    // -------------------------
    const ribGeo = new THREE.BoxGeometry(4.6, 0.2, 0.4);
    const rib = new THREE.Mesh(ribGeo, metalMat);
    rib.position.set(2.7, 1.05, 0);
    group.add(rib);
    // -------------------------
    // RECEIVER (center block)
    // -------------------------
    const receiverGeo = new THREE.BoxGeometry(1.2, 0.9, 0.8);
    const receiver = new THREE.Mesh(receiverGeo, metalMat);
    receiver.position.set(0.9, 0.6, 0);
    group.add(receiver);
    // -------------------------
    // STOCK (wooden back)
    // -------------------------
    const stockGeo = new THREE.BoxGeometry(1.8, 1.1, 0.7);
    const stock = new THREE.Mesh(stockGeo, woodMat);
    stock.position.set(-0.8, 0.2, 0);
    stock.rotation.z = -Math.PI / 14;
    group.add(stock);
    // -------------------------
    // GRIP
    // -------------------------
    const gripGeo = new THREE.BoxGeometry(0.6, 1.5, 0.6);
    const grip = new THREE.Mesh(gripGeo, woodMat);
    grip.position.set(0.3, -0.8, 0);
    grip.rotation.z = -Math.PI / 10;
    group.add(grip);
    // -------------------------
    // TRIGGER GUARD
    // -------------------------
    const guardGeo = new THREE.TorusGeometry(0.35, 0.08, 6, 12, Math.PI);
    const guard = new THREE.Mesh(guardGeo, metalMat);
    guard.position.set(0.7, -0.2, 0);
    guard.rotation.z = Math.PI / 2;
    group.add(guard);
    // -------------------------
    // TRIGGER
    // -------------------------
    const triggerGeo = new THREE.BoxGeometry(0.15, 0.4, 0.1);
    const trigger = new THREE.Mesh(triggerGeo, metalMat);
    trigger.position.set(0.75, -0.35, 0);
    group.add(trigger);
    // -------------------------
    // FINAL ORIENTATION
    // -------------------------
    group.rotation.z = Math.PI / 2;
    group.rotation.x = Math.PI / 10;
    group.position.set(-0.5, 0, -0.05);
    return group;
}
