export function parka() {
    if (!this.equipment)
        this.equipment = {};
    if (this.equipment.parka) {
        this.base.remove(this.equipment.parka);
    }
    const parka = new THREE.Group();
    const mat = this.materialDark; // or fur material
    // ─── TORSO (FULL FRONT + BACK) ───
    const torso = new THREE.Mesh(new THREE.BoxGeometry(4.4, 5.0, 2.6), mat);
    torso.position.set(0, -0.8, -0.9);
    parka.add(torso);
    // ─── LEFT SLEEVE ───
    const sleeveGeo = new THREE.BoxGeometry(2.8, 1.4, 1.6);
    const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
    leftSleeve.position.set(-3.2, -0.3, 0.1);
    leftSleeve.rotation.z = Math.PI / 4;
    parka.add(leftSleeve);
    // ─── RIGHT SLEEVE ───
    const rightSleeve = leftSleeve.clone();
    rightSleeve.position.x *= -1;
    rightSleeve.rotation.z *= -1;
    parka.add(rightSleeve);
    // ─── HOOD (BEHIND HEAD — FACE VISIBLE) ───
    const hood = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 1.8), mat);
    hood.position.set(0, 2.7, -1.0);
    parka.add(hood);
    // ─── LOWER BACK FLAP ───
    const backFlap = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.4, 1.2), mat);
    backFlap.position.set(0, -3.0, -1.2);
    parka.add(backFlap);
    this.base.add(parka);
    this.equipment.parka = parka;
}
