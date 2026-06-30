export function spear() {
    // -----------------------------
    // MATERIALS
    // -----------------------------
    const woodMat = materialLight;
    const tipMat = steelMaterial;
    // -----------------------------
    // SPEAR SHAFT (long stick)
    // -----------------------------
    const shaftGeo = new THREE.BoxGeometry(0.25, 6.5, 0.25);
    const shaft = new THREE.Mesh(shaftGeo, woodMat);
    shaft.position.set(0, -2.5, 0);
    // -----------------------------
    // SPEAR TIP (simple tetra-like wedge)
    // -----------------------------
    const tipGeo = new THREE.ConeGeometry(0.35, 1.2, 4); // small & sharp
    const tip = new THREE.Mesh(tipGeo, tipMat);
    // Rotate so it points forward like your sword
    // tip.rotation.x = Math.PI / 2;
    tip.position.set(0, 1.2, 0);
    // -----------------------------
    // SMALL HANDLE WRAP
    // -----------------------------
    const wrapGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const wrap = new THREE.Mesh(wrapGeo, woodMat);
    wrap.position.set(0, -0.3, 0);
    // -----------------------------
    // GROUP
    // -----------------------------
    const group = new THREE.Group();
    group.add(shaft);
    group.add(tip);
    group.add(wrap);
    // Match weapon orientation like sword()
    group.rotation.x = Math.PI / 6;
    group.rotation.z = Math.PI / 2;
    group.position.set(-3.5, 0, -0.05);
    return group;
}
