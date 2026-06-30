export function shield() {
    const group = new THREE.Group();
    // ----------------------------------------
    // MATERIALS
    // ----------------------------------------
    const steelMat = new THREE.MeshPhongMaterial({ color: 0x8f9a9e });
    const rimMat = new THREE.MeshPhongMaterial({ color: 0x6f7a7e });
    // ----------------------------------------
    // MAIN SHIELD FACE
    // ----------------------------------------
    const shieldGeo = new THREE.BoxGeometry(2.6, 3.2, 0.35);
    const shield = new THREE.Mesh(shieldGeo, steelMat);
    shield.castShadow = true;
    group.add(shield);
    // ----------------------------------------
    // BORDER / RIM (slightly larger)
    // ----------------------------------------
    const rimGeo = new THREE.BoxGeometry(2.9, 3.5, 0.15);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.z = -0.15;
    group.add(rim);
    // ----------------------------------------
    // CENTER RIDGE (vertical spine)
    // ----------------------------------------
    const ridgeGeo = new THREE.BoxGeometry(0.35, 2.6, 0.25);
    const ridge = new THREE.Mesh(ridgeGeo, rimMat);
    ridge.position.z = 0.2;
    group.add(ridge);
    // ----------------------------------------
    // ARM STRAP (inside, invisible from front)
    // ----------------------------------------
    const strapGeo = new THREE.BoxGeometry(0.4, 1.4, 0.4);
    const strap = new THREE.Mesh(strapGeo, rimMat);
    strap.position.set(-0.9, 0, -0.4);
    group.add(strap);
    // ----------------------------------------
    // FINAL ORIENTATION — RIGHT HAND
    // ----------------------------------------
    // Faces outward from right arm
    group.rotation.y = 3;
    group.rotation.x = Math.PI / 10;
    // Offset so it sits in front of forearm
    group.position.set(-1, -.5, .5);
    this.rightArm.forearm.add(group);
    return group;
}
