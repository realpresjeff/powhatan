export function goldNecklace(base) {
    const group = new THREE.Group();
    const goldMat = new THREE.MeshPhongMaterial({
        color: 0xffc947,
        shininess: 60,
        flatShading: true
    });
    const darkGold = new THREE.MeshPhongMaterial({
        color: 0x8a5b1b,
        shininess: 30,
        flatShading: true
    });
    // ----------------------------------------------------
    // 1. U-shaped top band (neck ring)
    // ----------------------------------------------------
    const bandCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-1.4, 0, 0), new THREE.Vector3(0, -0.9, 0), new THREE.Vector3(1.4, 0, 0));
    const bandGeo = new THREE.TubeGeometry(bandCurve, 20, 0.12, 8, false);
    const band = new THREE.Mesh(bandGeo, darkGold);
    group.add(band);
    // ----------------------------------------------------
    // 2. Clasp block (top center)
    // ----------------------------------------------------
    const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.3), goldMat);
    clasp.position.set(0, -0.15, 0);
    group.add(clasp);
    // ----------------------------------------------------
    // 3. Pendant ring (the big circle)
    // ----------------------------------------------------
    const pendantShape = new THREE.Shape();
    const outerR = 0.7;
    const innerR = 0.4;
    // Outer circle
    pendantShape.absarc(0, -1.25, outerR, 0, Math.PI * 2, false);
    // Inner cut-out
    const hole = new THREE.Path();
    hole.absarc(0, -1.25, innerR, 0, Math.PI * 2, true);
    pendantShape.holes.push(hole);
    const pendantGeo = new THREE.ExtrudeGeometry(pendantShape, {
        depth: 0.22,
        bevelEnabled: false
    });
    const pendant = new THREE.Mesh(pendantGeo, goldMat);
    pendant.position.set(0, 0, -0.1);
    group.add(pendant);
    // ----------------------------------------------------
    // FINAL POSITIONING ON CHARACTER
    // ----------------------------------------------------
    group.position.set(0, 1.2, 1.0); // hangs at upper chest
    group.rotation.x = Math.PI / 12; // slight forward tilt
    base.add(group);
    // this.goldNecklace = group;
    return group;
}
