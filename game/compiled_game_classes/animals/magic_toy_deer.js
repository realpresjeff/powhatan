export function createMagicToyDeerModel() {
    const deerGroup = new THREE.Mesh();
    const deerData = { attackable: true, name: "Magic Toy Deer", stats: this.stats, takeDamage: this.takeDamage, monster: this };
    deerGroup.userData = deerData;
    // Body (Simplified)
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: "brown" });
    bodyMaterial.userData = deerData;
    const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 1), bodyMaterial);
    body.userData = deerData;
    body.position.set(0, 1, 0);
    deerGroup.add(body);
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMaterial);
    head.userData = deerData;
    head.position.set(1.5, 1.5, 0);
    deerGroup.add(head);
    // Legs
    const legMaterial = new THREE.MeshStandardMaterial({ color: "darkbrown" });
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), legMaterial);
        leg.position.set(i < 2 ? -1 : 1, 0, i % 2 === 0 ? -0.5 : 0.5);
        deerGroup.add(leg);
    }
    deerGroup.position.set(this.position.x, this.position.y, this.position.z);
    return deerGroup;
}
