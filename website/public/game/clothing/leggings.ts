export function leggings(fur = true) {
    if (!this.equipment) this.equipment = {};
    if (this.equipment.leggings) {
        this.equipment.leggings.forEach(l => this.base.remove(l));
    }

    const leggings = [];
    const mat = this.materialDark;

    const legGeo = new THREE.BoxGeometry(1.7, 2.4, 1.9);

    // --------------------
    // LEFT LEG
    // --------------------
    const leftLeg = new THREE.Mesh(legGeo, fur ? bearFurMaterial : mat);
    leftLeg.position.set(-0.75, -3.9, -0.35);
    leftLeg.castShadow = true;

    if (fur) {
        const claws = this.createBearClaws();
        claws.scale.set(0.8, 0.8, 0.8);

        // attach at the bottom/front of the leg
        claws.position.set(0, -1.2, 0.8);
        claws.rotation.x = Math.PI / 2;

        leftLeg.add(claws);
    }

    this.base.add(leftLeg);
    leggings.push(leftLeg);

    // --------------------
    // RIGHT LEG
    // --------------------
    const rightLeg = leftLeg.clone();
    rightLeg.position.x *= -1;

    // fix mirrored claw rotation
    rightLeg.children.forEach(child => {
        child.rotation.y = Math.PI;
    });

    this.base.add(rightLeg);
    leggings.push(rightLeg);

    // Save references
    this.equipment.leggings = leggings;

    // Optional animation hooks
    this.leftLeg = leftLeg;
    this.rightLeg = rightLeg;
}
