export function platelegs() {
    const ironMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.7,
        roughness: 0.35
    });
    const armor = new THREE.Group();
    // -------------------------------
    // FRONT THIGH PLATES
    // -------------------------------
    const frontPlateGeo = new THREE.BoxGeometry(1.6, 1.6, 0.4);
    const leftFrontPlate = new THREE.Mesh(frontPlateGeo, ironMaterial);
    leftFrontPlate.position.set(-0.75, -3.3, 0.8);
    const rightFrontPlate = new THREE.Mesh(frontPlateGeo, ironMaterial);
    rightFrontPlate.position.set(0.75, -3.3, 0.8);
    armor.add(leftFrontPlate, rightFrontPlate);
    // -------------------------------
    // SIDE PLATES
    // -------------------------------
    const sideGeo = new THREE.BoxGeometry(0.4, 1.6, 1.4);
    const leftSide = new THREE.Mesh(sideGeo, ironMaterial);
    leftSide.position.set(-1.5, -3.3, 0);
    const rightSide = new THREE.Mesh(sideGeo, ironMaterial);
    rightSide.position.set(1.5, -3.3, 0);
    armor.add(leftSide, rightSide);
    // -------------------------------
    // BACK PLATES (FIX)
    // -------------------------------
    const backPlateGeo = new THREE.BoxGeometry(1.6, 1.6, 0.4);
    const leftBack = new THREE.Mesh(backPlateGeo, ironMaterial);
    leftBack.position.set(-0.75, -3.3, -1.0);
    const rightBack = new THREE.Mesh(backPlateGeo, ironMaterial);
    rightBack.position.set(0.75, -3.3, -1.0);
    armor.add(leftBack, rightBack);
    // -------------------------------
    // GREAVES (lower leg armor)
    // -------------------------------
    const greaveGeo = new THREE.BoxGeometry(1.2, 1.6, 1.0);
    const leftGreave = new THREE.Mesh(greaveGeo, ironMaterial);
    leftGreave.position.set(-0.75, -4.5, 0.1);
    const rightGreave = new THREE.Mesh(greaveGeo, ironMaterial);
    rightGreave.position.set(0.75, -4.5, 0.1);
    armor.add(leftGreave, rightGreave);
    // -------------------------------
    // HIP PLATE WRAP
    // -------------------------------
    const hipGeo = new THREE.BoxGeometry(3.4, 0.4, 1.6);
    const hip = new THREE.Mesh(hipGeo, ironMaterial);
    hip.position.set(0, -2.6, -0.2);
    armor.add(hip);
    // Attach armor to model
    armor.position.set(0, 0, 0);
    this.base.add(armor);
    // Save reference so you can remove it later
    this.platelegs = armor;
}
