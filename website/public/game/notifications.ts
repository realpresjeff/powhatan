export class Notifications {
    // Function to show the popup
    createPopup(content) {
        const popup = document.getElementById('popup');
        const popupText = document.getElementById('popup-text');

        // Set the content for the popup
        popupText.textContent = content;

        // Display the popup and trigger the animation
        popup.style.display = 'flex';
    }

    // Show the context menu when right-clicking a menu item
    showContextMenu(event, item) {
        event.preventDefault(); // Prevent default right-click menu

        // Get the context menu and position it at the mouse coordinates
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        // Store the selected item for later (in case we want to drop it)
        contextMenu.selectedItem = item;
    }


        // Hide the context menu if clicked outside of it
        document.addEventListener('click', function(event) {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu.contains(event.target) && !event.target.classList.contains('menu-item')) {
            contextMenu.style.display = 'none';
        }
    });

    // Function to hide the popup
    hidePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none'; // Hide the popup
    }

    stop_clicks_from_reaching_canvas_on_popup_interaction() {
        // Stop clicks from reaching the canvas when interacting with the popup
        document.getElementById('popup').addEventListener('click', function (event) {
            // Prevent the click from propagating to the background (e.g., canvas)
            event.stopPropagation();
        });

        // Prevent clicks on the popup content from being passed to the canvas
        document.querySelector('.popup-content').addEventListener('click', function (event) {
            // This will stop the event from propagating to the background elements
            event.stopPropagation();
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

    close_popup() {
        // Close the popup when the close button is clicked
        document.getElementById('popup-close').addEventListener('click', hidePopup);
    }

    create_popup_buttons() {
        // In-world UI buttons for opening popups
        document.getElementById('inventory').addEventListener('click', () => {
            createPopup('Inventory');
        });
        document.getElementById('stats').addEventListener('click', () => {
            showStats();
        });
        document.getElementById('worn').addEventListener('click', () => {
            createPopup('Worn');
        });
        document.getElementById('combat').addEventListener('click', () => {
            createPopup('Combat Settings');
        });
    }
}