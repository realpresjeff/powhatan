export function macuahuitl() {
    const group = new THREE.Group();

    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x7a4a1f,
        roughness: 0.9
    });

    const obsidianMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.2,
        metalness: 0.1
    });

    // Handle
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 3, 0.4),
        woodMat
    );
    handle.position.y = -1.5;
    group.add(handle);

    // Blade plank
    const plank = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 4.5, 0.4),
        woodMat
    );
    plank.position.y = 1.2;
    group.add(plank);

    // Obsidian teeth
    for (let i = 0; i < 6; i++) {
        const tooth = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.4, 0.15),
            obsidianMat
        );

        tooth.position.set(
            0.55,
            -0.8 + i * 0.7,
            0
        );
        group.add(tooth);

        const tooth2 = tooth.clone();
        tooth2.position.x = -0.55;
        group.add(tooth2);
    }

    group.scale.set(0.6, 0.6, 0.6);
    return group;
}