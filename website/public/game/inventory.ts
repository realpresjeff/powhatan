export interface InventoryProps {
    scene: THREE.Scene;
    showContextMenu: Function;
}

export class Inventory {
    inventory = [{ name: "pickaxe" }]; // Array to store picked-up items
    scene = null;
    showContextMenu;
    inventoryLimit = 28;

    constructor({ scene, showContextMenu }: InventoryProps) {
        this.scene = scene;
        this.showContextMenu = showContextMenu;
        this.update_inventory_UI();
    }

    // Function to add an item to the inventory
    add_to_inventory(item) {
        if (this.inventory.length < this.inventoryLimit) {
            this.inventory.push(item); // Add item to inventory array
            this.update_inventory_UI(); // Update UI display
        } else return false;
    }

    // Function to update the popup menu with inventory items onInit
    update_inventory_UI() {
        const menuItems = document.getElementById("menu-items");
        menuItems.innerHTML = ""; // Clear existing items

        const fishNames = [
            "american shad",
            "longnose gar",
            "channel catfish",
            "bluegill",
            "brook trout",
            "smallmouth bass",
            "largemouth bass",
        ];

        this.inventory.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("menu-item");
            const icon = document.createElement("img");

            // Normalize for comparison
            const nameLower = item.name.toLowerCase();

            // If the item is one of the fish types → use fish.png
            let fileName;
            if (fishNames.includes(nameLower)) {
                fileName = "fish";
            } else if (nameLower.includes("log")) {
                fileName = "logs"
            } else {
                // Otherwise replace spaces with underscores
                fileName = item.name.replace(/\s+/g, "_");
            }

            icon.src = `./assets/items/${fileName}.png`;
            li.appendChild(icon)
            // li.style.backgroundColor = `#${item.color}`;
            li.oncontextmenu = (event) => this.showContextMenu(event, item);
            menuItems.appendChild(li);
        });
    }

    drop_item() {
        const contextMenu = document.getElementById('context-menu');

        // Get the selected item
        let selectedItem = contextMenu.selectedItem;

        if (selectedItem) {
            // Remove the selected item from the inventory array
            this.inventory = this.inventory.filter(item => item !== selectedItem && item !== undefined);

            // Drop the item on the ground at a random position (keep y-axis at the ground level)
            const itemGeometry = new THREE.BoxGeometry(1, 1, 1); // Simple item geometry (a cube)
            const itemMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color for the dropped item
            const item = new THREE.Mesh(itemGeometry, itemMaterial);

            // Set the position of the dropped item
            item.position.set(this.player.position.x, 0.5, this.player.position.z); // Adjust height to make sure it appears above the ground
            item.userData.isRemovable = true;
            item.userData.name = selectedItem.name;
            this.scene.add(item);
        }

        // Hide the context menu after the item is dropped
        contextMenu.style.display = 'none';
        this.update_inventory_UI();
    }
}


