export function helmet() {
    const boneMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
    const helmetGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const helmet = new THREE.Mesh(helmetGeo, this.steelMaterial);
    const hornGeo = new THREE.BoxGeometry(1.1, 0.25, 0.25);
    const hornLeftBottom = new THREE.Mesh(hornGeo, boneMaterial);
    const hornLeftTop = new THREE.Mesh(hornGeo, boneMaterial);
    this.base.add(helmet);
    this.base.add(hornLeftBottom);
    this.base.add(hornLeftTop);
    helmet.position.set(0, 3, 0);
    hornLeftBottom.position.set(-0.75, 3.1, 0);
    hornLeftTop.position.set(-1.3, 3.6, 0);
    hornLeftTop.rotation.z = Math.PI / 2 + 0.25;
}
