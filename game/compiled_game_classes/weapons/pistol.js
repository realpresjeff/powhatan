export function pistol() {
    const group = new THREE.Group();
    // -------------------------
    // MATERIALS
    // -------------------------
    const metalMat = new THREE.MeshPhongMaterial({ color: 0x2e2e2e });
    const gripMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    // -------------------------
    // BARREL
    // -------------------------
    const barrelGeo = new THREE.BoxGeometry(3.2, 0.5, 0.6);
    const barrel = new THREE.Mesh(barrelGeo, metalMat);
    barrel.position.set(1.6, 0.6, 0);
    group.add(barrel);
    // -------------------------
    // SLIDE (top)
    // -------------------------
    const slideGeo = new THREE.BoxGeometry(2.8, 0.4, 0.55);
    const slide = new THREE.Mesh(slideGeo, metalMat);
    slide.position.set(1.5, 0.9, 0);
    group.add(slide);
    // -------------------------
    // HANDLE / GRIP
    // -------------------------
    const gripGeo = new THREE.BoxGeometry(0.7, 1.8, 0.6);
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(0.2, -0.6, 0);
    grip.rotation.z = -Math.PI / 12;
    group.add(grip);
    // -------------------------
    // TRIGGER GUARD
    // -------------------------
    const triggerGuardGeo = new THREE.TorusGeometry(0.35, 0.08, 6, 12, Math.PI);
    const triggerGuard = new THREE.Mesh(triggerGuardGeo, metalMat);
    triggerGuard.position.set(0.7, -0.1, 0);
    triggerGuard.rotation.z = Math.PI / 2;
    group.add(triggerGuard);
    // -------------------------
    // TRIGGER
    // -------------------------
    const triggerGeo = new THREE.BoxGeometry(0.15, 0.4, 0.1);
    const trigger = new THREE.Mesh(triggerGeo, metalMat);
    trigger.position.set(0.75, -0.2, 0);
    group.add(trigger);
    // -------------------------
    // FINAL ORIENTATION (match sword/bow)
    // -------------------------
    group.rotation.z = Math.PI / 2;
    group.rotation.x = Math.PI / 10;
    group.position.set(-0.4, 0, -0.05);
    return group;
}
