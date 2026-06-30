export function woodAxe() {
    const group = new THREE.Group();

    // =========================
    // HANDLE
    // =========================
    const handleGeo = new THREE.BoxGeometry(7, 0.3, 0.3);
    const handle = new THREE.Mesh(handleGeo, materialLight);
    handle.castShadow = true;
    group.add(handle);

    // Grip wrap
    const gripGeo = new THREE.BoxGeometry(1.5, 0.35, 0.35);
    const grip = new THREE.Mesh(gripGeo, steelMaterial);
    grip.position.set(-2.7, 0, 0);
    group.add(grip);

    // =========================
    // AXE BLADE SHAPE (POINTED)
    // =========================
    const axeShape = new THREE.Shape();

    // Back near handle (eye side)
    axeShape.moveTo(0.0, 0.45);

    // Top spine
    axeShape.lineTo(0.8, 0.55);

    // Forward point (cutting apex)
    axeShape.lineTo(1.6, 0.0);

    // Bottom return
    axeShape.lineTo(0.8, -0.55);
    axeShape.lineTo(0.0, -0.45);

    axeShape.closePath();

    const bladeGeo = new THREE.ExtrudeGeometry(axeShape, {
        depth: 0.45,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.12,
        bevelSegments: 2
    });

    const blade = new THREE.Mesh(bladeGeo, steelMaterial);
    blade.rotation.y = Math.PI / 2;
    blade.position.set(2.6, 0, -0.225);
    blade.castShadow = true;
    group.add(blade);

    // =========================
    // AXE SOCKET / EYE
    // =========================
    const socketGeo = new THREE.BoxGeometry(0.8, 0.8, 0.6);
    const socket = new THREE.Mesh(socketGeo, steelMaterial);
    socket.position.set(2.1, 0, 0);
    socket.castShadow = true;
    group.add(socket);

    // =========================
    // HANDLE BUTT
    // =========================
    const buttGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const butt = new THREE.Mesh(buttGeo, steelMaterial);
    butt.position.set(-3.6, 0, 0);
    group.add(butt);

    return group;
}