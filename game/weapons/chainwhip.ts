export function chainWhip() {
    const group = new THREE.Group();

    // ─── Materials ─────────────────────────────
    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x6b4a2b,
        roughness: 0.9
    });

    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.8,
        roughness: 0.4
    });

    // ─── Handle ────────────────────────────────
    const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 2.2, 8),
        woodMat
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.x = -1.2;
    group.add(handle);

    // ─── Chain Links ───────────────────────────
    const linkGeo = new THREE.TorusGeometry(0.18, 0.06, 6, 10);
    let lastX = 0;

    const chainLinks = [];

    for (let i = 0; i < 10; i++) {
        const link = new THREE.Mesh(linkGeo, metalMat);
        link.rotation.y = i % 2 === 0 ? Math.PI / 2 : 0;
        link.position.x = lastX + 0.35;
        lastX = link.position.x;

        chainLinks.push(link);
        group.add(link);
    }

    // ─── Spiked Tips ───────────────────────────
    const spikeGeo = new THREE.ConeGeometry(0.12, 0.45, 6);

    for (let i = 0; i < 3; i++) {
        const spike = new THREE.Mesh(spikeGeo, metalMat);
        spike.rotation.z = Math.PI / 2;
        spike.position.x = lastX + 0.25 + i * 0.2;
        spike.position.y = (i - 1) * 0.15;

        group.add(spike);
    }

    // ─── Final Transform ───────────────────────
    group.scale.set(0.8, 0.8, 0.8);

    group.position.y = -1.5;
    group.position.z = 0.5;

    return group;

    // return {
    //     mesh: group,
    //     chainLinks // keep reference for animation
    // };
}