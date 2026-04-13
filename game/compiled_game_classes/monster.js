import { createWizardModel } from './animals/wizard.js';
import { createDamageSplash, createHealthBar3D } from './healthbar.js';
import { createDragonModel } from './animals/dragon.js';
import { createCowModel } from './animals/cow.js';
import socket from './socket.js';
export class Monster {
    constructor(position, scene, monster, isSummon = false, data = null, stationary = false) {
        this.stats = {
            hp: 0,
            strength: 0,
            defense: 0,
            mage: 0,
            archer: 0
        };
        this.inCombat = false;
        this.healthBar = null;
        this.owner = null;
        this.isSummon = false;
        this.userData = null;
        this.stationary = false;
        this.monsterId = null;
        console.log(data);
        this.stats.hp = 50;
        this.maxHp = 50;
        this.stats.strength = 10;
        this.stats.defense = 13;
        this.stats.mage = 2;
        this.stats.archer = 0;
        this.alive = true;
        this.position = position;
        this.walkInterval = null;
        if (!stationary) {
            this.startWalking();
        }
        this.aggressionInterval = setInterval(() => this.checkForEnemies(), 1000);
        this.scene = scene;
        this.monster = monster;
        this.isSummon = isSummon;
        this.owner = null;
        this.userData = data;
        this.stationary = stationary;
        this.monsterId = data.monsterId || null;
        this.model = this.createModel();
        scene.add(this.model);
        if (isSummon) {
            this.stopWalking();
            clearInterval(this.aggressionInterval);
        }
    }
    addHealthBar() {
        this.healthBar = createHealthBar3D();
        this.healthBar.position.set(0, 5, 0);
        this.model.add(this.healthBar);
    }
    checkForEnemies() {
        if (!this.alive)
            return;
        const attackRange = 10;
        const enemies = this.scene.children.filter(entity => { var _a; return ((_a = entity.userData) === null || _a === void 0 ? void 0 : _a.attackable) && entity !== this.model; });
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
            if (!this.alive || this.frozen || this.stunned)
                return;
            const randomX = (Math.random() - 0.5) * 2; // Move between -1 and 1 on x-axis
            const randomZ = (Math.random() - 0.5) * 2; // Move between -1 and 1 on z-axis
            socket.sendMessage('monster:update', {
                monsterId: this.monsterId,
                position: { x: randomX, y: this.position.y, z: randomZ },
                type: 'walk'
            });
            // this.walk();
        }, 2000); // Walk every 2 seconds
    }
    stopWalking() {
        if (this.walkInterval) {
            clearInterval(this.walkInterval);
            this.walkInterval = null;
        }
    }
    walk(pos = undefined) {
        const randomX = (Math.random() - 0.5) * 2; // Move between -1 and 1 on x-axis
        const randomZ = (Math.random() - 0.5) * 2; // Move between -1 and 1 on z-axis
        this.position.x += pos ? pos.x : randomX;
        this.position.z += pos ? pos.z : randomZ;
        this.model.position.set(this.position.x, this.position.y, this.position.z);
    }
    createModel() {
        const monsterData = {
            attackable: true,
            stats: this.stats,
            takeDamage: this.takeDamage,
            monster: this,
            sealable: true
        };
        let model;
        let createModelFn;
        if (this.monster === "Wizard") {
            createModelFn = createWizardModel;
        }
        else if (this.monster === "Cow") {
            createModelFn = createCowModel;
        }
        else {
            createModelFn = createDragonModel;
        }
        model = createModelFn(Object.assign(Object.assign({}, monsterData), this.userData));
        // model.position.set(this.position);
        model.scale.set(2, 2, 2);
        return model;
    }
    takeDamage(damage, attacker) {
        console.log(attacker);
        if (!this.alive)
            return;
        this.stats.hp -= damage;
        if (this.stats.hp <= 0) {
            return socket.sendMessage('monster:update', { monsterId: this.monsterId, type: 'monster:dead' });
            // return this.die();
        }
        // addMessage('Game', `Deer takes ${damage} damage!`);
        this.attack(attacker);
        if (!this.healthBar) {
            this.addHealthBar();
        }
        // Show splash
        createDamageSplash(Math.floor(damage), this.model);
        this.healthBar.targetPercent = Math.max(0, this.stats.hp / this.maxHp);
        this.healthBar.update();
    }
    attack(target) {
        if (!this.alive)
            return;
        const damage = Math.max(1, this.stats.strength - target.stats.defense); // Basic attack formula
        console.log(`Deer attacks player for ${damage} damage!`);
        // addMessage('Game', `Deer attacks player for ${damage} damage!`);
        target.takeDamage(damage, this);
    }
    die() {
        console.log('dying!');
        this.alive = false;
        this.healthBar = null;
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
        const loot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), // Small box to represent loot
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
    // follow(followTarget) {
    //     this.followInterval = setInterval(() => {
    //         if (!this.alive || !followTarget?.base) return;
    //         const target = followTarget.model.position ? followTarget.model.position.clone() : followTarget.base.position.clone() || this.owner.base.position.clone();
    //         const dir = target.sub(this.model.position);
    //         const dist = dir.length();
    //         if (dist > 2) {
    //             dir.normalize();
    //             this.model.position.add({ ...dir.multiplyScalar(0.06), y: 0 });
    //         }
    //     }, 50);
    // }
    follow(followTarget, followDistance = 8, speed = 0.06) {
        // Clear any existing follow loop
        if (this.followInterval) {
            clearInterval(this.followInterval);
        }
        this.followInterval = setInterval(() => {
            var _a, _b, _c, _d;
            if (!this.alive || !(followTarget === null || followTarget === void 0 ? void 0 : followTarget.base) || !this.model)
                return;
            // Prefer model position, fallback to base
            const targetPos = ((_b = (_a = followTarget.model) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.clone())
                || ((_d = (_c = followTarget.base) === null || _c === void 0 ? void 0 : _c.position) === null || _d === void 0 ? void 0 : _d.clone());
            if (!targetPos)
                return;
            const myPos = this.model.position.clone();
            // Direction & distance
            const dir = targetPos.sub(myPos);
            const dist = dir.length();
            // Dead-zone buffer to prevent jitter
            const buffer = 0.3;
            if (this.monster.monster === "Jersey Devil") {
                console.log('jersey devil');
                return this.model.position.add(Object.assign({}, dir.multiplyScalar(0.06)));
            }
            if (dist > followDistance + buffer) {
                dir.normalize();
                const movement = dir.multiplyScalar(speed);
                movement.y = 0; // keep grounded
                this.model.position.add(movement);
                // Optional: face target
                this.model.rotation.y = Math.atan2(dir.x, dir.z);
            }
        }, 50);
    }
    forceDespawn() {
        this.alive = false;
        this.scene.remove(this.model);
    }
}
