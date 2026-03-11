import socket from './socket.js';
export class Inventory {
    /*
    tradeId => {
      id,
      players: [socketIdA, socketIdB],
      offers: {
        socketIdA: [],
        socketIdB: []
      },
      accepted: {
        socketIdA: false,
        socketIdB: false
      }
    }
    */
    constructor({ scene, showContextMenu, character, player }) {
        this.inventory = []; // Array to store picked-up items
        this.scene = null;
        this.inventoryLimit = 28;
        this.character = null;
        this.player = null;
        this.activeTrade = false;
        this.scene = scene;
        this.showContextMenu = showContextMenu;
        this.character = character;
        this.player = player;
        // this.update_inventory_UI();
        console.log(this.activeTrade);
    }
    add_to_inventory(item) {
        var _a;
        const isStackable = typeof item.quantity === "number" && item.quantity > 1;
        // If stackable → try merging first
        if (isStackable) {
            const existing = this.inventory.find(i => i.name === item.name);
            if (existing) {
                existing.quantity += (_a = item.quantity) !== null && _a !== void 0 ? _a : 1;
                this.update_inventory_UI();
                return true;
            }
            // Normalizing quantity if missing
            if (item.quantity === undefined)
                item.quantity = 1;
        }
        // If non-stackable → check inventory space
        if (this.inventory.length >= this.inventoryLimit) {
            console.warn("Inventory full!");
            return false;
        }
        this.inventory.push(item);
        this.update_inventory_UI();
        return true;
    }
    // Function to add an item to the inventory
    // add_to_inventory(item: Item) {
    //     if (this.inventory.length < this.inventoryLimit) {
    //         this.inventory.push(item); // Add item to inventory array
    //         this.update_inventory_UI(); // Update UI display
    //         console.log(item);
    //     } else return false;
    // }
    grab_item_image(itemName) {
        // Normalize for comparison
        const nameLower = itemName.toLowerCase();
        const fishNames = [
            "american shad",
            "longnose gar",
            "channel catfish",
            "bluegill",
            "brook trout",
            "smallmouth bass",
            "largemouth bass",
        ];
        let fileName;
        // If the item is one of the fish types → use fish.png
        if (fishNames.includes(nameLower)) {
            fileName = "fish";
        }
        else if (nameLower.includes("log")) {
            fileName = "logs";
        }
        else {
            if (nameLower.includes("burnt")) {
                fileName = "burnt_fish";
            }
            else if (nameLower.includes("cooked")) {
                fileName = "cooked_fish";
            }
            else if (nameLower.includes("shortbow")) {
                fileName = "shortbow";
            }
            else if (nameLower.includes("longbow")) {
                fileName = "longbow";
            }
            else if (nameLower.includes("heads")) {
                fileName = "arrow_heads";
            }
            else if (nameLower.includes("shaft")) {
                fileName = "arrow_shafts";
            }
            else if (nameLower.includes("arrow")) {
                fileName = "arrows";
            }
            else if (nameLower.includes("crossbow")) {
                fileName = "crossbow";
            }
            else {
                // Otherwise replace spaces with underscores
                fileName = nameLower.replace(/\s+/g, "_");
            }
        }
        return fileName;
    }
    // Function to update the popup menu with inventory items onInit
    update_inventory_UI() {
        const menuItems = document.getElementById("menu-items");
        menuItems.innerHTML = ""; // Clear existing items
        this.inventory.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("menu-item");
            const icon = document.createElement("img");
            const fileName = item.imageName || this.grab_item_image(item.name);
            icon.src = `./assets/items/${fileName}.png`;
            li.appendChild(icon);
            // li.style.backgroundColor = `#${item.color}`;
            li.oncontextmenu = (event) => this.showInventoryContextMenu(event, item);
            menuItems.appendChild(li);
            if (item.quantity > 1) {
                const qty = document.createElement("span");
                qty.className = "item-qty";
                qty.textContent = item.quantity;
                li.appendChild(qty);
            }
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
            equipOption.onclick = () => this.character.equipItem(item);
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
            startFireOption.onclick = () => this.startFire(this.player.position, item, 1);
            contextMenu.appendChild(startFireOption);
        }
        if (item.edible) {
            const eatOption = document.createElement("div");
            eatOption.textContent = `Eat ${item.name}`;
            eatOption.className = "context-menu-item";
            eatOption.onclick = () => this.character.eat(item);
            contextMenu.appendChild(eatOption);
        }
        if (item.name.toLowerCase().includes('fur')) {
            const craftOption = document.createElement("div");
            craftOption.textContent = `Craft ${item.name}`;
            craftOption.className = "context-menu-item";
            console.log(item);
            craftOption.onclick = () => this.character.craft(item);
            document.getElementById("craft-close-button").onclick = () => this.character.toggleCraftUI();
            contextMenu.appendChild(craftOption);
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
            }
            else {
                // Drop option (always available)
                const dropOption = document.createElement("div");
                dropOption.textContent = `Deposit ${item.name}`;
                dropOption.className = "context-menu-item";
                this.character.currentBankingItem = item;
                dropOption.onclick = () => this.character.depositItem(item.quantity || 1);
                contextMenu.appendChild(dropOption);
            }
        }
        else {
            // Drop option (always available)
            const dropOption = document.createElement("div");
            dropOption.textContent = `Drop ${item.name}`;
            dropOption.className = "context-menu-item";
            dropOption.onclick = () => this.drop_item_via_websocket(item);
            contextMenu.appendChild(dropOption);
        }
        console.log(this.activeTrade);
        if (socket.isTrading) {
            const option = document.createElement("div");
            option.textContent = `Offer ${item.name}`;
            option.className = "context-menu-item";
            option.onclick = () => {
                socket.sendMessage("trade_offer_item", {
                    tradeId: socket.currentTradeId,
                    item
                });
            };
            contextMenu.appendChild(option);
        }
        if (item.summonable) {
            console.log(item);
            const dropOption = document.createElement("div");
            dropOption.textContent = `Summon ${item.name}`;
            dropOption.className = "context-menu-item";
            dropOption.onclick = () => this.character.summonMonster(item);
            ;
            contextMenu.appendChild(dropOption);
        }
        if (item.dismissable) {
            console.log(item);
            const dropOption = document.createElement("div");
            dropOption.textContent = `Dismiss ${item.name}`;
            dropOption.className = "context-menu-item";
            dropOption.onclick = () => this.character.dismissSummon(item);
            ;
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
        popup.addEventListener("click", this.closeContextMenu);
        contextMenu.addEventListener("click", this.closeContextMenu);
    }
    startFire(position, selectedWood, cost) {
        this.character.createOpenLogFire({ x: position.x, y: 1, z: position.z });
        this.character.addExperience('craft', cost * 4);
        this.removeFromInventory(selectedWood, cost);
        this.update_inventory_UI();
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
            this.character.equipItem(contextMenu.selectedItem);
        }
        else if (action === "drop") {
            this.removeFromInventory(contextMenu.selectedItem);
        }
        // Hide the menu after selection
        contextMenu.style.display = "none";
        document.removeEventListener("click", this.closeContextMenu);
    }
    drop_item_via_websocket(item) {
        const res = socket.sendMessage("drop_item", {
            name: item.name,
            item,
            position: {
                x: this.character.base.position.x,
                y: this.character.base.position.y,
                z: this.character.base.position.z
            }
        });
        console.log(res);
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
            item.userData = Object.assign({}, selectedItem);
            // items = { ...items, [item.uuid]: item }
            // Position the item exactly where the player is standing
            item.position.set(this.player.position.x, 0, // slightly above ground so it doesn't clip
            this.player.position.z);
            this.scene.add(item);
            // socket.emit("message", { type: "item_mesh", meshData: { ...selectedItem, position: player.position } });
        }
        // Hide the context menu after the item is dropped
        contextMenu.style.display = 'none';
        // Remove the selected item from the inventory array
        this.inventory = this.inventory.filter(item => item !== selectedItem && item !== undefined);
        this.update_inventory_UI();
    }
    removeFromInventory(item, qty = 1) {
        const index = this.inventory.findIndex(i => i.name === item.name);
        if (index === -1)
            return false;
        const invItem = this.inventory[index];
        const isStackable = typeof invItem.quantity === "number";
        if (isStackable) {
            invItem.quantity -= qty;
            if (invItem.quantity <= 0) {
                this.inventory.splice(index, 1);
            }
            this.update_inventory_UI();
            return true;
        }
        // Non-stackable
        this.inventory.splice(index, 1);
        this.update_inventory_UI();
        return true;
    }
    // removeFromInventory(item, quantity = 1) {
    //     console.log(item.name);
    //     console.log(this.inventory);
    //     let index = this.inventory.findIndex(i => i.name === item.name);
    //     if (index !== -1) {
    //         console.log(this.inventory[index])
    //         if (this.inventory[index].quantity > quantity) {
    //             this.inventory[index].quantity = this.inventory[index].quantity - quantity; // Reduce quantity
    //         } else {
    //             this.inventory.splice(index, 1); // Remove item if quantity reaches 0
    //         }
    //         console.log(`Removed ${quantity} ${item.name} from inventory.`);
    //         this.update_inventory_UI();
    //     } else {
    //         console.log(`Item ${item.name} not found in inventory.`);
    //     }
    // }
    findItemByName(name) {
        return this.inventory.find(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }
}
