class Inventory { 
    let inventory = [{ name: "pickaxe", equipable: true, equipType: "both_hands", quantity: 1, pickupable: true, icon: "./assets/items/pickaxe.png" }, { name: "steel helmet", equipable: true, equipType: "helmet", quantity: 1, pickupable: true }, { name: "iron ore", quantity: 5, type: "iron", pickupable: true }]; // Array to store picked-up items

    // Function to add an item to the inventory
    function addToInventory(item) {
        // Check if the item already exists in the inventory
        const existingItem = inventory.find(i => i.name === item.name);

        if (existingItem) {
            // If item exists, increase the quantity
            existingItem.quantity += item.quantity || 1;
        } else {
            // If item doesn't exist, add the new item to the inventory
            inventory.push({ ...item, quantity: item.quantity || 1 });
        }
        updateInventoryUI();
    }

    // Function to update the popup menu with inventory items onInit
    updateInventoryUI();

    // Function to update the popup menu with inventory items (called after adding/removing items)
    function updateInventoryUI() {
        const menuItems = document.getElementById("menu-items");
        menuItems.innerHTML = ""; // Clear existing items

        inventory.forEach((item) => {
            if (item) {
                const li = document.createElement("li");
                li.classList.add("menu-item");
                li.textContent = `${item.name} x${item.quantity}`;  // Display quantity alongside item name
                li.style.backgroundColor = `#${item.color || 'FFFFFF'}`;  // Optional color for item
                li.oncontextmenu = (event) => showInventoryContextMenu(event, item);
                menuItems.appendChild(li);
            }
        });
    }

    // Smooth movement function (player movement)
    function movePlayer() {
        if (isMoving) {
            player.position.lerp(targetPosition, moveSpeed);
            if (player.position.distanceTo(targetPosition) < 0.1) {
                isMoving = false;
            }
        }
    }

    // Function to show the popup
    function createPopup(content) {
        const popup = document.getElementById('popup');
        // const popupText = document.getElementById('popup-text');

        // // Set the content for the popup
        // popupText.textContent = content;

        // Display the popup and trigger the animation
        popup.style.display = 'flex';
    }

    function showInventoryContextMenu(event, item) {
        event.preventDefault(); // Prevent default right-click menu

        const contextMenu = document.getElementById("context-menu");
        contextMenu.innerHTML = ""; // Clear previous options

        // Equip option (only for equipable items)
        if (item.equipable) {
            const equipOption = document.createElement("div");
            equipOption.textContent = `Equip ${item.name}`;
            equipOption.className = "context-menu-item";
            equipOption.onclick = () => equipItem(item);
            contextMenu.appendChild(equipOption);
        }

        if (banking) {
            openContextMenu(event, item);
        }

        if (item.fletch) {
            const fletchOption = document.createElement("div");
            fletchOption.textContent = `Fletch ${item.name}`;
            fletchOption.className = "context-menu-item";
            fletchOption.onclick = () => fletch(item);
            contextMenu.appendChild(fletchOption);
        }


        if (item.flammable) {
            const startFireOption = document.createElement("div");
            startFireOption.textContent = `Start fire`;
            startFireOption.className = "context-menu-item";
            startFireOption.onclick = () => startFire(player.position, item, 1);
            contextMenu.appendChild(startFireOption);
        }

        // Drop option (always available)
        const dropOption = document.createElement("div");
        dropOption.textContent = `Drop ${item.name}`;
        dropOption.className = "context-menu-item";
        dropOption.onclick = () => dropItem(item);
        contextMenu.appendChild(dropOption);



        // Position and show menu
        contextMenu.style.display = "block";
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        // Store selected item
        contextMenu.selectedItem = item;

        // Hide menu when clicking anywhere else
        document.addEventListener("click", closeContextMenu);
        const popup = document.querySelector('#popup');
        console.log(popup)
        popup.addEventListener("click", closeContextMenu)
        contextMenu.addEventListener("click", closeContextMenu);
    }

