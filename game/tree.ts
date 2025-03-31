class Tree {
    constructor(type, position, hasFruit) {
        this.type = type;
        this.position = position;
        this.hasFruit = hasFruit;
        this.treeParent = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ visible: false }));

        // Tree data
        const data = { isTree: true, type: type, name: type.charAt(0).toUpperCase() + type.slice(1) };
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
        scene.add(this.treeParent);
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
            fruit.userData = { isFruit: true, tree: this.treeParent, name: "Persimmon" };

            scene.add(fruit);
            fruits.push(fruit);
        }
    }

    onClick() {
        alert('Tree clicked!');
    }
}

