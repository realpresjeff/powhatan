const materialLight = new THREE.MeshPhongMaterial({ color: 0xa3835b });
const steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });
export function sword() {
    const handleGeo1 = new THREE.BoxGeometry(1.5, 0.25, 0.25);
    const handle1 = new THREE.Mesh(handleGeo1, materialLight);
    const handleGeo2 = new THREE.BoxGeometry(0.25, 2, 0.25);
    const handle2 = new THREE.Mesh(handleGeo2, materialLight);
    const shape = new THREE.Shape();
    const extrudeSettings = {
        steps: 2,
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.25,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 1
    };
    shape.moveTo(0, 0.1);
    shape.lineTo(4, 0.5);
    shape.lineTo(4.5, 0);
    shape.lineTo(4, -0.5);
    shape.lineTo(0, -0.1);
    const bladeGeo = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    const blade = new THREE.Mesh(bladeGeo, steelMaterial);
    const group = new THREE.Group();
    handle1.position.set(-0.85, 0.0, 0);
    blade.position.set(0.5, 0, 0);
    handle1.castShadow = true;
    blade.castShadow = true;
    handle2.castShadow = true;
    group.add(blade);
    group.add(handle1);
    group.add(handle2);
    group.position.set(-0.5, 0, -0.05);
    group.rotation.x = Math.PI / 6;
    return group;
}
