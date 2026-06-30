export function wingCape(color = 0x5d2a7a, innerColor = 0x8f4fb6) {
    const wingCape = new THREE.Group();
    const outerMat = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
        side: THREE.DoubleSide
    });
    const innerMat = new THREE.MeshPhongMaterial({
        color: innerColor,
        flatShading: true,
        side: THREE.DoubleSide
    });
    // ----------------------------------------------------
    // 1. OUTER WING SHAPE (matches your PNG silhouette)
    // ----------------------------------------------------
    const outerShape = new THREE.Shape();
    outerShape.moveTo(0.0, 2.2);
    outerShape.bezierCurveTo(1.2, 1.8, 1.6, 0.8, 1.4, -0.5);
    outerShape.bezierCurveTo(1.3, -1.8, 0.6, -2.8, -0.2, -3.2);
    outerShape.bezierCurveTo(-1.0, -2.8, -1.7, -1.8, -1.8, -0.5);
    outerShape.bezierCurveTo(-2.0, 0.8, -1.4, 1.8, 0.0, 2.2);
    const extrude = {
        depth: 0.18,
        bevelEnabled: false
    };
    const outerGeo = new THREE.ExtrudeGeometry(outerShape, extrude);
    // ----------------------------------------------------
    // 2. INNER FEATHERS SHAPE (matches icon)
    // ----------------------------------------------------
    const featherShape = new THREE.Shape();
    featherShape.moveTo(0.0, 1.3);
    featherShape.bezierCurveTo(0.8, 1.0, 1.0, 0.3, 0.9, -0.3);
    featherShape.bezierCurveTo(0.8, -0.8, 0.3, -1.5, -0.2, -1.7);
    featherShape.bezierCurveTo(-0.7, -1.5, -1.1, -0.8, -1.1, -0.3);
    featherShape.bezierCurveTo(-1.0, 0.3, -0.5, 1.0, 0.0, 1.3);
    const innerGeo = new THREE.ExtrudeGeometry(featherShape, {
        depth: 0.09,
        bevelEnabled: false
    });
    // ----------------------------------------------------
    // 3. BUILD ONE WING
    // ----------------------------------------------------
    function buildWing(mirror) {
        const wing = new THREE.Group();
        const outer = new THREE.Mesh(outerGeo, outerMat);
        outer.position.set(0, 0, 0);
        wing.add(outer);
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.set(0, 0, 0.05);
        wing.add(inner);
        if (mirror) {
            wing.scale.x = -1;
        }
        // POSITION same as previous version (already correct)
        wing.position.set(mirror ? -1.3 : 1.3, -0.4, -1.55);
        wing.rotation.y = mirror ? -Math.PI / 12 : Math.PI / 12;
        return wing;
    }
    // Make left + right wings
    wingCape.add(buildWing(false));
    wingCape.add(buildWing(true));
    // Attach to character root
    wingCape.position.set(0, 0.8, 0);
    this.base.add(wingCape);
    this.wingCape = wingCape;
    this.base.position.y = 10;
}
