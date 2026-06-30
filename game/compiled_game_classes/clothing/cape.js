export function cape(color = 0x552200) {
    const capeGroup = new THREE.Group();
    const capeMaterial = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
        side: THREE.DoubleSide
    });
    // Main cape panel
    const cape = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.0, 0.05), capeMaterial);
    // Your torso is thick — push cape outward
    cape.position.set(0, -1.8, -1.8);
    cape.rotation.x = 0.25;
    capeGroup.add(cape);
    // Collar piece
    const collar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.1), capeMaterial);
    collar.position.set(0, .3, -1.4); // ALSO push collar back
    capeGroup.add(collar);
    // Final positioning relative to torso root
    capeGroup.position.set(0, 0.8, 0);
    this.base.add(capeGroup);
    this.cape = capeGroup;
}
