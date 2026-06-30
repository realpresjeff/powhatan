export function earMuffs(color = 0x552266, bandColor = 0x332244) {
    const group = new THREE.Group();

    const muffMat = new THREE.MeshPhongMaterial({
        color,
        flatShading: true
    });

    const bandMat = new THREE.MeshPhongMaterial({
        color: bandColor,
        flatShading: true
    });

    // --------------------------------------------------
    // EAR MUFF BLOCKS
    // --------------------------------------------------
    const muffGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);

    const leftMuff = new THREE.Mesh(muffGeo, muffMat);
    const rightMuff = new THREE.Mesh(muffGeo, muffMat);

    // Position at ear height (centered on side of head)
    leftMuff.position.set(1.3, 2.0, 0);
    rightMuff.position.set(-1.3, 2.0, 0);

    leftMuff.castShadow = rightMuff.castShadow = true;

    group.add(leftMuff);
    group.add(rightMuff);

    // --------------------------------------------------
    // HEADBAND (wraps over top of the head)
    // --------------------------------------------------
    const bandGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 8);
    const band = new THREE.Mesh(bandGeo, bandMat);

    // Rotate band so it arches over the head
    band.rotation.z = Math.PI / 2;
    band.position.set(0, 2.8, 0);

    group.add(band);

    // --------------------------------------------------
    // FINAL POSITIONING
    // --------------------------------------------------
    // Base of the head is around y=2 — adjust to fit your character
    group.position.set(0, 0, 0);

    this.base.add(group);
    this.earMuffs = group;
}
