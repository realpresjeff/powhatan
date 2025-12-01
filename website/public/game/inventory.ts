export interface InventoryProps {
    scene: THREE.Scene;
    showContextMenu: Function;
    character;
    player;
}

export class Inventory {
    inventory = []; // Array to store picked-up items
    scene = null;
    showContextMenu;
    inventoryLimit = 28;
    character = null;
    player = null;

    constructor({ scene, showContextMenu, character, player }: InventoryProps) {
        this.scene = scene;
        this.showContextMenu = showContextMenu;
        this.character = character;
        this.player = player;
        console.log(scene);
        // this.update_inventory_UI();
    }

    // Function to add an item to the inventory
    add_to_inventory(item) {
        if (this.inventory.length < this.inventoryLimit) {
            this.inventory.push(item); // Add item to inventory array
            this.update_inventory_UI(); // Update UI display
            console.log(item);
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
                if (nameLower.includes("burnt")) {
                    fileName = "burnt_fish"
                } else if (nameLower.includes("cooked")) {
                    fileName = "cooked_fish"
                } else if (nameLower.includes("shortbow")) {
                    fileName = "shortbow"
                } else if (nameLower.includes("longbow")) {
                    fileName = "longbow"
                } else if (nameLower.includes("shaft")) {
                    fileName = "arrow_shafts"
                } else if (nameLower.includes("arrow")) {
                    fileName = "arrows"
                } else if (nameLower.includes("crossbow")) {
                    fileName = "crossbow"
                } else {
                    // Otherwise replace spaces with underscores
                    fileName = nameLower.replace(/\s+/g, "_");
                }
            }

            icon.src = `./assets/items/${fileName}.png`;
            li.appendChild(icon)
            // li.style.backgroundColor = `#${item.color}`;
            li.oncontextmenu = (event) => this.showInventoryContextMenu(event, item);
            menuItems.appendChild(li);
        });
    }

    showInventoryContextMenu(event, item) {
        event.preventDefault(); // Prevent default right-click menu

        const contextMenu = document.getElementById("context-menu");
        contextMenu.innerHTML = ""; // Clear previous options

        // Equip option (only for equipable items)
        if (item.equipable) {
            const equipOption = document.createElement("div");
            equipOption.textContent = `Equip ${item.name}`;
            equipOption.className = "context-menu-item";
            equipOption.onclick = () => this.equipItem(item);
            contextMenu.appendChild(equipOption);
        }

        // if (this.banking) {
        //     this.openContextMenu(event, item);
        // }

        if (item.fletch) {
            const fletchOption = document.createElement("div");
            fletchOption.textContent = `Fletch ${item.name}`;
            fletchOption.className = "context-menu-item";
            fletchOption.onclick = () => this.character.fletch(item);
            contextMenu.appendChild(fletchOption);
        }

        if (item.flammable) {
            const startFireOption = document.createElement("div");
            startFireOption.textContent = `Start fire`;
            startFireOption.className = "context-menu-item";
            console.log(this.player);
            startFireOption.onclick = () => this.startFire(this.player.position, item, 1);
            contextMenu.appendChild(startFireOption);
        }

        if (this.character.banking) {
            if (this.character.withdrawing) {
                // Banking mode - Show deposit options
                // Clear previous menu
                contextMenu.innerHTML = "";

                // Create a helper function
                function buildOption(label, amount) {
                    const li = document.createElement("li");
                    li.textContent = label;
                    li.addEventListener("click", () => {
                        this.character.withdrawItem(item, amount);
                    });
                    return li;
                }

                // Add menu options
                contextMenu.appendChild(buildOption.call(this, "Withdraw-1", 1));
                contextMenu.appendChild(buildOption.call(this, "Withdraw-5", 5));
                contextMenu.appendChild(buildOption.call(this, "Withdraw-10", 10));
                contextMenu.appendChild(buildOption.call(this, "Withdraw-All", "all"));
            } else {
                // Drop option (always available)
                const dropOption = document.createElement("div");
                dropOption.textContent = `Deposit ${item.name}`;
                dropOption.className = "context-menu-item";
                this.character.currentBankingItem = item;
                dropOption.onclick = () => this.character.depositItem(item.quantity || 1);
                contextMenu.appendChild(dropOption);
            }
        } else {
            // Drop option (always available)
            const dropOption = document.createElement("div");
            dropOption.textContent = `Drop ${item.name}`;
            dropOption.className = "context-menu-item";
            dropOption.onclick = () => this.drop_item(item);
            contextMenu.appendChild(dropOption);
        }

        // Position and show menu
        contextMenu.style.display = "block";
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        // Store selected item
        contextMenu.selectedItem = item;

        // Hide menu when clicking anywhere else
        document.addEventListener("click", this.closeContextMenu);
        const popup = document.querySelector('.popup');
        popup.addEventListener("click", this.closeContextMenu)
        contextMenu.addEventListener("click", this.closeContextMenu);
    }

    startFire(position, selectedWood, cost) {
        this.character.createOpenLogFire({ x: position.x, y: 1, z: position.z });
        this.character.addExperience('craft', cost * 4);
        this.removeFromInventory(selectedWood, cost);
        this.update_inventory_UI()
        this.closeContextMenu();
    }

    // Function to close the context menu
    closeContextMenu() {
        const contextMenu = document.getElementById('context-menu');

        // Check if the click was inside the menu
        contextMenu.style.display = 'none';
        document.removeEventListener("click", this.closeContextMenu); // Remove event listener to avoid unnecessary calls

    }

    // Function to handle menu option selection
    onMenuOptionClick(action) {
        const contextMenu = document.getElementById('context-menu');

        // Handle different actions (e.g., Equip, Drop, etc.)
        if (action === "equip") {
            this.equipItem(contextMenu.selectedItem);
        } else if (action === "drop") {
            this.removeFromInventory(contextMenu.selectedItem);
        }

        // Hide the menu after selection
        contextMenu.style.display = "none";
        document.removeEventListener("click", this.closeContextMenu);
    }

    drop_item() {
        const contextMenu = document.getElementById('context-menu');

        // Get the selected item
        let selectedItem = contextMenu.selectedItem;

        if (selectedItem) {
            console.log(this.inventory);
            // Drop the item on the ground at a random position (keep y-axis at the ground level)
            const itemGeometry = new THREE.BoxGeometry(1, 1, 1); // Simple item geometry (a cube)
            const itemMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color for the dropped item
            const item = new THREE.Mesh(itemGeometry, itemMaterial);

            // Set the position of the dropped item
            // item.position.set(data.meshData.position.x, 0.5, data.meshData.position.z); // Adjust height to make sure it appears above the ground
            item.userData = { ...selectedItem };
            // items = { ...items, [item.uuid]: item }
            this.scene.add(item);
            console.log(this.scene);
            // socket.emit("message", { type: "item_mesh", meshData: { ...selectedItem, position: player.position } });
        }

        // Hide the context menu after the item is dropped
        contextMenu.style.display = 'none';

        // Remove the selected item from the inventory array
        this.inventory = this.inventory.filter(item => item !== selectedItem && item !== undefined);

        this.update_inventory_UI();
    }

    removeFromInventory(item, quantity = 1) {
        console.log(this.inventory);
        let index = this.inventory.findIndex(i => i.name === item.name);

        if (index !== -1) {
            console.log(this.inventory[index])
            if (this.inventory[index].quantity > quantity) {
                this.inventory[index].quantity = this.inventory[index].quantity - quantity; // Reduce quantity
            } else {
                this.inventory.splice(index, 1); // Remove item if quantity reaches 0
            }
            console.log(`Removed ${quantity} ${item.name} from inventory.`);

            this.update_inventory_UI();
        } else {
            console.log(`Item ${item.name} not found in inventory.`);
        }
    }


    // Hide the context menu if clicked outside of it
    // document.addEventListener('click', function(event) {
    //         const contextMenu = document.getElementById('context-menu');
    //         if (!contextMenu.contains(event.target) && !event.target.classList.contains('menu-item')) {
    //             contextMenu.style.display = 'none';
    //         }
    //     })
}


