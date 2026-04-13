export function createWizardModel(data, options = {}) {
    const { robeColor = 0x3a4f7a, // blue robe
    trimColor = 0x2a3655, skinColor = 0xd8c6a3, beardColor = 0xbdbdbd, eyeColor = 0x111111, staffColor = 0x6b4a2d, scale = 1, } = options;
    const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, flatShading: true });
    const trimMat = new THREE.MeshStandardMaterial({ color: trimColor, flatShading: true });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, flatShading: true });
    const beardMat = new THREE.MeshStandardMaterial({ color: beardColor, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const staffMat = new THREE.MeshStandardMaterial({ color: staffColor, flatShading: true });
    const wizard = new THREE.Group();
    // ------------------------------------------------------------
    // ROBE / BODY — main silhouette
    // ------------------------------------------------------------
    const robe = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.6), robeMat);
    robe.userData = data;
    robe.position.set(0, 1.2, 0);
    wizard.add(robe);
    // Robe trim
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.25, 0.65), trimMat);
    trim.position.set(0, -0.65, 0);
    robe.add(trim);
    // ------------------------------------------------------------
    // HEAD — hooded wizard head
    // ------------------------------------------------------------
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), skinMat);
    head.position.set(0.55, 2.05, 0);
    wizard.add(head);
    // Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), robeMat);
    hood.position.set(-0.05, 0.05, 0);
    head.add(hood);
    // Eyes
    const eyeGeom = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(0.12, 0.05, 0.14);
    eyeR.position.set(0.12, 0.05, -0.14);
    head.add(eyeL, eyeR);
    // Beard
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.40, 0.30), beardMat);
    beard.position.set(0.10, -0.35, 0);
    head.add(beard);
    // ------------------------------------------------------------
    // ARMS — sleeves hide hands
    // ------------------------------------------------------------
    function makeArm(side) {
        const arm = new THREE.Group();
        const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.60, 0.30), robeMat);
        sleeve.position.set(0, -0.30, 0);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), skinMat);
        hand.position.set(0, -0.42, 0);
        sleeve.add(hand);
        arm.add(sleeve);
        arm.position.set(0.35, 1.65, 0.30 * side);
        return arm;
    }
    wizard.add(makeArm(1));
    wizard.add(makeArm(-1));
    // ------------------------------------------------------------
    // STAFF — iconic wizard staff
    // ------------------------------------------------------------
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 10), staffMat);
    staff.rotation.z = Math.PI / 2;
    staff.position.set(0.9, 1.4, -0.55);
    wizard.add(staff);
    // Staff crystal (optional glow hook)
    const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), new THREE.MeshStandardMaterial({
        color: 0x7fdfff,
        emissive: 0x2a88ff,
        emissiveIntensity: 0.6,
    }));
    crystal.position.set(1.1, 1.4, -0.55);
    wizard.add(crystal);
    // ------------------------------------------------------------
    // FEET — hidden under robe, but needed for ground contact
    // ------------------------------------------------------------
    function makeFoot(z) {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.10, 0.28), skinMat);
        foot.position.set(-0.15, 0.25, z);
        return foot;
    }
    wizard.add(makeFoot(0.18));
    wizard.add(makeFoot(-0.18));
    // ------------------------------------------------------------
    // Final setup
    // ------------------------------------------------------------
    wizard.scale.set(scale, scale, scale);
    wizard.userData = {
        head,
        staff,
        crystal,
    };
    return wizard;
}
