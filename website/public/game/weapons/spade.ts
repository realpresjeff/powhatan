export function spade() {
    const axe = new THREE.Group();

    // ─── Materials ─────────────────────────
    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x6a4b2a,
        roughness: 0.9
    });

    const wrapMat = new THREE.MeshStandardMaterial({
        color: 0x4b3a28,
        roughness: 1
    });

    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x8f8f8f,
        metalness: 0.75,
        roughness: 0.4
    });

    // ─── Handle (tapered) ──────────────────
    const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.22, 3.8, 10),
        woodMat
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.x = -1.6;
    axe.add(handle);

    // ─── Grip Wrap ─────────────────────────
    const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 1.6, 10),
        wrapMat
    );
    grip.rotation.z = Math.PI / 2;
    grip.position.x = -3.0;
    axe.add(grip);

    // ─── Hanging Ring ──────────────────────
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.05, 8, 16),
        metalMat
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -3.55;
    axe.add(ring);

    // ─── Cord / Knot ───────────────────────
    const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.45, 6),
        wrapMat
    );
    cord.rotation.z = Math.PI / 2;
    cord.position.set(-3.8, -0.2, 0);
    axe.add(cord);

    // ─── Axe Head (Blade) ──────────────────
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.8);
    bladeShape.quadraticCurveTo(1.2, -0.4, 1.4, 0);
    bladeShape.quadraticCurveTo(1.2, 0.4, 0, 0.8);
    bladeShape.lineTo(-0.3, 0);
    bladeShape.closePath();

    const blade = new THREE.Mesh(
        new THREE.ExtrudeGeometry(bladeShape, {
            depth: 0.28,
            bevelEnabled: false
        }),
        metalMat
    );
    blade.rotation.y = Math.PI / 2;
    blade.position.set(0.95, 0, -0.14);
    axe.add(blade);

    // ─── Head Collar ───────────────────────
    const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.4, 10),
        metalMat
    );
    collar.rotation.z = Math.PI / 2;
    collar.position.x = -0.15;
    axe.add(collar);

    // ─── Final Touches ─────────────────────
    axe.scale.set(0.95, 0.95, 0.95);
    axe.rotation.y = Math.PI / 2;

    axe.traverse(obj => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    return axe;
}