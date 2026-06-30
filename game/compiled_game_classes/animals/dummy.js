export function createDummyModel(data, race = "European") {
    const humanGroup = new THREE.Group();
    const skinColors = {
        "Indian": 0x8d5524,
        "African": 0x3d1e10,
        "European": 0xffdbac,
        "Zambo": 0x5c3a1e,
        "Mestizo": 0xc68642,
        "Pardo": 0x9c7248,
        "Mulatto": 0xaf6e51
    };
    // Body Material
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: skinColors[race] });
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), bodyMaterial);
    body.userData = data;
    body.position.set(0, 1, 0);
    humanGroup.add(body);
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5), bodyMaterial);
    head.userData = data;
    head.position.set(0, 2.5, 0);
    humanGroup.add(head);
    // Arms
    for (let i = -1; i <= 1; i += 2) {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), bodyMaterial);
        arm.position.set(i * 0.6, 1.75, 0);
        humanGroup.add(arm);
    }
    // Legs
    for (let i = -1; i <= 1; i += 2) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), bodyMaterial);
        leg.position.set(i * 0.3, 0, 0);
        humanGroup.add(leg);
    }
    // humanGroup.position.set(this.position.x, this.position.y, this.position.z);
    return humanGroup;
}
