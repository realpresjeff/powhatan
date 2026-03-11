export function warhammer() {
    const group = new THREE.Group();
    // ─── Materials ───────────────────────────
    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x6b4a2b,
        roughness: 0.9
    });
    const wrapMat = new THREE.MeshStandardMaterial({
        color: 0x4a3a2a,
        roughness: 1
    });
    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.85,
        roughness: 0.35
    });
    // ─── Handle ──────────────────────────────
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.6, 10), woodMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.x = -1.6;
    group.add(handle);
    // ─── Wrapped Grip ────────────────────────
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.6, 10), wrapMat);
    grip.rotation.z = Math.PI / 2;
    grip.position.x = -2.7;
    group.add(grip);
    // ─── End Ring ────────────────────────────
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 8, 16), metalMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -3.4;
    group.add(ring);
    // ─── Hammer Head ─────────────────────────
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 1.1), metalMat);
    head.position.x = 0.4;
    group.add(head);
    // ─── Reinforcement Bands ─────────────────
    const bandGeo = new THREE.BoxGeometry(1.35, 0.15, 1.15);
    const bandTop = new THREE.Mesh(bandGeo, metalMat);
    bandTop.position.set(0.4, 0.55, 0);
    group.add(bandTop);
    const bandBottom = bandTop.clone();
    bandBottom.position.y = -0.55;
    group.add(bandBottom);
    // ─── Spikes ──────────────────────────────
    const spikeGeo = new THREE.ConeGeometry(0.18, 0.45, 6);
    const spikeOffsets = [
        [0.9, 0.4, 0],
        [0.9, -0.4, 0],
        [0.9, 0, 0.4],
        [0.9, 0, -0.4]
    ];
    spikeOffsets.forEach(([x, y, z]) => {
        const spike = new THREE.Mesh(spikeGeo, metalMat);
        spike.rotation.z = -Math.PI / 2;
        spike.position.set(x, y, z);
        group.add(spike);
    });
    // ─── Final Tuning ────────────────────────
    group.scale.set(0.85, 0.85, 0.85);
    group.rotation.y = Math.PI / 2;
    group.traverse(m => {
        if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
        }
    });
    return group;
}
