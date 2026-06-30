export function bag() {
    if (!this.equipment) this.equipment = {};
    if (this.equipment.bag) {
        this.base.remove(this.equipment.bag);
    }

    const bag = new THREE.Group();

    const bagBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 2.4, 1.2),
        this.materialDarkest
    );
    bagBody.position.set(0, -0.6, -2.4);
    bag.add(bagBody);

    const strapLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 2.6, 0.3),
        this.materialDark
    );
    strapLeft.position.set(-1.4, 0.4, -1.6);
    bag.add(strapLeft);

    const strapRight = strapLeft.clone();
    strapRight.position.x *= -1;
    bag.add(strapRight);

    bag.renderOrder = 5;

    this.base.add(bag);
    this.equipment.bag = bag;
}
