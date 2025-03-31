class Fish {
    function fish() {
        if (playerObj.skills.agility <= 1 || playerObj.skills.strength <= 1) {
            addMessage('Game', "You're too exhausted to keep fishing. Rest to recover.");
            playerObj.startRegeneration("agility");
            playerObj.startRegeneration("strength");
            return;
        }

        console.log(playerObj);

        const virginiaFish = ["Largemouth Bass", "Bluegill", "Brook Trout", "Channel Catfish", "Smallmouth Bass", "American Shad", "Longnose Gar"];

        const baseRate = 5; // Base seconds per catch
        const agilityFactor = Math.max(1, 10 - Math.floor(playerObj.skills.agility.currLevel / 20)); // Faster with higher agility
        const strengthFactor = Math.max(1, 10 - Math.floor(playerObj.skills.strength.currLevel / 20)); // Faster with higher strength
        const fishingSpeed = Math.max(1, baseRate - Math.floor((agilityFactor + strengthFactor) / 2)); // Balanced rate
        addMessage('Game', `Casting line...`);

        let fishingInterval = setInterval(() => {
            if (playerObj.skills.agility.currLevel <= 0 || playerObj.skills.strength.currLevel <= 0) {
                addMessage('Game', "You're too exhausted to keep fishing. Rest to recover.");
                clearInterval(fishingInterval);
                playerObj.startRegeneration("agility");
                playerObj.startRegeneration("strength");
                return;
            }

            let caughtFish = virginiaFish[Math.floor(Math.random() * virginiaFish.length)];
            addToInventory({ name: caughtFish, quantity: 1, pickupable: true, cookable: true, raw: true });
            addMessage('Game', `You caught a ${caughtFish}!`);

            playerObj.drainStat("agility", 3);
            playerObj.drainStat("strength", 3);

            playerObj.updateExperience("agility", 75);
            playerObj.updateExperience("strength", 75);

            // drainAgility();
            // drain strength
            // playerStats.strength = Math.max(0, playerStats.strength - 2);

        }, fishingSpeed * 1000);
    }

}