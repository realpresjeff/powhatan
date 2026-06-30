import { Engine } from './engine.js';
import socketManager from './socket.js';
import { spells } from './spellbook.js';
import { ChannelTabs } from './notifications.js';

const socket = socketManager;
const engine = new Engine();
engine.animate();

socket.socket.on('message', (data) => {
    console.log(data);
});

socket.socket.on('player_updated', player => {
    // 🔹 Another player moved
    if (player.id === socket.socket.id) return;
    const remote = engine.players.get(player.id);
    if (!remote) return;
    remote.character.targetPosition = player.position;
    remote.character.positionX = player.position.x;
    remote.character.positionZ = player.position.z;
    remote.character.currentRotation = player.rotation;
    remote.character.isWalking = true;
    remote.character.base.position.lerp(remote.character.targetPosition, engine.moveSpeed);
    remote.character.base.rotation.y = player.rotation;
    remote.character.walk({ ...player.position, targetRotation: player.rotation });
});

socket.socket.on("players_snapshot", players => {
    players.forEach(player => {
        if (player.id === socket.socket.id) return;
        engine.spawnPlayer(player.id, player.position, player.username);
    });
});

socket.socket.on("monsters_snapshot", monsters => {
    monsters.forEach(monster => {
        let model;

        if (engine.monsters.has(monster.data.monsterId)) {
            model = engine.spawn_monster(monster.position, monster.name, monster.data, monster.stationary);
        } else model = engine.monsters.get(monster.data.monsterId);

        engine.monsters.set(monster.data.monsterId, { ...monster, model });
    });
});

socket.socket.on("player_joined", player => {
    if (player.id === socket.socket.id) return;
    if (engine.players.has(player.id)) return;
    engine.spawnPlayer(player.id, player.position, player.username);
});

socket.socket.on("player_left", ({ id }) => {
    const remote = engine.players.get(id);
    if (!remote) return;
    engine.scene.remove(remote.mesh);
    engine.players.delete(id);
});

socket.socket.on("item_dropped", item => {
    if (engine.droppedItems.has(item.id)) return;

    const mesh = engine.create_dropped_item(item);
    engine.droppedItems.set(item.id, {
        mesh,
        data: item.item
    });
});

socket.socket.on("item_picked_up", ({ id, pickedUpBy }) => {
    const entry = engine.droppedItems.get(id);
    if (!entry) return;

    engine.scene.remove(entry.mesh);
    engine.droppedItems.delete(id);

    // If this player picked it up → add to inventory
    if (pickedUpBy === socket.socket.id) {
        engine.character.inventory.add_to_inventory({
            ...entry.data
        });
    }
});

socket.socket.on("items_snapshot", items => {
    items.forEach(item => {
        if (!engine.droppedItems.has(item.id)) {
            const mesh = engine.create_dropped_item(item);
            engine.droppedItems.set(item.id, { mesh, data: item.item });
        }
    });
});

socket.socket.on("combat_event", data => {
    console.log(data);

    const attacker = engine.players.get(data.attackerId) || engine;

    if (data.targetType === "monster") {
        const monster = engine.monsters.get(data.targetId);
        if (!monster) return;
        monster.model.takeDamage(data.damage, attacker.character);
    }

    const target = engine.players.get(data.targetId) || engine;

    if (!attacker || !target) return;

    // 1️⃣ Play animations
    if (data.attackType === 'melee') {
        attacker.character.startAnimation();
        attacker.character.attack_animation();

        target.character.startAnimation();
        target.character.defend_animation();
    }

    if (data.attackType === 'magic') {
        const spellId = data.spell.id;
        const spell = spells[spellId - 1];
        console.log(spell);
        spell.cast(attacker.character, target.character);
        spell.impact(target.character);
    }

    if (data.attackType === 'archer') {
        attacker.character.startAnimation();
        attacker.character.magic_animation();

        const start = new THREE.Vector3(
            data.start.x,
            data.start.y,
            data.start.z
        );

        const end = new THREE.Vector3(
            data.target.x,
            data.target.y,
            data.target.z
        );

        if (data.projectileType === "arrow") {
            attacker.character.fireArrow({
                scene: engine.scene,
                start,
                target: end,
                onHit: () => {
                    target.character.takeDamage(data.damage, attacker.character);
                }
            });
        } else {
            attacker.character.fireBullet({
                scene: engine.scene,
                start,
                target: end,
                onHit: () => {
                    target.character.takeDamage(data.damage, attacker.character);
                }
            });
        };
    } else {
        // target.character.takeDamage(data.damage, attacker.character);
    }

    // 2️⃣ Update HP bar visually
    target.character.skills.hp.total_points_available = data.targetHpAfter;
    target.character.stats.hp = data.targetHpAfter;

    target.character.healthBar?.update();

    // 3️⃣ Handle death
    if (data.killed) {
        target.character.die();
    }
});

