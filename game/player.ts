class Player {
    constructor() {
                // Player character (simple cube)
                const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
                const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
                const player = new THREE.Mesh(playerGeometry, playerMaterial);
                player.userData = { username: playerObj.username, attackable: true, ...playerObj.skills, takeDamage: (damage, attacker) => playerObj.takeDamage(damage, attacker) }
                player.position.y = 1;
                scene.add(player);
        
                function createNewPlayer(data) {
                    const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
                    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
                    const player = new THREE.Mesh(playerGeometry, playerMaterial);
                    player.userData = { ...data, takeDamage: (damage, attacker) => playerObj.takeDamage(damage, attacker) }
                    player.position.y = 1;
                    scene.add(player);
                    return player;
                }

        // Initialize all skills with currLevel and experience.

        // Regeneration logic
        this.regenerationRates = {
            agility: 0.2,
            strength: 0.2,
            craft: 0.2
        };

        this.defaultSkillsState = {
            craft: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            agility: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            strength: { level: 10, currLevel: 8, experience: 100, maxLevel: 99 },
            archer: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            mage: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            defense: { level: 10, currLevel: 8, experience: 100, maxLevel: 99 },
            hp: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
        }

        this.skills = {
            craft: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            agility: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            strength: { level: 10, currLevel: 8, experience: 100, maxLevel: 99 },
            archer: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            mage: { level: 10, currLevel: 10, experience: 100, maxLevel: 99 },
            defense: { level: 10, currLevel: 8, experience: 100, maxLevel: 99 },
            hp: { level: 10, currLevel: 8, experience: 100, maxLevel: 99 },
        };

        this.regenerationIntervals = {}; // Store intervals for each skill

        this.playerIsMining = false; // Track if the player is mining

        this.username = ""

        this.alive = true;

        this.autoAttack = true;

        // Combat Settings
        this.combatMode = "attack"; // Default: Attack Mode

        this.equippedItems = { leftHand: null, rightHand: null };

        this.setCombatMode("attack");
    }

    toggleCombatMode(mode) {
        this.combatMode = mode;
        this.setCombatMode(mode)
        console.log(`Combat mode set to: ${this.combatMode}`);
    }

    toggleAutoAttack(status) {
        this.autoAttack = status;
        console.log(`Auto attack is ${this.autoAttack ? "enabled" : "disabled"}`);
    }

    triggerSpecialAttack() {
        if (this.isSpecialAttackAvailable) {
            console.log("Special attack triggered!");
            // Implement special attack logic here
        } else {
            console.log("Special attack is not available.");
        }
    }

    setCombatMode(mode) {
        if (mode === "attack") {
            this.combatMode = "attack";
            this.skills.strength.level = this.defaultSkillsState.strength.level + 5;
            this.skills.defense.level = this.defaultSkillsState.defense.level - 2;
        } else if (mode === "defend") {
            this.skills.combatMode = "defend";
            this.skills.defense.level = this.defaultSkillsState.strength.level + 5;
            this.skills.strength.level = this.defaultSkillsState.defense.level - 2;
        }
        this.displayStats();
        console.log(`Combat mode set to: ${this.combatMode}`);
    }

    specialAttack() {
        const leftHandItem = this.equippedItems.leftHand;
        const rightHandItem = this.equippedItems.rightHand;

        // Check if either equipped item has a special attack
        if (leftHandItem?.specialAttack || rightHandItem?.specialAttack) {
            addMessage('Game', "No special attack available.");
            return;
        }

        addMessage('Game', "No special attack available.");
    }

    attack(target) {
        console.log(target);
        if (!this.alive) return;

        if (activeSpell) {
            console.log(activeSpell);

            function calculateSpellDamage(player, target, spell) {
                if (player.skills.mage.level === 0) return 0; // Prevent division by zero

                return (spell.damage * (player.skills.mage.level / 100)) * (target.stats.mage / 100);
            }

            const damage = calculateSpellDamage(this, target, activeSpell);

            addMessage('Game', `Player casts ${activeSpell.name}!`);

            return target.takeDamage(damage, this);


            // activeSpell.drain
            // activeSpell.recoilDamage
        }

        if (equippedItems["left-hand"] && equippedItems["left-hand"].name.includes("bow") || equippedItems["right-hand"] && equippedItems["right-hand"].name.includes("bow")) {
            console.log("ranged")

            function calculateRangedDamage(player, target) {
                if (player.skills.archer.level === 0) return 0; // Prevent division by zero

                return (20 * (player.skills.archer.level / 100)) * (target.stats.archer / 100);
            }

            const damage = calculateRangedDamage(this, target);

            addMessage('Game', `Player shoots an arrow!`);

            return target.takeDamage(damage, this);
        }

        const damage = Math.max(1, this.skills.strength.level - target.stats.defense);
        addMessage('Game', `Player attacks for ${damage} damage!`);
        target.takeDamage(damage, this);
    }

    takeDamage(damage, attacker) {
        if (!this.alive) return;
        let damageTaken = damage;

        // Modify damage based on combat mode
        if (this.combatMode === "attack") {
            damageTaken *= 1.2; // Take 20% more damage
        } else if (this.combatMode === "defend") {
            damageTaken *= 0.8; // Take 20% less damage
        }

        this.skills.hp.currLevel -= damageTaken;
        addMessage('Game', `Player took ${damageTaken} damage! HP left: ${this.skills.hp.currLevel}`);

        if (this.skills.hp.currLevel <= 0) {
            this.die();
        }

        console.log('took damage');

        if (this.autoAttack) {
            console.log('fasdf')
            this.attack(attacker);
        }
    }

    die() {
        this.alive = false;
        scene.remove(player);
        addMessage('Game', "Player has died!");
        setTimeout(() => this.respawn(), 3000);
    }

    respawn() {
        this.alive = true;
        this.skills = this.defaultSkillsState;
        setTimeout(() => scene.add(player), 3000);
    }

    // Function to calculate the level based on experience
    calculateLevel(experience) {
        return Math.min(Math.floor(experience / 10), 99);  // Example formula: experience / 10 to determine level (up to max of 99)
    }

    // Function to update the experience for a stat
    updateExperience(skill, experienceGained) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            skillData.experience += experienceGained;

            // Update the level based on new experience
            skillData.level = this.calculateLevel(skillData.experience);

            this.displayStats();
            addMessage('Game', `${skill} experience updated. New level: ${skillData.currLevel}`);


        } else {
            console.error("Skill not found!");
        }
    }

    // Method to get the max stat level
    getMaxStat(skill) {
        if (this.skills[skill]) {
            return this.skills[skill].maxLevel;
        } else {
            console.error("Skill not found!");
            return 0;
        }
    }

    // Method to get the current usable stat level
    getCurrentStat(skill) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            return Math.min(skillData.currLevel, skillData.maxLevel);
        } else {
            console.error("Skill not found!");
            return 0;
        }
    }

    // Generic function to drain any stat
    drainStat(skill, amount) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            skillData.currLevel = Math.max(skillData.currLevel - amount, 0);  // Ensure the stat doesn't drop below 0
            console.log(`${skill} drained by ${amount}. New ${skill} level: ${skillData.currLevel}`);
        } else {
            console.error("Skill not found!");
        }
    }

    // Function to regenerate any stat back to max over time
    regenerateStat(skill, amount = 0) {
        if (this.skills[skill]) {
            let skillData = this.skills[skill];
            const regenerationRate = this.regenerationRates[skill] || 0.2; // Use the defined regeneration rate for each skill

            if (amount) {
                skillData.currLevel += amount;
                console.log(`${skill} manually regenerated by ${amount}. New level: ${skillData.currLevel}`);
            }

            // Ensure currLevel doesn't exceed level
            if (skillData.currLevel > skillData.level) {
                skillData.currLevel = skillData.level;
            }

            // Only regenerate if the current level is less than the max level
            if (skillData.currLevel < skillData.maxLevel && skillData.currLevel < skillData.level) {
                // Calculate the regeneration amount based on the max level
                let regenerationAmount = (skillData.maxLevel - skillData.currLevel) * regenerationRate;

                // Apply the regeneration
                skillData.currLevel += regenerationAmount;

                // Ensure the stat doesn't exceed the max level or level
                if (skillData.currLevel >= skillData.maxLevel) {
                    skillData.currLevel = skillData.maxLevel; // Clamp to max level if it reaches or exceeds max
                    console.log(`${skill} reached max level. Regeneration stopped.`);
                } else if (skillData.currLevel >= skillData.level) {
                    skillData.currLevel = skillData.level; // Clamp to level if it exceeds level
                    console.log(`${skill} reached level limit. Regeneration stopped.`);
                    this.stopRegeneration(skill); // Stop the interval when currLevel equals level
                } else {
                    console.log(`${skill} regenerated. New ${skill} level: ${skillData.currLevel}`);
                }
            } else {
                console.log(`${skill} is already at max level or at its level limit. No regeneration needed.`);
            }
        } else {
            console.error("Skill not found or player is mining!");
        }

        this.displayStats();
    }

    // Function to start regeneration interval for a skill
    startRegeneration(skill) {
        // Ensure we are not already regenerating the skill
        if (!this.regenerationIntervals[skill]) {
            this.regenerationIntervals[skill] = setInterval(() => this.regenerateStat(skill), 1000); // Regenerate every second
            console.log(`Started regeneration for ${skill}`);
        }
    }

    // Function to stop regeneration interval for a skill
    stopRegeneration(skill) {
        if (this.regenerationIntervals[skill]) {
            clearInterval(this.regenerationIntervals[skill]);
            delete this.regenerationIntervals[skill]; // Clean up the interval reference
            console.log(`Stopped regeneration for ${skill}`);
        }
    }

    // Getter and setter for currLevel and level (to maintain consistency)
    setCurrLevel(skill, value) {
        const skillData = this.skills[skill];
        if (value > skillData.level) {
            skillData.currLevel = skillData.level;
        } else {
            skillData.currLevel = value;
        }
    }

    setLevel(skill, value) {
        const skillData = this.skills[skill];
        if (value < skillData.currLevel) {
            skillData.level = skillData.currLevel;
        } else {
            skillData.level = value;
        }
    }


    // Reset experience for a skill
    resetExperience(skill) {
        if (this.skills[skill]) {
            this.skills[skill].experience = 0;
            this.skills[skill].currLevel = 0;
            console.log(`${skill} experience reset. currLevel: 0`);
        } else {
            console.error("Skill not found!");
        }
    }

    displayStats() {
        // Get the stats container element
        const statsContainer = document.getElementById("stats-list");

        // Clear the current stats list
        statsContainer.innerHTML = '';

        // Create a heading with player's name
        const playerName = document.createElement("h2");
        playerName.textContent = `${this.name}`;
        statsContainer.appendChild(playerName);

        // Iterate over all skills to display their stats
        for (const skill in this.skills) {
            const skillData = this.skills[skill];

            // Create a list item for each skill
            const skillItem = document.createElement("div");
            skillItem.innerHTML = `
        <strong>${skill.charAt(0).toUpperCase() + skill.slice(1)}</strong>: 
        Level ${skillData.currLevel}/${skillData.level}/${skillData.maxLevel} - 
        Experience: ${skillData.experience}
    `;
            statsContainer.appendChild(skillItem);
        }
    }
}
