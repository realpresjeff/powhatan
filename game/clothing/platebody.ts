export function platebody() {
    const armorGroup = new THREE.Group();

    const ironMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.3
    });

    // -------------------------------
    // BACK PLATE
    // -------------------------------
    const backPlate = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 3.0, 0.6),
        ironMaterial
    );
    backPlate.position.set(0, 0.2, -1.05);
    armorGroup.add(backPlate);

    // -------------------------------
    // FRONT PLATE (LOWERED)
    // DOES NOT TOUCH THE HEAD
    // -------------------------------
    const frontPlate = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 3.0, 0.7),
        ironMaterial
    );

    // lowered so beard + neck are visible
    frontPlate.position.set(0, -0.8, 1.05);
    armorGroup.add(frontPlate);

    // -------------------------------
    // CHEST CORE BLOCK
    // fills ribcage area but stays low
    // -------------------------------
    const chestBlock = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 3.0, 1.2),
        ironMaterial
    );
    chestBlock.position.set(0, 0.2, 0);
    armorGroup.add(chestBlock);

    // -------------------------------
    // SHOULDER PLATES
    // still above arms but below head
    // -------------------------------
    const shoulderGeo = new THREE.BoxGeometry(2.2, 1.1, 1.3);

    const leftShoulder = new THREE.Mesh(shoulderGeo, ironMaterial);
    const rightShoulder = new THREE.Mesh(shoulderGeo, ironMaterial);

    leftShoulder.position.set(2.1, 1.4, 0.3);
    rightShoulder.position.set(-2.1, 1.4, 0.3);

    leftShoulder.rotation.y = Math.PI * 0.05;
    rightShoulder.rotation.y = -Math.PI * 0.05;

    armorGroup.add(leftShoulder);
    armorGroup.add(rightShoulder);

    // -------------------------------
    // BELT PLATE
    // -------------------------------
    const beltPlate = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.5, 1.2),
        ironMaterial
    );
    beltPlate.position.set(0, -1.4, 0);
    armorGroup.add(beltPlate);

    // Attach to torso root
    armorGroup.position.set(0, 0.1, 0);

    this.base.add(armorGroup);
    this.ironPlatebody = armorGroup;
}