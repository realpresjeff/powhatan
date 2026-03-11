import socket from './socket.js';
export var ChannelTabs;
(function (ChannelTabs) {
    ChannelTabs["general"] = "general";
    ChannelTabs["local"] = "local";
})(ChannelTabs || (ChannelTabs = {}));
export class Notifications {
    constructor(username, characterModel) {
        this.messagesDiv = document.getElementById("messages");
        this.messageInput = document.getElementById("messageInput");
        this.currentChatChannel = ChannelTabs.local;
        this.chatHistory = {
            general: [],
            local: []
        };
        // Send message on Enter key press
        this.messageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && e.target.value.length) {
                this.addMessage(username, e.target.value, this.currentChatChannel);
                socket.sendMessage('chat:send', {
                    username,
                    msg: e.target.value,
                    tab: this.currentChatChannel,
                    playerId: socket.socket.id
                });
                if (this.currentChatChannel === ChannelTabs.local) {
                    this.displayAboveCharacter(username, e.target.value, characterModel);
                }
                // this.chatHistory[this.currentChatChannel].push(`${username}: ${e.target.value}`);
                e.target.value = "";
            }
        });
        document.getElementById("send-message-button").onclick = (e) => {
            this.addMessage(username, this.messageInput.value);
        };
        document.querySelectorAll(".chat-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                // Set active tab
                document.querySelectorAll(".chat-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                // Switch channel
                this.currentChatChannel = tab.dataset.channel;
                this.renderChat();
            });
        });
        // Hide the context menu if clicked outside of it
        // document.addEventListener('click', function (event) {
        //     const contextMenu = document.getElementById('context-menu');
        //     if (!contextMenu.contains(event.target) && !event.target.classList.contains('menu-item')) {
        //         contextMenu.style.display = 'none';
        //     }
        // });
    }
    renderChat() {
        const chatBox = document.getElementById("messages");
        chatBox.innerHTML = "";
        const messages = this.chatHistory[this.currentChatChannel] || [];
        messages.forEach(msg => {
            const div = document.createElement("div");
            div.className = "chat-line";
            div.textContent = `${msg.user}: ${msg.text}`;
            chatBox.appendChild(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    // Add message to the chatbox
    addMessage(username, message, tab) {
        if (tab === this.currentChatChannel) {
            const msgElement = document.createElement("div");
            msgElement.classList.add("message");
            msgElement.innerHTML = `<span class="username">${username}:</span> ${message}`;
            this.messagesDiv.prepend(msgElement);
        }
    }
    displayAboveCharacter(username, message, character) {
        if (!character) {
            console.warn("Character model not found");
            return;
        }
        // -----------------------------
        // CANVAS SETUP
        // -----------------------------
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const width = 1000;
        const height = 128;
        canvas.width = width;
        canvas.height = height;
        // Clear with transparency
        ctx.clearRect(0, 0, width, height);
        // Text styling
        ctx.fillStyle = "yellow";
        ctx.font = "bold 72px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${message}`, width / 2, height / 2);
        // -----------------------------
        // THREE.JS SPRITE
        // -----------------------------
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });
        const sprite = new THREE.Sprite(material);
        // Size of the text in world units
        sprite.scale.set(4.5, 1.2, 1);
        // 🔑 LOCAL position above the head
        sprite.position.set(0, 3.5, 0);
        // Ensure it renders on top
        sprite.renderOrder = 999;
        // Attach to character so it follows movement
        character.add(sprite);
        // -----------------------------
        // CLEANUP
        // -----------------------------
        setTimeout(() => {
            character.remove(sprite);
            material.dispose();
            texture.dispose();
        }, 2000);
    }
    createTextCanvas(text) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 256;
        canvas.height = 128;
        // ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        return canvas;
    }
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
            event.stopPropagation(); // Prevent event propagation
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