let currentTradeId = null;
let tradePartnerId = null;

socket.socket.on("trade_started", ({ tradeId, partnerId }) => {
    currentTradeId = tradeId;
    tradePartnerId = partnerId;
    document.getElementById("tradeUI").classList.remove("hidden");
    socket.isTrading = true;
    socket.currentTradeId = tradeId;
});

socket.socket.on("trade_update", ({ offers }) => {
    console.log(currentTradeId);
    renderTradeItems(
        offers[socket.socket.id],
        offers[tradePartnerId]
    );
});

function renderTradeItems(yours = [], theirs = []) {
    const yourDiv = document.getElementById("trade-your");
    const theirDiv = document.getElementById("trade-their");

    yourDiv.innerHTML = "";
    theirDiv.innerHTML = "";

    yours?.forEach(item => addItemIcon(yourDiv, item));
    theirs?.forEach(item => addItemIcon(theirDiv, item));

    function addItemIcon(container, item) {
        const el = document.createElement("div");
        el.className = "trade-item";

        // Icon (optional)
        if (item.icon) {
            const img = document.createElement("img");
            img.src = item.icon;
            img.className = "trade-item-icon";
            el.appendChild(img);
        }

        // Label
        const label = document.createElement("span");
        label.textContent = item.label || item.name;
        el.appendChild(label);

        // Stack size
        if (item.amount && item.amount > 1) {
            const qty = document.createElement("span");
            qty.className = "trade-item-qty";
            qty.textContent = `×${item.amount}`;
            el.appendChild(qty);
        }

        container.appendChild(el);
    }
}

document.getElementById("trade-accept").addEventListener("click", () => {
    console.log("✅ Trade accepted");
    socket.sendMessage("trade_accept", { tradeId: currentTradeId });
});

document.getElementById("trade-decline").addEventListener("click", () => {
    console.log("✅ Trade accepted");
    socket.sendMessage("trade_decline", { tradeId: currentTradeId });
});

socket.socket.on("trade_complete", trade => {
    const myItems = trade.offers[socket.socket.id];
    const theirItems = trade.offers[tradePartnerId];

    myItems.forEach(item => engine.character.inventory.removeFromInventory(item));
    theirItems.forEach(item => engine.character.inventory.add_to_inventory(item));

    document.getElementById("tradeUI").classList.add("hidden");
});

socket.socket.on("trade_declined", trade => {
    document.getElementById("tradeUI").classList.add("hidden");
});

/* ─────────────────────────────
   CHAT
───────────────────────────── */
socket.socket.on("chat:msg", msg => {
    console.log(msg);
    engine.notification_bus.addMessage(msg.username, msg.msg, msg.tab);

    if (msg.tab === ChannelTabs.local) {
        const remote = engine.players.get(msg.playerId);
        if (remote) {
            engine.notification_bus.displayAboveCharacter(msg.username, msg.msg, remote.character.base);
        }
    }
});

/* ─────────────────────────────
   RESOURCES / MONSTERS
───────────────────────────── */
// socket.socket.on("resource:despawn", data => engine.removeResource(data.id));
// socket.socket.on("resource:respawn", data => engine.spawnResource(data));

socket.socket.on("monster:spawn", ({ monsterId, position, name, data, stationary, ...rest }) => {
    const monster = engine.spawn_monster(position, name, data, stationary);
    engine.monsters.set(monsterId, { position, name, data, stationary, model: monster, ...rest });
});

socket.socket.on("monster:update", data => {
    const monster = engine.monsters.get(data.data.monsterId);

    if (data.data.type === "walk") {
        monster.position = data.data.position;
        monster.model.model.position.lerp(data.data.position.x, monster.position.y, data.data.position.z);
        monster.model.walk({ x: data.data.position.x, z: data.data.position.z });
    }

    if (data.data.type === "monster:dead") {
        console.log(monster);
        monster.model.die();
    }
});

/* ─────────────────────────────
   PLAYER SYNC
───────────────────────────── */

socket.socket.on("player:update", data => engine.updateRemotePlayer(data));

/* ─────────────────────────────
   EQUIP / CUSTOMIZATION
───────────────────────────── */
socket.socket.on("player:equip_update", data => engine.applyEquip(data));
socket.socket.on("player:unequip_update", data => engine.applyUnequip(data));
socket.socket.on("player:customize_update", data => engine.applyAppearance(data));

/* ─────────────────────────────
   SKILLS / FLIGHT
───────────────────────────── */
socket.socket.on("skill:action_state", data => engine.playSkillAnim(data));
socket.socket.on("player:flight_update", data => engine.setFlight(data));




