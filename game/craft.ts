class Craft {
    function createOpenLogFire(position) {
        const fireGroup = new THREE.Mesh();
        const data = { isFire: true, name: "Log Fire" }
        fireGroup.userData = data

        // Create logs
        const logMaterial = new THREE.MeshStandardMaterial({ color: "#8B4513" });
        logMaterial.userData = data
        for (let i = 0; i < 5; i++) {
            const logGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 12);
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.userData = data
            log.rotation.z = Math.random() * Math.PI / 2;
            log.rotation.y = Math.random() * Math.PI;
            log.position.set(
                position.x + Math.random() * 1 - 0.5,
                position.y + 0.2,
                position.z + Math.random() * 1 - 0.5
            );
            fireGroup.add(log);
        }

        // Create embers
        const emberMaterial = new THREE.MeshStandardMaterial({ emissive: "#FF4500" });
        emberMaterial.userData = { isFire: true }
        const emberGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const embers = new THREE.Mesh(emberGeometry, emberMaterial);
        embers.userData = { isFire: true }
        embers.position.set(position.x, position.y + 0.1, position.z);
        fireGroup.add(embers);

        // Fire particles
        const fireParticles = new THREE.Mesh();
        fireParticles.userData = { isFire: true }
        const fireMaterial = new THREE.MeshStandardMaterial({ emissive: "#FF6347", transparent: true, opacity: 0.8 });
        fireMaterial.userData = { isFire: true }
        for (let i = 0; i < 10; i++) {
            const flame = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), fireMaterial);
            flame.position.set(position.x, position.y + 0.5 + Math.random() * 0.5, position.z);
            fireParticles.add(flame);
        }
        fireGroup.add(fireParticles);

        // Fire light
        const fireLight = new THREE.PointLight("#FFA500", 1.5, 5);
        fireLight.userData = { isFire: true }
        fireLight.position.set(position.x, position.y + 1, position.z);
        fireGroup.add(fireLight);

        // Flicker animation
        function animateFire() {
            fireParticles.children.forEach(particle => {
                particle.position.y += Math.random() * 0.02;
                particle.material.opacity = 0.5 + Math.random() * 0.5;
            });
            fireLight.intensity = 1 + Math.random() * 0.5;
            requestAnimationFrame(animateFire);
        }
        animateFire();

        scene.add(fireGroup);
        return fireGroup;
    }

}