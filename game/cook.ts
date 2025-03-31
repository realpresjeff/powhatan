class Cook {
    function cook(cookingMethod) {
        console.log(cookingMethod);
        let cookedItems = [];
        let burntItems = [];
        let craftExpDrain = 500; // Craft XP drains per cook attempt
        let baseSuccessRate = Math.min(95, Math.max(30, playerObj.skills.craft / 1000000)); // 30% min, 95% max

        inventory.forEach(item => {
            if (item.raw && item.cookable) {
                let successRate = Math.max(10, baseSuccessRate - (5000000 / (playerObj.skills.craft + 1))); // XP drain affects success
                let success = Math.random() * 100 < successRate;

                let cookedItem = {
                    name: success ? `Cooked ${item.name}` : `Burnt ${item.name}`,
                    raw: false,
                    pickupable: true,
                    cookable: success && item.cookable // Cooked items might stay cookable
                };

                removeFromInventory(item, 1);
                addToInventory(cookedItem);

                if (success) {
                    cookedItems.push(cookedItem.name);
                    playerObj.updateExperience("craft", 10);
                } else {
                    burntItems.push(cookedItem.name);
                    playerObj.updateExperience("craft", 1);
                }
            }
        });

        if (cookedItems.length > 0 || burntItems.length > 0) {
            addMessage('Game', `Using ${cookingMethod.name}, you cooked: ${cookedItems.join(", ")}`);
            addMessage('Game', `Burnt items: ${burntItems.join(", ")}`);
            console.log
        } else {
            addMessage('Game', "You have nothing raw to cook.");
        }
    }

}