    // Function to close the context menu
    function closeContextMenu(event) {
        const contextMenu = document.getElementById('context-menu');

        // Check if the click was inside the menu
        contextMenu.style.display = 'none';
        document.removeEventListener("click", closeContextMenu); // Remove event listener to avoid unnecessary calls

    }

    // Function to handle menu option selection
    function onMenuOptionClick(action) {
        const contextMenu = document.getElementById('context-menu');

        // Handle different actions (e.g., Equip, Drop, etc.)
        if (action === "equip") {
            equipItem(contextMenu.selectedItem);
        } else if (action === "drop") {
            removeFromInventory(contextMenu.selectedItem);
        }

        // Hide the menu after selection
        contextMenu.style.display = "none";
        document.removeEventListener("click", closeContextMenu);
    }

    function startFire(position, selectedWood, cost) {
        createOpenLogFire({ x: position.x, y: position.y, z: position.z });
        playerObj.updateExperience('craft', cost * 4);
        removeFromInventory(selectedWood, cost);
        updateInventoryUI()
        hidePopup();
    }

    function dropItem() {
        const contextMenu = document.getElementById('context-menu');

        // Get the selected item
        let selectedItem = contextMenu.selectedItem;

        if (selectedItem) {
            // Remove the selected item from the inventory array
            inventory = inventory.filter(item => item !== selectedItem && item !== undefined);

            console.log(inventory);

            socket.emit("message", { type: "item_mesh", meshData: { ...selectedItem, position: player.position } });
        }

        // Hide the context menu after the item is dropped
        contextMenu.style.display = 'none';
        updateInventoryUI();
    }

    function removeFromInventory(item, quantity = 1) {
        console.log(inventory);
        let index = inventory.findIndex(i => i.name === item.name);

        if (index !== -1) {
            console.log(inventory[index])
            if (inventory[index].quantity > quantity) {
                inventory[index].quantity = inventory[index].quantity - quantity; // Reduce quantity
            } else {
                inventory.splice(index, 1); // Remove item if quantity reaches 0
            }
            console.log(`Removed ${quantity} ${item.name} from inventory.`);

            updateInventoryUI();
        } else {
            console.log(`Item ${item.name} not found in inventory.`);
        }
    }

        // Hide the context menu if clicked outside of it
        document.addEventListener('click', function (event) {
            const contextMenu = document.getElementById('context-menu');
            if (!contextMenu.contains(event.target) && !event.target.classList.contains('menu-item')) {
                contextMenu.style.display = 'none';
            }
        });

        // Function to hide the popup
        function hidePopup() {
            const popup = document.getElementById('popup');
            popup.style.display = 'none'; // Hide the popup
        }

        // Stop clicks from reaching the canvas when interacting with the popup
        // document.getElementById('popup').addEventListener('click', function (event) {
        //     // Prevent the click from propagating to the background (e.g., canvas)
        //     event.stopPropagation();
        // });

        // Prevent clicks on the popup content from being passed to the canvas
        // document.querySelector('.popup-content').addEventListener('click', function (event) {
        //     // This will stop the event from propagating to the background elements
        //     event.stopPropagation();
        // });


        // Close the popup when the close button is clicked
        document.getElementById('popup-close').addEventListener('click', hidePopup);


        // In-world UI buttons for opening popups
        document.getElementById('inventory').addEventListener('click', () => {
            createPopup('Inventory');
        });

        document.getElementById('stats').addEventListener('click', () => {
            showStats();
        });

        // Prevent the "Drop item" button click from affecting the canvas
        document.getElementById('drop-item-button').addEventListener('click', function (event) {
            // Stop the event propagation so it doesn't trigger canvas interactions
            event.stopPropagation();

            // Logic to drop the item here (this can be your function to drop the item)
        });


        // Function to handle the "Drop item" button click
        document.getElementById('drop-item-button').addEventListener('click', function (event) {
            event.stopPropagation();  // Prevent event propagation
        });
}