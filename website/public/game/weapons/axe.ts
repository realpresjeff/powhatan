const materialLight = new THREE.MeshPhongMaterial({ color: 0xa3835b });
const steelMaterial = new THREE.MeshPhongMaterial({ color: 0x878787 });

export function axe() {
    const axeHandleGeo = new THREE.BoxGeometry(7, 0.25, 0.25);
    const handle = new THREE.Mesh(axeHandleGeo, materialLight);
    const axeShape = new THREE.Shape();

    axeShape.moveTo(0, 0.15);
    axeShape.lineTo(1, 1);
    axeShape.lineTo(1.25, 0.5);
    axeShape.lineTo(1.25, -0.5);
    axeShape.lineTo(1, -1);
    axeShape.lineTo(0, -0.15);

    const extrudeSettings = {
        steps: 2,
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.25,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const axeGeo = new THREE.ExtrudeBufferGeometry(axeShape, extrudeSettings);
    const buttGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    const butt1 = new THREE.Mesh(buttGeo, steelMaterial);
    const butt2 = new THREE.Mesh(buttGeo, steelMaterial);
    const butt3 = new THREE.Mesh(buttGeo, steelMaterial);
    const axe1 = new THREE.Mesh(axeGeo, steelMaterial);
    const axe2 = new THREE.Mesh(axeGeo, steelMaterial);

    axe1.castShadow = true;
    axe2.castShadow = true;
    handle.castShadow = true;

    const group = new THREE.Group();

    group.add(handle);
    group.add(axe1);
    group.add(axe2);
    group.add(butt1);
    group.add(butt2);
    group.add(butt3);

    axe1.position.set(2.75, 0.4, 0)
    axe1.rotation.z = Math.PI / 2;
    axe2.position.set(2.75, -0.4, 0)
    axe2.rotation.z = -Math.PI / 2;
    butt2.position.set(-3.5, 0, 0);
    butt3.position.set(3.5, 0, 0);

    return group;
}