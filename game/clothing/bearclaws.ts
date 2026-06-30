const bearClawMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a, // dark claws
    flatShading: true
});

export function bearClaws(isLeft = true) {
    const clawGroup = new THREE.Group();

    const clawGeo = new THREE.BoxGeometry(0.25, 0.6, 0.25);

    for (let i = 0; i < 4; i++) {
        const claw = new THREE.Mesh(clawGeo, bearClawMaterial);

        claw.position.set(
            -2.5,                // forward
            0.3 - i * 0.25,     // spread vertically
            (i - 1.5) * 0.25    // spread sideways
        );

        claw.rotation.z = Math.PI / 6;
        claw.castShadow = true;
        clawGroup.add(claw);
    }

    // Mirror for right arm
    if (!isLeft) clawGroup.scale.x = -1;

    return clawGroup;
}
