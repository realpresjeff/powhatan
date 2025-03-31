import * as THREE from 'three';

interface AnimalConstructorProps {
    name: string;
    stats: AnimalStats;
    drops: Drops;
    respawnRate: number;
    position: any;
    scene: any;
    addMessage: Function;
}

interface AnimalStats {
    hp: number;
    strength: number;
    defense: number;
    mage: number;
    archer: number;
}

interface Drops {
    [key: string]: {
        quantity: number;
    }[];
}

export class Animal {
    stats = {
        hp: 0,
        strength: 0,
        defense: 0,
        mage: 0,
        archer: 0
    }
    maxHp = 0;

    name;
    drops;
    alive;
    position;
    model;
    walkInterval;
    aggressionInterval;
    respawnRate;
    scene;
    addMessage;

    constructor({ name, stats: _stats, drops, respawnRate, position, scene, addMessage }: AnimalConstructorProps) {
        this.name = name;
        this.stats.hp = _stats.hp;
        this.maxHp = _stats.hp;
        this.stats.strength = _stats.strength;
        this.stats.defense = _stats.defense;
        this.stats.mage = _stats.mage;
        this.stats.archer = _stats.archer;
        this.drops = drops;
        this.alive = true;
        this.respawnRate = respawnRate;
        this.position = position;
        this.model = this.createModel();
        scene.add(this.model);
        this.scene = scene;
        this.walkInterval = null;
        this.startWalking();
        this.aggressionInterval = setInterval(() => this.checkForEnemies(), 1000);
        this.addMessage = addMessage;
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
        const meshGroup = new THREE.Mesh();
        const animalData = { attackable: true, name: this.name, stats: this.stats };
        meshGroup.userData = animalData;

        // find animal by name

        // > Body (Simplified)
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: "brown" });
        bodyMaterial.userData = animalData;

        const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 1), bodyMaterial);
        body.userData = animalData;

        body.position.set(0, 1, 0);
        meshGroup.add(body);

        // > Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMaterial);
        head.userData = animalData;
        head.position.set(1.5, 1.5, 0);
        meshGroup.add(head);

        // > Legs
        const legMaterial = new THREE.MeshStandardMaterial({ color: "darkbrown" });
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), legMaterial);
            leg.position.set(i < 2 ? -1 : 1, 0, i % 2 === 0 ? -0.5 : 0.5);
            meshGroup.add(leg);
        }

        meshGroup.position.set(this.position.x, this.position.y, this.position.z);
        return meshGroup;
    }

    takeDamage(damage, attacker) {
        if (!this.alive) return;
        this.stats.hp -= damage;
        this.addMessage('Game', `Deer takes ${damage} damage!`);
        this.attack(attacker);
        if (this.stats.hp <= 0) {
            this.die();
        }
    }

    attack(target) {
        if (!this.alive) return;
        console.log(target);
        const damage = Math.max(1, this.stats.strength - target.defense.level); // Basic attack formula
        this.addMessage('Game', `Deer attacks player for ${damage} damage!`);
        target.takeDamage(damage, this);
    }

    die() {
        this.alive = false;
        this.scene.remove(this.model);
        this.drop();
        setTimeout(() => this.respawn(), this.respawnRate * 10000); // Respawns after 50 seconds
    }

    respawn() {
        this.stats.hp = this.maxHp;
        this.alive = true;
        this.model = this.createModel();
        this.scene.add(this.model);
    }

    drop() {
        // const drops = {
        //     "Coins": 100,
        //     "Bones": 1,
        //     "Deer Hide": 1,
        //     "Deer Meat": 1
        // };

        Object.keys(this.drops).forEach(item => {
            this.spawnLoot(item, this.drops[item]);
        });

        console.log("Deer dropped loot on the ground!");
    }

    spawnLoot(itemName, item) {
        const loot = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5), // Small box to represent loot
            new THREE.MeshStandardMaterial({ color: "gold" }) // Default gold color
        );

        loot.position.set(this.position.x, 0.5, this.position.z); // Drops at the deer's location

        loot.userData = { name: itemName, quantity: item.quantity, pickupable: true };

        this.scene.add(loot);

        // Allow player to collect loot on interaction
        setTimeout(() => {
            // loot.userData.pickupable = true;
        }, 1000); // Loot becomes collectible after 1 second
    }
}

