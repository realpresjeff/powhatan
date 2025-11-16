export class Inventory {
    constructor({ scene, showContextMenu }) {
        this.inventory = [{ name: "pickaxe" }]; // Array to store picked-up items
        this.scene = null;
        this.inventoryLimit = 28;
        this.scene = scene;
        this.showContextMenu = showContextMenu;
        this.update_inventory_UI();
    }
    // Function to add an item to the inventory
    add_to_inventory(item) {
        if (this.inventory.length < this.inventoryLimit) {
            this.inventory.push(item); // Add item to inventory array
            this.update_inventory_UI(); // Update UI display
        }
        else
            return false;
    }
    // Function to update the popup menu with inventory items onInit
    update_inventory_UI() {
        const menuItems = document.getElementById("menu-items");
        menuItems.innerHTML = ""; // Clear existing items
        this.inventory.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("menu-item");
            li.textContent = item.name;
            li.style.backgroundColor = `#${item.color}`;
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
