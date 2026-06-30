export function createDuckModel(options = {}) {
    const { bodyColor = 0x8fae6a, // greenish/brown duck body
    wingColor = 0x7a915c, billColor = 0xe2a13a, // orange bill
    eyeColor = 0x111111, footColor = 0xe2a13a, scale = 1, } = options;
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true });
    const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, flatShading: true });
    const billMat = new THREE.MeshStandardMaterial({ color: billColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const footMat = new THREE.MeshStandardMaterial({ color: footColor, flatShading: true });
    const duck = new THREE.Group();
    // ============================================================
    // BODY — oval, buoyant
    // ============================================================
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.7), bodyMat);
    body.position.set(0, 0.9, 0);
    duck.add(body);
    // ============================================================
    // HEAD
    // ============================================================
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), bodyMat);
    head.position.set(0.85, 1.05, 0);
    duck.add(head);
    // Bill
    const bill = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.28), billMat);
    bill.position.set(0.40, -0.05, 0);
    head.add(bill);
    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.05, 0.08, 0.18);
    eyeR.position.set(0.05, 0.08, -0.18);
    head.add(eyeL, eyeR);
    // ============================================================
    // WINGS — tucked
    // ============================================================
    function makeWing(side) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.30, 0.10), wingMat);
        wing.position.set(-0.10, 0.95, 0.40 * side);
        wing.rotation.y = side * 0.15;
        return wing;
    }
    duck.add(makeWing(1));
    duck.add(makeWing(-1));
    // ============================================================
    // TAIL
    // ============================================================
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.20, 0.20), bodyMat);
    tail.position.set(-0.70, 1.00, 0);
    duck.add(tail);
    // ============================================================
    // LEGS + WEBBED FEET
    // ============================================================
    function makeLeg(side) {
        const leg = new THREE.Group();
        const shin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), footMat);
        shin.position.set(0, -0.11, 0);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.06, 0.22), footMat);
        foot.position.set(0.12, -0.20, 0);
        leg.add(shin);
        shin.add(foot);
        leg.position.set(0.20, 0.55, 0.18 * side);
        return leg;
    }
    duck.add(makeLeg(1));
    duck.add(makeLeg(-1));
    // ============================================================
    duck.scale.set(scale, scale, scale);
    duck.userData = {
        head,
        wings: duck.children.filter(c => c.material === wingMat),
    };
    return duck;
}
