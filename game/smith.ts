class Smith {
            // Opens the Smithing UI
            function smith() {
                const smithUI = document.getElementById("smithUI");
                const smithItemsContainer = document.getElementById("smithItems");
                smithItemsContainer.innerHTML = ""; // Clear previous items
    
                // List of smithable items
                const smithableItems = [
                    { name: "Arrow Heads", material: "bar", cost: 1 },
                    { name: "Platelegs", material: "bar", cost: 3 },
                    { name: "Chestplate", material: "bar", cost: 5 },
                    { name: "Boots", material: "bar", cost: 2 },
                    { name: "Gloves", material: "bar", cost: 1 },
                    { name: "Sword", material: "bar", cost: 3 },
                    { name: "Shield", material: "bar", cost: 4 }
                ];
    
                // Generate item grid
                smithableItems.forEach(item => {
                    const itemElement = document.createElement("div");
                    itemElement.classList.add("smith-item");
                    itemElement.innerHTML = `
                <div class="smith-item-name">${item.name}</div>
                <button onclick="fletchItem('${item.name}', '${item.material}', '${item.secondary || ""}', ${item.cost})">Smith</button>
            `;
                    smithItemsContainer.appendChild(itemElement);
    
                    playerObj.updateExperience("craft", 10);
                });
    
                // Show the smithing UI
                smithUI.style.display = "block";
    
                createPopup('Inventory');
            }
    
            // Toggles the smith UI
            function toggleSmithUI() {
                const smithUI = document.getElementById("smithUI");
                smithUI.style.display = (smithUI.style.display === "block") ? "none" : "block";
            }
            function createAnvil(position) {
                const anvil = new THREE.Group();
                anvil.userData = { isAnvil: true }
    
                anvil.position.set(position.x, position.y, position.z);
    
                const loader = new THREE.GLTFLoader();
                loader.load('assets/anvil_three.glb', function (gltf) {
                    anvil.add(gltf.scene);
                }, undefined, function (error) {
                    console.error("Error loading model:", error);
                });
    
                scene.add(anvil);
                return anvil;
            }
    
    
}