export function ironHelmet() {
    const helmetGroup = new THREE.Group();
    const ironMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.3
    });
    // -------------------------------
    // MAIN HELMET SHELL (top dome)
    // -------------------------------
    const shell = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 1.8), ironMaterial);
    shell.position.set(0, 3.1, 0);
    helmetGroup.add(shell);
    // -------------------------------
    // BACK PLATE (protects back of head)
    // -------------------------------
    const backPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.5), ironMaterial);
    backPlate.position.set(0, 3.0, -0.9);
    helmetGroup.add(backPlate);
    // -------------------------------
    // CHEEK GUARDS (left & right)
    // -------------------------------
    const cheekGeo = new THREE.BoxGeometry(0.4, 1.2, 1.1);
    const leftCheek = new THREE.Mesh(cheekGeo, ironMaterial);
    const rightCheek = new THREE.Mesh(cheekGeo, ironMaterial);
    leftCheek.position.set(1.0, 2.7, 0);
    rightCheek.position.set(-1.0, 2.7, 0);
    helmetGroup.add(leftCheek);
    helmetGroup.add(rightCheek);
    // Slight inward tilt
    leftCheek.rotation.y = Math.PI * 0.05;
    rightCheek.rotation.y = -Math.PI * 0.05;
    // -------------------------------
    // BROW BAND (upper front plate)
    // Leaves eyes + face visible
    // -------------------------------
    const brow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.1), ironMaterial);
    brow.position.set(0, 3.05, 0.7);
    helmetGroup.add(brow);
    // -------------------------------
    // Attach helmet to player base
    // -------------------------------
    // Final tiny tweak — adjust vertically if needed
    helmetGroup.position.set(0, -.8, 0);
    this.base.add(helmetGroup);
    this.ironHelmet = helmetGroup;
}
