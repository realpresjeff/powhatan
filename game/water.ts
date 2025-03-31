class Water { 
    function createWater(position, size) {
        const waterGeometry = new THREE.PlaneGeometry(size.width, size.height, 32, 32);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: "#1E90FF", // Deep Blue
            transparent: true,  // Allow light to pass through
            opacity: 0.8,  // Slight transparency for a more natural look
            side: THREE.DoubleSide
        });

        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2; // Make it horizontal
        water.position.set(position.x, position.y + 0.01, position.z); // Lift slightly above ground

        water.receiveShadow = true; // Make it interact better with light
        water.userData = { isWater: true };

        scene.add(water);
        return water;
    }

    function createFishingSpot(position) {
        const bubbles = new THREE.Mesh();
        const data = { isFishingSpot: true, fish: true, name: "Chesapeake Bay" };

        for (let i = 0; i < 5; i++) {
            const bubble = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 8, 8),
                new THREE.MeshStandardMaterial({ color: "white", transparent: true, opacity: 0.8 })
            );

            bubble.userData = { isFishingSpot: true, fish: true, name: "Chesapeake Bay" };

            bubble.position.set(
                position.x + (Math.random() - 0.5) * 0.5,
                position.y + Math.random() * 0.5,
                position.z + (Math.random() - 0.5) * 0.5
            );

            bubbles.add(bubble);
        }

        bubbles.userData = data;
        scene.add(bubbles);

        // Animate bubbles
        function animateBubbles() {
            bubbles.children.forEach((bubble, index) => {
                bubble.position.y += Math.sin(performance.now() / 1000 + index) * 0.005;
            });
            requestAnimationFrame(animateBubbles);
        }

        animateBubbles();

        return bubbles;
    }

    // function fish(fishingSpot) {
    //     if (!playerHasFishingRod()) {
    //         console.log("You need a fishing rod to fish!");
    //         return;
    //     }

    //     console.log("Fishing...");

    //     setTimeout(() => {
    //         if (Math.random() < 0.5) { // 50% success rate
    //             console.log("You caught a fish!");
    //             addToInventory({ name: "Fish", type: "food" });
    //         } else {
    //             console.log("The fish got away...");
    //         }
    //     }, 3000); // Simulate time delay for fishing
    // }

    function playerHasFishingRod() {
        return inventory.some(item => item.name === "Fishing Rod");
    }

}