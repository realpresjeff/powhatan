import * as THREE from 'three';

type races = ["Indian", "African", "European", "Zambo", "Mestizo", "Pardo", "Mulatto"];
const races: races = ["Indian", "African", "European", "Zambo", "Mestizo", "Pardo", "Mulatto"];

interface HumanStats {
    hp: number;
    strength: number;
    defense: number;
    mage: number;
    archer: number;
}

interface HumanConstructorProps {
    scene: any;
    position: any;
    race?: typeof races;
    stats: HumanStats;
    respawnRate?: number; // in seconds
}

class Human {
    race;
    alive;
    position;
    model;
    scene;
    respawnRate;

    stats = {
        hp: 0,
        strength: 0,
        defense: 0,
        mage: 0,
        archer: 0
    }
    maxHp = 0;

    constructor({ position, race, stats, scene, respawnRate = 50 }: HumanConstructorProps) {
        this.race = race ? race : races[Math.floor(Math.random() * races.length)];
        this.stats.hp = stats.hp;
        this.maxHp = stats.hp;
        this.stats.strength = stats.strength;
        this.stats.defense = stats.defense;
        this.stats.mage = stats.mage;
        this.stats.archer = stats.archer;
        this.alive = true;
        this.respawnRate = respawnRate;
        this.position = position;
        this.model = this.createModel();
        scene.add(this.model);
    }

    createModel() {
        const humanGroup = new THREE.Group();
        const skinColors = {
            "Indian": 0x8d5524,
            "African": 0x3d1e10,
            "European": 0xffdbac,
            "Zambo": 0x5c3a1e,
            "Mestizo": 0xc68642,
            "Pardo": 0x9c7248,
            "Mulatto": 0xaf6e51
        };

        // Body Material
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: skinColors[this.race] });

        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), bodyMaterial);
        body.userData = { attackable: true }
        body.position.set(0, 1, 0);
        humanGroup.add(body);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5), bodyMaterial);
        head.userData = { attackable: true }
        head.position.set(0, 2.5, 0);
        humanGroup.add(head);

        // Arms
        for (let i = -1; i <= 1; i += 2) {
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), bodyMaterial);
            arm.position.set(i * 0.6, 1.75, 0);
            humanGroup.add(arm);
        }

        // Legs
        for (let i = -1; i <= 1; i += 2) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), bodyMaterial);
            leg.position.set(i * 0.3, 0, 0);
            humanGroup.add(leg);
        }

        humanGroup.position.set(this.position.x, this.position.y, this.position.z);
        return humanGroup;
    }

    takeDamage(damage) {
        if (!this.alive) return;
        this.stats.hp -= damage;
        if (this.stats.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        this.scene.remove(this.model);
        setTimeout(() => this.respawn(), this.respawnRate * 10000); // Respawns after 50 seconds by default
    }

    respawn() {
        this.stats.hp = this.maxHp;
        this.alive = true;
        this.model = this.createModel();
        this.scene.add(this.model);
    }
}