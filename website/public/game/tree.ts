import { calculateMiningSpeed, calculateCuttingSpeed } from './calcs.js';

export class Tree {
    type: any;
    position: any;
    hasFruit: any;
    treeParent: any;
    trunkMaterial: any;
    leavesMaterial: any;
    trunk: any;
    leaves: any;
    scene: any;

    constructor(type, position, hasFruit, scene) {
        this.scene = scene;
        this.type = type;
        this.position = position;
        this.hasFruit = hasFruit;
        this.treeParent = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ visible: false }));

        // Tree data
        const data = { isTree: true, type: type, name: type.charAt(0).toUpperCase() + type.slice(1), cut: this.cutTree };
        this.treeParent.userData = data;

        // Materials
        this.trunkMaterial = new THREE.MeshStandardMaterial({ color: "#8B5A2B" }); // Brown for trunk
        this.leavesMaterial = new THREE.MeshStandardMaterial({ color: "#228B22" }); // Green for leaves
        this.trunkMaterial.userData = data;
        this.leavesMaterial.userData = data;

        // Create trunk
        this.trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.8, 5, 8),
            this.trunkMaterial
        );
        this.trunk.position.set(0, 2.5, 0);
        this.trunk.userData = data;
        this.treeParent.add(this.trunk);

        // Create leaves based on tree type
        this.leaves = this.createLeaves();

        // Position the tree parent mesh
        this.treeParent.position.set(this.position.x, this.position.y, this.position.z);

        // If tree has fruit, add fruits
        if (this.hasFruit) {
            this.createFruits();
        }

        // Add the tree parent mesh to the scene
        this.scene.add(this.treeParent);
    }

    createLeaves() {
        let leaves;
        if (this.type === "pine") {
            leaves = new THREE.Mesh(
                new THREE.ConeGeometry(3, 6, 8),
                this.leavesMaterial
            );
        } else {
            leaves = new THREE.Mesh(
                new THREE.SphereGeometry(3, 8, 8),
                this.leavesMaterial
            );
        }
        leaves.position.set(0, 6, 0);
        leaves.userData = this.treeParent.userData;
        this.treeParent.add(leaves);
        return leaves;
    }

    createFruits() {
        // Generate random number of fruits (1-5)
        const fruitCount = Math.floor(Math.random() * 5) + 1;
        const fruits = [];

        const randomizedX = (Math.random() - 0.5) * 2.4;
        const randomizedZ = (Math.random() - 0.5) * 4;
        const weight = 0.3;

        for (let i = 0; i < fruitCount; i++) {
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetZ = (Math.random() - 0.5) * 2;

            const fruit = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 8, 8),
                new THREE.MeshStandardMaterial({ color: "#FFA500" }) // Orange color for fruits
            );

            fruit.position.set(this.position.x + randomizedX - weight, 0, this.position.z + randomizedZ - weight);
            fruit.userData = { isFruit: true, tree: this.treeParent, name: "persimmon", pickupable: true };

            this.scene.add(fruit);
            fruits.push(fruit);
        }
    }

    onClick() {
        alert('Tree clicked!');
    }

    cutTree(character, notification_bus) {
        console.log(character);
        const cost = 8;
        // if (!playerHasAxe()) {
        //     console.log("You need an axe to cut down the tree!");
        //     return;
        // }

        // Calculate cutting speed based on player's strength and agility
        const cuttingSpeed = calculateCuttingSpeed(character.getLevelFromXP(character.skills.agility), character.getLevelFromXP(character.skills.strength)); // This will be similar to calculateMiningSpeed

        let cuttingInterval = setInterval(() => {
            // Stop mining if agility is 0 or max experience is reached
            if (character.skills.agility.total_points_available < cost || character.inventory.inventory.length >= character.inventory.inventoryLimit) {
                clearInterval(cuttingInterval);
                addMessage("Game", "You have run out of agility and can no longer cut.");
                if (character.skills.agility.total_points_available < cost || character.skills.strength.total_points_available < cost) {
                    addMessage("Game", "You have run out of strength and can no longer cut.");
                    character.regenerateStat('agility'); // Start the agility regeneration process
                    character.regenerateStat('strength');
                }
                return;
            }

            // Calculate the log based on the tree type
            const log = this.type; // Use the tree's name (type) as the log's name

            // Add the log to the inventory
            character.inventory.add_to_inventory({ name: `${log} Log`, fletch: true, type: log, flammable: true });
            console.log(character.inventory);
            // addToInventory({ name: `${log} Log`, fletch: true, type: log, flammable: true });

            // createPopup('Inventory');

            // Drain agility after each mining action
            character.drainStat('agility', cost);
            character.drainStat('strength', cost);

            addMessage("Game", `Cut down a ${tree.name} tree and got a ${log} log!`);

            // Increment experience after each ore mined (you can customize how much experience is gained)
            character.addExperience('agility', cost / 2);
            character.addExperience('strength', cost / 2);
            character.addExperience('woodcutting', cost / 2);
        }, calculateMiningSpeed(character.getLevelFromXP(character.skills.agility), character.getLevelFromXP(character.skills.strength)));  // Speed based on player stats
    }
}