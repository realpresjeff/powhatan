class Fletch {
            // Opens the Fletching UI
            function fletch() {
                const fletchUI = document.getElementById("fletchUI");
                const fletchItemsContainer = document.getElementById("fletch-items");
                fletchItemsContainer.innerHTML = ""; // Clear previous items
    
                // List of fletchable items
                const fletchableItems = [
                    { name: "Shortbow", material: "log", cost: 1 },
                    { name: "Longbow", material: "log", cost: 2 },
                    { name: "Arrow Shafts", material: "log", cost: 1 },
                    { name: "Arrows", material: "arrow shafts", secondary: "arrow heads", cost: 1 },
                    { name: "Crossbow", material: "log", secondary: "iron bar", cost: 1 }
                ];
    
                // Generate item grid
                fletchableItems.forEach(item => {
                    const itemElement = document.createElement("div");
                    itemElement.classList.add("fletch-item");
                    itemElement.innerHTML = `
                <div class="fletch-item-name">${item.name}</div>
                <button onclick="fletchItem('${item.name}', '${item.material}', '${item.secondary || ""}', ${item.cost})">Fletch</button>
            `;
                    fletchItemsContainer.appendChild(itemElement);
                    playerObj.updateExperience('craft', item.cost * 4);
                });
    
                // Show the fletching UI
                fletchUI.style.display = "block";
            }
    
            // Toggles the Fletching UI
            function toggleFletchUI() {
                const fletchUI = document.getElementById("fletchUI");
                fletchUI.style.display = (fletchUI.style.display === "block") ? "none" : "block";
            }
    
            function fletchItem(itemName, material, secondary, cost, type) {
                function getInventoryItemByMaterial(material) {
                    let foundItem = 0; // Default to 0 if no match is found
    
                    inventory.map(item => {
                        if (item.name.toLowerCase().includes(material.toLowerCase())) {
                            return foundItem = item; // Store the first matching item quantity
                        }
                    });
    
                    return foundItem;
                }
    
                const inventoryItem = getInventoryItemByMaterial(material);
                const secondaryItem = getInventoryItemByMaterial(secondary);
    
                // Check if player has enough primary material
                if (inventoryItem && inventoryItem.quantity < cost) {
                    return console.log(`Not enough ${material} to fletch ${itemName}.`);
                }
    
                // If secondary material is required, check for it
                else if (secondaryItem && secondary && secondaryItem.quantity < cost) {
                    return console.log(`Not enough ${secondary} to fletch ${itemName}.`);
                }
    
                else if (inventoryItem) {
                    // Deduct materials
                    removeFromInventory(inventoryItem, cost)
                    if (secondary) {
                        removeFromInventory(secondaryItem, cost)
                    }
    
                    // Add the fletched item
                    addToInventory({ name: `${type && type || ""} ${inventoryItem.type} ${itemName}`, type: inventoryItem.type, equipable: true, equipType: 'both_hands', pickupable: true })
                    updateInventoryUI();
                }
            }
    
}