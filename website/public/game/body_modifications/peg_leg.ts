import * as THREE from 'three';

export function pegLeg() {
    const pegLegGeo = new THREE.BoxGeometry(0.5, 1.8, 0.5);
    const leg = new THREE.Mesh(pegLegGeo, materialLight);

    const stumpUpperGeo = new THREE.BoxGeometry(1, 0.75, 1);
    const stumpUpper = new THREE.Mesh(stumpUpperGeo, materialLight)

    const stumpMaterial = new THREE.MeshPhongMaterial({ color: 0x26211a });
    const stumpGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
    const stump = new THREE.Mesh(stumpGeo, stumpMaterial);

    const group = new THREE.Group();

    stump.position.set(1, -4.65, -0.34)
    leg.position.set(1, -3.75, -0.35);
    stumpUpper.position.set(1, -3.1, -0.35);

    group.add(stump);
    group.add(leg);
    group.add(stumpUpper);

    return group;
}
