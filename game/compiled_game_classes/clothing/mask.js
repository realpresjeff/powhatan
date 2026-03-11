export function mask(color = 0x6a3b7a, trimColor = 0x40224c) {
    const group = new THREE.Group();
    const mat = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
        side: THREE.DoubleSide
    });
    const trimMat = new THREE.MeshPhongMaterial({
        color: trimColor,
        flatShading: true,
        side: THREE.DoubleSide
    });
    // -------------------------------------------------
    // MASK SHAPE (outer silhouette)
    // -------------------------------------------------
    const maskShape = new THREE.Shape();
    // Outer contour (stylized like your icon)
    maskShape.moveTo(-2.2, 0.0);
    maskShape.bezierCurveTo(-2.0, 1.2, -1.0, 1.6, 0, 1.0);
    maskShape.bezierCurveTo(1.0, 1.6, 2.0, 1.2, 2.2, 0.0);
    maskShape.bezierCurveTo(2.0, -1.2, 1.0, -1.3, 0, -1.0);
    maskShape.bezierCurveTo(-1.0, -1.3, -2.0, -1.2, -2.2, 0.0);
    // -------------------------------------------------
    // EYE HOLES
    // -------------------------------------------------
    const leftEye = new THREE.Path();
    leftEye.ellipse(-0.9, 0, 0.55, 0.40, 0, Math.PI * 2, false);
    maskShape.holes.push(leftEye);
    const rightEye = new THREE.Path();
    rightEye.ellipse(0.9, 0, 0.55, 0.40, 0, Math.PI * 2, false);
    maskShape.holes.push(rightEye);
    // -------------------------------------------------
    // EXTRUSION → actual mask mesh
    // -------------------------------------------------
    const maskGeo = new THREE.ExtrudeGeometry(maskShape, {
        depth: 0.25,
        bevelEnabled: false
    });
    const maskMesh = new THREE.Mesh(maskGeo, mat);
    // Slight curve so it hugs the face
    maskMesh.rotation.x = -0.15;
    // -------------------------------------------------
    // TRIM LAYER (slightly larger outline)
    // -------------------------------------------------
    const trimGeo = new THREE.ExtrudeGeometry(maskShape, {
        depth: 0.05,
        bevelEnabled: false
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.scale.set(1.05, 1.05, 1);
    trimMesh.position.set(0, 0, -0.12);
    group.add(trimMesh);
    group.add(maskMesh);
    // -------------------------------------------------
    // POSITION ON FACE
    // -------------------------------------------------
    group.position.set(0, 2, 1.05);
    group.rotation.x = 0.05;
    group.scale.set(0.30, 0.45, 0.30);
    this.base.add(group);
    this.mask = group;
}
