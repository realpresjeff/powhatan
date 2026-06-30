export function hammer() {
    const group = new THREE.Group();
    // ─── Materials ───────────────────────────
    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x6a4a2f,
        roughness: 0.9
    });
    const wrapMat = new THREE.MeshStandardMaterial({
        color: 0x4a3a2a,
        roughness: 1
    });
    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.85,
        roughness: 0.35
    });
    // ─── Handle ──────────────────────────────
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 3.4, 10), woodMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.x = -1.5;
    group.add(handle);
    // ─── Wrapped Grip ────────────────────────
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.4, 10), wrapMat);
    grip.rotation.z = Math.PI / 2;
    grip.position.x = -2.6;
    group.add(grip);
    // ─── End Ring ────────────────────────────
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 16), metalMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -3.2;
    group.add(ring);
    // ─── Cord (simple knot) ──────────────────
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6), wrapMat);
    cord.rotation.z = Math.PI / 2;
    cord.position.set(-3.45, -0.15, 0);
    group.add(cord);
    // ─── Hammer Head ─────────────────────────
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.9), metalMat);
    head.position.x = 0.4;
    group.add(head);
    // ─── Collar Between Head & Handle ────────
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.35, 10), metalMat);
    collar.rotation.z = Math.PI / 2;
    collar.position.x = -0.15;
    group.add(collar);
    // ─── Final Adjustments ───────────────────
    group.scale.set(0.9, 0.9, 0.9);
    group.rotation.y = Math.PI / 2;
    group.traverse(m => {
        if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
        }
    });
    return group;
}
