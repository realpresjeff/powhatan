export class Monster {
    stats = {
        hp: 0,
        strength: 0,
        defense: 0,
        mage: 0,
        archer: 0
    }
    maxHp: number;
    alive: boolean;
    position: any;
    model: any;
    walkInterval: null;
    aggressionInterval: NodeJS.Timeout;
    scene: any;
    monster: string;
    inCombat = false;

    constructor(position, scene, monster) {
        this.stats.hp = 20;
        this.maxHp = 20;
        this.stats.strength = 10;
        this.stats.defense = 13;
        this.stats.mage = 2;
        this.stats.archer = 0;
        this.alive = true;
        this.position = position;
        this.model = this.createModel();
        scene.add(this.model);
        this.walkInterval = null;
        this.startWalking();
        this.aggressionInterval = setInterval(() => this.checkForEnemies(), 1000);
        this.scene = scene;
        this.monster = monster
    }

    checkForEnemies() {
        if (!this.alive) return;
        const attackRange = 10;
        const enemies = this.scene.children.filter(entity => entity.userData?.attackable && entity !== this.model);

        for (const enemy of enemies) {
            const distance = this.model.position.distanceTo(enemy.position);
            if (distance <= attackRange) {
                // this.attack(enemy.userData);
                return;
            }
        }
    }

    startWalking() {
        this.walkInterval = setInterval(() => {
            if (!this.alive) return;
            this.walk();
        }, 2000); // Walk every 2 seconds
    }

    stopWalking() {
        if (this.walkInterval) {
            clearInterval(this.walkInterval);
            this.walkInterval = null;
        }
    }

    walk() {
        const randomX = (Math.random() - 0.5) * 2; // Move between -1 and 1 on x-axis
        const randomZ = (Math.random() - 0.5) * 2; // Move between -1 and 1 on z-axis

        this.position.x += randomX;
        this.position.z += randomZ;

        this.model.position.set(this.position.x, this.position.y, this.position.z);
    }

    createModel() {
        const deerGroup = new THREE.Mesh();
        const deerData = { attackable: true, name: "Deer", stats: this.stats, takeDamage: this.takeDamage, monster: this }
        deerGroup.userData = deerData

        // Body (Simplified)
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: "brown" });
        bodyMaterial.userData = deerData
        const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 1), bodyMaterial);
        body.userData = deerData
        body.position.set(0, 1, 0);
        deerGroup.add(body);

        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMaterial);
        head.userData = deerData
        head.position.set(1.5, 1.5, 0);
        deerGroup.add(head);

        // Legs
        const legMaterial = new THREE.MeshStandardMaterial({ color: "darkbrown" });
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), legMaterial);
            leg.position.set(i < 2 ? -1 : 1, 0, i % 2 === 0 ? -0.5 : 0.5);
            deerGroup.add(leg);
        }

        deerGroup.position.set(this.position.x, this.position.y, this.position.z);
        return deerGroup;
    }

    takeDamage(damage, attacker) {
        if (!this.alive) return;
        this.stats.hp -= damage;

        if (this.stats.hp <= 0) {
            return this.die();
        }

        // addMessage('Game', `Deer takes ${damage} damage!`);
        this.attack(attacker);
    }

    attack(target) {
        if (!this.alive) return;
        const damage = Math.max(1, this.stats.strength - target.getLevelFromXP(target.skills.defense.experience_points)); // Basic attack formula
        // addMessage('Game', `Deer attacks player for ${damage} damage!`);
        target.takeDamage(damage, this);
    }


    die() {
        console.log('dying!');
        this.alive = false;
        this.scene.remove(this.model);
        this.drop();
        setTimeout(() => this.respawn(), 5000); // Respawns after 50 seconds
    }

    respawn() {
        this.stats.hp = this.maxHp;
        this.alive = true;
        this.model = this.createModel();
        this.scene.add(this.model);
    }

    drop() {
        const drops = {
            "coins": 100,
            "bones": 1,
            "deer fur": 1,
            // "Deer Meat": 1
        };

        Object.keys(drops).forEach(item => {
            this.spawnLoot(item, drops[item]);
        });

        console.log("Deer dropped loot on the ground!");
    }

    spawnLoot(itemName, quantity) {
        const loot = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5), // Small box to represent loot
            new THREE.MeshStandardMaterial({ color: "gold" }) // Default gold color
        );

        loot.position.set(this.position.x, 0.5, this.position.z); // Drops at the deer's location
        loot.userData = { name: itemName, quantity: quantity, pickupable: true };

        this.scene.add(loot);

        // Allow player to collect loot on interaction
        setTimeout(() => {
            loot.userData.pickupable = true;
        }, 1000); // Loot becomes collectible after 1 second
    }
}