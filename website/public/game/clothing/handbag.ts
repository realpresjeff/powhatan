export function handBag() {
    if (!this.leftArm || !this.leftArm.forearm) return;

    if (!this.equipment) this.equipment = {};
    if (this.equipment.handbag) {
        this.leftArm.forearm.remove(this.equipment.handbag);
    }

    const bag = new THREE.Group();

    // Bag body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.4, 0.8),
        this.materialDarkest
    );
    body.position.set(0.6, -0.2, 0.3);
    bag.add(body);

    // Handle
    const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI),
        this.materialDark
    );
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0.6, 0.6, 0.3);
    bag.add(handle);

    // Attach to LEFT forearm
    bag.position.set(1.0, -0.3, 0.4);
    bag.rotation.z = Math.PI / 2;

    this.rightArm.forearm.add(bag);
    this.equipment.handbag = bag;
}