export class Mine {
    createCoalMine(position) {
        const mine = new THREE.Mesh();
        mine.userData = { isOre: true, type: "coal", name: "Coal" };

        // 🪨 Base Rock Formation (Cave Walls)
        for (let i = 0; i < 6; i++) {
            const rock = new THREE.Mesh(
                new THREE.SphereGeometry(Math.random() * 2 + 1.5, 8, 8),
                new THREE.MeshStandardMaterial({ color: "#3A3A3A" }) // Dark gray coal rocks
            );

            const offsetX = (Math.random() - 0.5) * 6;
            const offsetZ = (Math.random() - 0.5) * 6;
            const offsetY = Math.random() * 3;

            rock.position.set(position.x + offsetX, position.y + offsetY, position.z + offsetZ);
            rock.rotation.y = Math.random() * Math.PI;

            rock.userData = { isOre: true, name: "Coal", type: "coal" };
            mine.add(rock);
        }

        // 🔽 Mine Entrance (A darker cave opening)
        const entrance = new THREE.Mesh(
            new THREE.CylinderGeometry(2.5, 3.5, 4, 8),
            new THREE.MeshStandardMaterial({ color: "#2C2C2C", side: THREE.DoubleSide }) // Even darker rock
        );
        entrance.position.set(position.x, position.y + 1, position.z);
        entrance.rotation.x = Math.PI / 2;
        entrance.userData = { isEntrance: true, type: "coal", name: "Coal Mine Entrance" };
        mine.add(entrance);

        this.createMineGround(position, { height: 15, width: 15 })

        // ⛏️ Coal Deposits inside the mine
        function spawnCoal(scene) {
            const coal = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 8, 8),
                new THREE.MeshStandardMaterial({ color: "#222222" }) // Pure black for coal
            );

            const offsetX = (Math.random() - 0.5) * 3;
            const offsetZ = (Math.random() - 0.5) * 3;
            coal.position.set(position.x + offsetX, position.y + 1, position.z + offsetZ);

            coal.userData = { isOre: true, type: "coal", name: "Coal Deposit" };
            scene.add(coal);

            return coal;
        }

        let coalDeposits = [];
        for (let i = 0; i < 4; i++) {
            coalDeposits.push(spawnCoal(this.scene));
        }

        // 🌱 Coal Respawn Mechanic
        function respawnCoal(coal) {
            setTimeout(() => {
                if (!scene.children.includes(coal)) {
                    const newCoal = spawnCoal();
                    coalDeposits.push(newCoal);
                }
            }, Math.random() * 120000 + 60000); // Respawn between 1-3 minutes
        }

        // 🏗️ Add to scene
        this.scene.add(mine);
        return mine;
    }

    createMineGround(position, size) {
        const mineGroundGeometry = new THREE.PlaneGeometry(size.width, size.height, 8, 8);
        const mineGroundMaterial = new THREE.MeshStandardMaterial({
            color: "#4F4F4F", // Dark gray for a rocky ground
            side: THREE.DoubleSide
        });

        const mineGround = new THREE.Mesh(mineGroundGeometry, mineGroundMaterial);
        mineGround.rotation.x = -Math.PI / 2;
        mineGround.position.set(position.x, position.y + 0.01, position.z); // Slightly below the mine

        this.scene.add(mineGround);
        return mineGround;
    }

    // Function to simulate mining ore
    mineOre(mine) {
        // if (!playerHasPickaxe()) {
        //     console.log("You need a pickaxe to mine!");
        //     return;
        // }

        // Start mining interval
        let miningInterval = setInterval(() => {
            // Stop mining if agility is 0 or max experience is reached
            if (playerObj.skills.agility.currLevel === 0) {
                addMessage("Game", "You have run out of agility and can no longer mine.");
                clearInterval(miningInterval);
                playerObj.startRegeneration('agility');

                if (playerObj.skills.strength.currLevel === 0) {
                    addMessage("Game", "You have run out of strength and can no longer mine.");
                    playerObj.startRegeneration('strength');
                }
                if (hasMaxExperience()) {
                    addMessage("Game", "You have reached max experience!");
                }
                return;
            }

            // Simulate mining
            addToInventory({ name: mine.type });

            addMessage("Game", `Mined a ${mine.type}!`);

            // Drain agility after each mining action
            playerObj.drainStat("agility", 7);
            playerObj.drainStat("strength", 4);

            // Increment experience after each ore mined (you can customize how much experience is gained)
            playerObj.updateExperience("strength", 4);
            playerObj.updateExperience("agility", 7);
        }, calculateMiningSpeed()); // Uses calculated mining speed based on player stats
    }
}