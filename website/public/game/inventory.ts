import * as THREE from 'three';

export interface InventoryProps {
    scene: THREE.Scene;
    player: THREE.Mesh;
    camera: THREE.Camera;
    mouse: any;
}

export class Inventory {
    inventory = [{ name: "pickaxe" }]; // Array to store picked-up items
    scene = null;
    player = null;
    camera = null;
    mouse = null;

    constructor({ scene, player, camera, mouse }: InventoryProps) {
        this.updateInventoryUI();
        this.scene = scene;
        this.player = player;
        this.camera = camera;
        this.mouse = mouse;
    }

    // Function to add an item to the inventory
    addToInventory(item) {
        this.inventory.push(item); // Add item to inventory array
        this.updateInventoryUI(); // Update UI display
    }

    enable_left_click_interaction() {
        document.addEventListener('click', (event) => {
            if (event.button === 0) { // Left-click to interact
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, this.camera);
                const intersects = raycaster.intersectObjects(this.scene.children);

                if (intersects.length > 1) {
                    const object = intersects[0].object;
                    // Check if the object is a "dropped item"
                    if (object.userData) {
                        this.addToInventory(object.userData);
                        this.scene && this.scene.remove(object);
                    }
                }
            }
        });
    }

    // Function to update the popup menu with inventory items onInit
    updateInventoryUI() {
        const menuItems = document.getElementById("menu-items");
        menuItems.innerHTML = ""; // Clear existing items

        this.inventory.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("menu-item");
            li.textContent = item.name;
            li.style.backgroundColor = `#${item.color}`;
            li.oncontextmenu = (event) => showContextMenu(event, item);
            menuItems.appendChild(li);
        });
    }

    dropItem() {
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
        this.updateInventoryUI();
    }
}


