class Smelt {
    function smelt() {
        let smeltingSpeed = Math.max(500 - (playerStats.agility / 1000) - (playerStats.craft / 500), 100); // Min speed: 100ms
        let smeltedItems = [];

        inventory.forEach((item, index) => {
            if (item.name.includes("ore")) {
                let barType = item.name.replace("ore", "bar").trim(); // Convert "iron ore" → "iron bar"

                setTimeout(() => {
                    if (inventory[index].quantity > 0) {
                        removeFromInventory(item, 1);
                        addToInventory({ ...item, name: barType, quantity: 1, type: barType });

                        smeltedItems.push({ ...item, name: barType });
                        console.log(`Smelted 1 ${item.name} → ${barType}`);
                        playerObj.updateExperience("craft", 10);
                    }
                }, smeltingSpeed * index); // Delay increases per item
            }
        });

        return smeltedItems;
    }

    function createSmelt(position) {
        const smelt = new THREE.Mesh();
        smelt.userData = { isSmelt: true }

        // Furnace body (a tapered cylinder to resemble a clay/stone bloomery)
        const furnaceGeometry = new THREE.CylinderGeometry(3, 4, 6, 16, 1);
        furnaceGeometry.userData = { isSmelt: true }
        const furnaceMaterial = new THREE.MeshStandardMaterial({ color: "#8B5A2B", roughness: 0.8 }); // Clay/stone look
        furnaceMaterial.userData = { isSmelt: true }
        const furnace = new THREE.Mesh(furnaceGeometry, furnaceMaterial);
        furnace.userData = { isSmelt: true }
        furnace.position.set(0, 3, 0);
        smelt.add(furnace);

        // Furnace opening (arched door where iron/slag is extracted)
        const openingGeometry = new THREE.BoxGeometry(1.5, 2, 0.5);
        const openingMaterial = new THREE.MeshStandardMaterial({ color: "black", transparent: true, opacity: 0.5 });
        const opening = new THREE.Mesh(openingGeometry, openingMaterial);
        opening.position.set(0, 1.5, 2.01);
        smelt.add(opening);

        // Chimney hole at the top
        const chimneyGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
        const chimneyMaterial = new THREE.MeshStandardMaterial({ color: "black", roughness: 0.7 });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(0, 6.5, 0);
        smelt.add(chimney);

        // Charcoal/ore pile near furnace
        const oreGeometry = new THREE.SphereGeometry(1, 8, 8);
        const oreMaterial = new THREE.MeshStandardMaterial({ color: "#3B3B3B" });
        const orePile = new THREE.Mesh(oreGeometry, oreMaterial);
        orePile.position.set(2, 0.5, 2);
        smelt.add(orePile);

        smelt.position.set(position.x, position.y, position.z);
        scene.add(smelt);
        console.log(smelt);
        return smelt;
    }


}