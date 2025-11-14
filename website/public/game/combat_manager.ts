export class CombatManager {
    engine: any;
    turn: string;
    active: boolean;
    attacker: null;
    defender: null;

    constructor(engine) {
        this.engine = engine;
        this.turn = "PLAYER";
        this.active = false;
        this.attacker = null;
        this.defender = null;
    }

    start(player, monster) {
        if (this.active) return;

        this.active = true;
        this.attacker = player;
        this.defender = monster;
        this.turn = "PLAYER";

        player.inCombat = true;
        monster.inCombat = true;

        this.engine.notification_bus.add("Combat started!");

        this.loop();
    }

    end() {
        this.active = false;

        this.attacker.inCombat = false;
        this.defender.inCombat = false;

        this.engine.notification_bus.add("Combat ended.");
    }

    async loop() {
        while (this.active) {
            await new Promise(r => setTimeout(r, 700)); // 0.7s delay per turn

            if (!this.attacker.isAlive() || !this.defender.isAlive()) {
                this.end();
                return;
            }

            const damage = this.attacker.getAttackDamage();
            this.defender.takeDamage(damage, this.attacker);

            this.engine.notification_bus.add(
                `${this.attacker.name} hits ${this.defender.name} for ${damage}`
            );

            // swap turns
            const swap = this.attacker;
            this.attacker = this.defender;
            this.defender = swap;
        }
    }
}
