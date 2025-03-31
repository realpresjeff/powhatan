interface BankConstructorProps {
    currentBankingItem: any;
    removeFromInventory: Function;
    updateInventoryUI: Function;
    addToInventory: Function;
}

class Bank {
    bankStorage = {};
    banking = false;
    currentBankingItem = null;
    removeFromInventory;
    updateInventoryUI;
    addToInventory;

    constructor({ currentBankingItem, removeFromInventory, updateInventoryUI, addToInventory }: BankConstructorProps) {
        this.currentBankingItem = currentBankingItem;
        this.removeFromInventory = removeFromInventory;
        this.updateInventoryUI = updateInventoryUI;
        this.addToInventory = addToInventory;
    }

    // Opens Bank UI
    openBank() {
        // @ts-ignore
        document.getElementById("bankUI").style.display = "block";
        // @ts-ignore
        document.getElementById("popup").style.display = "block";
        this.updateBankDisplay();
        this.banking = true;
    }

    // Closes Bank UI
    closeBank() {
        // @ts-ignore
        document.getElementById("bankUI").style.display = "none";
        // @ts-ignore
        document.getElementById("popup").style.display = "none";
        this.banking = false;
    }

    // Getter for bank storage
    getBankStorage(itemName) {
        return this.bankStorage[itemName] || null;
    }

    // Setter for bank storage (handles stacking properly)
    setBankStorage(itemName, quantity, withdraw = false) {
        if (this.bankStorage[itemName]) {
            if (withdraw) {
                this.bankStorage[itemName].quantity -= quantity;
            } else {
                this.bankStorage[itemName].quantity += quantity;
            }
        } else {
            this.bankStorage[itemName] = { name: itemName, quantity: quantity };
        }
    }

    // Deposits an item into the bank
    depositItem(quantity) {
        if (!this.currentBankingItem) {
            console.log(`Not enough ${this.currentBankingItem?.name} to deposit.`);
            return;
        }

        // Handle "all" case and ensure we don’t overdraw
        if (quantity === "all" || quantity >= this.currentBankingItem?.quantity) {
            quantity = this.currentBankingItem?.quantity;
        }

        // Remove from inventory first
        this.removeFromInventory(this.currentBankingItem, quantity);

        // Use setter to update bank storage
        this.setBankStorage(this.currentBankingItem.name, quantity);

        this.updateBankDisplay();
        this.updateInventoryUI();
    }

    // Withdraws an item from the bank
    withdrawItem(itemName, quantity) {
        let bankedItem = this.getBankStorage(itemName);

        if (!bankedItem) {
            console.log(`Not enough ${itemName} in the bank.`);
            return;
        }

        // Handle "all" case and ensure we don’t overdraw
        if (quantity === "all" || quantity > bankedItem.quantity) {
            quantity = bankedItem.quantity;
        }

        this.setBankStorage(itemName, quantity, true); // Update storage

        // Add the item to the player's inventory
        this.addToInventory({ ...bankedItem, quantity });
        this.updateBankDisplay();
        this.updateInventoryUI();
    }

    // Updates the bank UI
    updateBankDisplay() {
        let bankUI = document.getElementById("bankItems");
        bankUI.innerHTML = "";

        for (let item in this.bankStorage) {
            let itemElement = document.createElement("div");
            itemElement.className = "bank-item";
            itemElement.innerHTML = `<img src="spell-icon.png"> ${this.bankStorage[item].name} x${this.bankStorage[item].quantity}`;

            itemElement.addEventListener("click", () => this.withdrawItem(item, this.bankStorage[item].quantity)); // Left-click withdraw all
            itemElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                openContextMenu(e, item, "withdraw");
            });

            bankUI.appendChild(itemElement);
        }
    }

}