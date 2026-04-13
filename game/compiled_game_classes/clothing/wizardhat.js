export function wizardHat(color = 0x5b3a78, bandColor = 0x3a2450) {
    const hatGroup = new THREE.Group();
    const hatMaterial = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
        side: THREE.DoubleSide
    });
    const bandMaterial = new THREE.MeshPhongMaterial({
        color: bandColor,
        flatShading: true,
        side: THREE.DoubleSide
    });
    // --------------------------------------------------
    // 1. BRIM (flat circle)
    // --------------------------------------------------
    const brimGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.15, 16);
    const brim = new THREE.Mesh(brimGeo, hatMaterial);
    brim.position.set(0, 0, 0);
    brim.castShadow = true;
    hatGroup.add(brim);
    // --------------------------------------------------
    // 2. CONE (main hat)
    // --------------------------------------------------
    const coneGeo = new THREE.ConeGeometry(1.8, 3.6, 16, 3);
    const cone = new THREE.Mesh(coneGeo, hatMaterial);
    cone.position.set(0, 1.8, 0);
    // cone.rotation.z = -0.25; // slight wizard tilt
    cone.castShadow = true;
    hatGroup.add(cone);
    // --------------------------------------------------
    // 3. BAND (ring around cone base)
    // --------------------------------------------------
    const bandGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.25, 16);
    const band = new THREE.Mesh(bandGeo, bandMaterial);
    band.position.set(0, 0.25, 0);
    band.castShadow = true;
    hatGroup.add(band);
    // --------------------------------------------------
    // FINAL POSITION RELATIVE TO YOUR CHARACTER
    // --------------------------------------------------
    // Your character's head is blocky and sits around y=2
    hatGroup.position.set(0, 2.6, 0);
    hatGroup.scale.set(0.65, 0.85, 0.65);
    this.base.add(hatGroup);
    this.wizardHat = hatGroup;
}
