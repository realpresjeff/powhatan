export function pixieWingsCape(color = 0x5b2d6f, innerColor = 0x9a58c9) {
    const wings = new THREE.Group();
    const matOuter = new THREE.MeshPhongMaterial({
        color,
        flatShading: true
    });
    const matInner = new THREE.MeshPhongMaterial({
        color: innerColor,
        flatShading: true
    });
    // ----------------------------------------------------
    // WING SHAPE (simple curved quad extrusion)
    // ----------------------------------------------------
    function createWing(isLeft = true) {
        const shape = new THREE.Shape();
        // Outer contour (stylized curve)
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.6, 1.2, 0.8, 2.2, 0.2, 3.2);
        shape.bezierCurveTo(-0.3, 2.6, -0.6, 1.3, 0, 0);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.25,
            bevelEnabled: false,
            steps: 1
        });
        const wing = new THREE.Mesh(geo, matOuter);
        // Flip for right wing
        if (!isLeft)
            wing.scale.x = -1;
        // Position left/right
        wing.position.set(isLeft ? 1.8 : -1.8, 0.5, -1.1);
        // Slight rotation so wings angle outward
        wing.rotation.y = isLeft ? Math.PI / 10 : -Math.PI / 10;
        return wing;
    }
    // ----------------------------------------------------
    // INNER PANELS (layered "feather" shapes)
    // ----------------------------------------------------
    function createInnerPanel(isLeft = true) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.5);
        shape.bezierCurveTo(0.4, 1.0, 0.5, 1.8, 0.1, 2.5);
        shape.bezierCurveTo(-0.2, 1.7, -0.35, 1.0, 0, 0.5);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.15,
            bevelEnabled: false
        });
        const panel = new THREE.Mesh(geo, matInner);
        if (!isLeft)
            panel.scale.x = -1;
        panel.position.set(isLeft ? 1.8 : -1.8, 0.3, -1.25);
        return panel;
    }
    // Build both wings
    const leftWing = createWing(true);
    const rightWing = createWing(false);
    // Inner segments for stylized look
    const leftInner = createInnerPanel(true);
    const rightInner = createInnerPanel(false);
    wings.add(leftWing, rightWing, leftInner, rightInner);
    // ----------------------------------------------------
    // FINAL POSITION ON PLAYER
    // ----------------------------------------------------
    wings.position.set(0, 0.3, 0);
    this.base.add(wings);
    this.magicWings = wings;
}
