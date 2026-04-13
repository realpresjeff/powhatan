export function ironBoots() {
    const bootsGroup = new THREE.Group();
    const ironMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.3
    });
    // -------------------------------
    // BASE SHOE BLOCKS (foot length)
    // -------------------------------
    const footGeo = new THREE.BoxGeometry(1.2, 0.6, 2.0);
    const leftFoot = new THREE.Mesh(footGeo, ironMaterial);
    const rightFoot = new THREE.Mesh(footGeo, ironMaterial);
    leftFoot.position.set(-0.8, -4.9, 0.2);
    rightFoot.position.set(0.8, -4.9, 0.2);
    bootsGroup.add(leftFoot);
    bootsGroup.add(rightFoot);
    // -------------------------------
    // ANKLE WRAPS (horizontal armor band)
    // -------------------------------
    const ankleGeo = new THREE.BoxGeometry(1.3, 0.5, 1.2);
    const leftAnkle = new THREE.Mesh(ankleGeo, ironMaterial);
    const rightAnkle = new THREE.Mesh(ankleGeo, ironMaterial);
    leftAnkle.position.set(-0.8, -4.4, 0.1);
    rightAnkle.position.set(0.8, -4.4, 0.1);
    bootsGroup.add(leftAnkle);
    bootsGroup.add(rightAnkle);
    // -------------------------------
    // TOE CAP (reinforced front plate)
    // -------------------------------
    const toeGeo = new THREE.BoxGeometry(1.2, 0.5, 0.8);
    const leftToe = new THREE.Mesh(toeGeo, ironMaterial);
    const rightToe = new THREE.Mesh(toeGeo, ironMaterial);
    leftToe.position.set(-0.8, -4.9, 1.0);
    rightToe.position.set(0.8, -4.9, 1.0);
    bootsGroup.add(leftToe);
    bootsGroup.add(rightToe);
    // -------------------------------
    // HEEL BLOCK (reinforced heel)
    // -------------------------------
    const heelGeo = new THREE.BoxGeometry(1.0, 0.6, 0.7);
    const leftHeel = new THREE.Mesh(heelGeo, ironMaterial);
    const rightHeel = new THREE.Mesh(heelGeo, ironMaterial);
    leftHeel.position.set(-0.8, -4.9, -0.8);
    rightHeel.position.set(0.8, -4.9, -0.8);
    bootsGroup.add(leftHeel);
    bootsGroup.add(rightHeel);
    // -------------------------------
    // FINAL ATTACH
    // -------------------------------
    bootsGroup.position.set(0, 0, 0);
    this.base.add(bootsGroup);
    this.ironBoots = bootsGroup;
}
