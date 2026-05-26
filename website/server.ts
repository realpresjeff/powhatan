const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { Server } = require("socket.io");

interface PlayerState {
  id: string
  username: string
  position: { x: number, y: number, z: number }
  rotation: number
  appearance: {
    gender: string;
    skinColor: number;
    hairStyle: string;
    hairColor: number;
    beard: boolean;
    mustache: boolean;
  }
  equipment: {
    helmet: any;
    torso: any;
    legs: any;
    boots: any;
    weapon: any;
    shield: any;
  }
}

// 1️⃣ Create HTTP server (your existing logic)
const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;

  let publicFilePath = path.join(__dirname, "public", pathname);

  if (publicFilePath.endsWith("/")) {
    publicFilePath = path.join(publicFilePath, "index.html");
  }

  let extname = path.extname(publicFilePath);
  let contentType = "text/html";

  switch (extname) {
    case ".js": contentType = "text/javascript"; break;
    case ".css": contentType = "text/css"; break;
    case ".json": contentType = "application/json"; break;
    case ".png": contentType = "image/png"; break;
    case ".jpg": contentType = "image/jpg"; break;
    case ".ico": contentType = "image/x-icon"; break;
    case ".pdf": contentType = "application/pdf"; break;
  }

  fs.readFile(publicFilePath, (publicErr, publicContent) => {
    if (!publicErr) {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(publicContent);
    } else {
      res.writeHead(404);
      res.end("404 Not Found");
    }
  });
});

// 2️⃣ Attach Socket.IO to the SAME server
const io = new Server(server, {
  cors: { origin: "*" }
});

// 3️⃣ Socket.IO logic
io.on("connection", socket => {
  console.log("✅ Socket connected:", socket.id);

  // 🧍 Player joins
  socket.on("player_login", data => {
    addPlayer(socket.id, data);

    // Send full player list to new player
    socket.emit("players_snapshot", getAllPlayers());

    socket.emit("items_snapshot", [...droppedItems.values()]);

    socket.emit("monsters_snapshot", Array.from(monsters.values()))

    // Notify everyone else
    socket.broadcast.emit("player_joined", {
      id: socket.id,
      ...data
    });
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on('message', (data) => {
    console.log(data);
    io.emit("message", data);
  });
  // 🎒 Equipment / customization updates
  socket.on("player_update", data => {
    updatePlayer(socket.id, data);

    socket.broadcast.emit("player_updated", {
      id: socket.id,
      ...data
    });
  });

  // ❌ Disconnect
  socket.on("disconnect", (reason) => {
    removePlayer(socket.id);
    socket.broadcast.emit("player_left", { id: socket.id });
    console.log("❌ Disconnected:", socket.id);
  });

  socket.on("drop_item", data => {
    const itemId = crypto.randomUUID();

    const item = {
      ...data,
      id: itemId,
      name: data.name,
      position: data.position,
      droppedBy: socket.id,
    };

    droppedItems.set(itemId, item);

    console.log(item);

    // 🔊 broadcast to everyone
    io.emit("item_dropped", item);
  });

  socket.on("pickup_item", ({ id }) => {
    const item = droppedItems.get(id);
    if (!item) return; // already picked up

    droppedItems.delete(id);

    io.emit("item_picked_up", {
      id,
      pickedUpBy: socket.id
    });
  });

  socket.on("combat_event", data => {
    io.emit("combat_event", data);
  });

  socket.on("trade_request", ({ tradePartnerId }) => {
    const tradeId = crypto.randomUUID();

    activeTrades.set(tradeId, {
      id: tradeId,
      players: [socket.id, tradePartnerId],
      offers: {
        [socket.id]: [],
        [tradePartnerId]: []
      },
      accepted: {
        [socket.id]: false,
        [tradePartnerId]: false
      }
    });

    io.to(socket.id).emit("trade_started", { tradeId, partnerId: tradePartnerId });
    io.to(tradePartnerId).emit("trade_started", { tradeId, partnerId: socket.id });
  });

  socket.on("trade_offer_item", ({ tradeId, item }) => {
    const trade = activeTrades.get(tradeId);

    if (!trade) return;

    trade.offers[socket.id].push(item);

    // Reset acceptance on change
    trade.accepted[trade.players[0]] = false;
    trade.accepted[trade.players[1]] = false;

    trade.players.forEach(id => {
      io.to(id).emit("trade_update", {
        offers: trade.offers,
        accepted: trade.accepted
      });
    });
  });

  socket.on("trade_accept", ({ tradeId }) => {
    const trade = activeTrades.get(tradeId);
    if (!trade) return;

    trade.accepted[socket.id] = true;

    const [a, b] = trade.players;
    if (trade.accepted[a] && trade.accepted[b]) {
      io.to(a).emit("trade_complete", trade);
      io.to(b).emit("trade_complete", trade);
      activeTrades.delete(tradeId);
    }
  });

  socket.on("trade_decline", ({ tradeId }) => {
    const trade = activeTrades.get(tradeId);
    if (!trade) return;

    trade.players.forEach(id => {
      io.to(id).emit("trade_declined");
    });

    activeTrades.delete(tradeId);
  });

  socket.on("chat:send", msg => {
    console.log(msg);
    io.emit("chat:msg", msg);
    // if (msg.tab === "general") {
    //   io.emit("chat:msg", msg);
    // } else {
    //   // Local chat (simple version = broadcast)
    //   socket.broadcast.emit("chat:msg", msg);
    // }
  });

  /* ============================
     8–10. EQUIP / UNEQUIP
  ============================ */
  socket.on("player:equip", data => {
    const player = players.get(socket.id);
    if (!player) return;

    player.equipment[data.slot] = data.item;
    io.emit("player:equip_update", {
      id: socket.id,
      slot: data.slot,
      item: data.item
    });
  });

  socket.on("player:unequip", data => {
    const player = players.get(socket.id);
    if (!player) return;

    delete player.equipment[data.slot];
    io.emit("player:unequip_update", {
      id: socket.id,
      slot: data.slot
    });
  });

  /* ============================
     9. CUSTOMIZATION
  ============================ */
  socket.on("player:customize", data => {
    const player = players.get(socket.id);
    if (!player) return;

    player.appearance = data.appearance;
    io.emit("player:customize_update", {
      id: socket.id,
      appearance: data.appearance
    });
  });

  /* ============================
     2. monster STATE + MOVEMENT
  ============================ */
  socket.on("monster:spawn", data => {
    const monsterId = crypto.randomUUID();

    data = {
      ...data,
      data: { ...data.data, monsterId }
    };

    monsters.set(monsterId, data);

    io.emit("monster:spawn", data);
  });


  socket.on("monster:update", data => {
    const monster = monsters.get(data.monsterId);
    if (!monster) return;

    console.log(monster);
    console.log(data);

    monster.data = data;

    io.emit("monster:update", monster);
  });

  /* ============================
     11. FLIGHT
  ============================ */
  socket.on("player:flight", data => {
    io.emit("player:flight_update", {
      id: socket.id,
      enabled: data.enabled
    });
  });

  /* ============================
     12. SKILLING ANIMATIONS
  ============================ */
  socket.on("skill:action", data => {
    io.emit("skill:action_state", {
      id: socket.id,
      skill: data.skill,
      state: data.state
    });
  });
})

// 4️⃣ Start server
server.listen(4000, () => {
  console.log("🚀 Server running at http://127.0.0.1:4000/");
});

function broadcastChat(message) {
  for (const ws of wss.clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "chat",
        channel: "general",
        ...message
      }));
    }
  }
}

const players = new Map();
const droppedItems = new Map();
const activeTrades = new Map();
const monsters = new Map();
const monsterId = crypto.randomUUID();
monsters.set(monsterId, {
  position: { x: 5, y: 0, z: -5 },
  name: 'Jersey Devil',
  data: {
    monsterId: monsterId,
    position: { x: 0.7029771791087613, y: 0, z: 0.7147989355024793 },
    type: 'walk'
  },
  stationary: false
});
const resources = new Map();
/*
tradeId => {
  id,
  players: [socketIdA, socketIdB],
  offers: {
    socketIdA: [],
    socketIdB: []
  },
  accepted: {
    socketIdA: false,
    socketIdB: false
  }
}
*/


function addPlayer(socketId, data) {
  players.set(socketId, {
    id: socketId,
    username: data.username,
    position: data.position || { x: 0, y: 5, z: 0 },
    rotation: 0,
    appearance: data.appearance,
    equipment: data.equipment || {},
    lastSeen: Date.now()
  });
}

function removePlayer(socketId) {
  players.delete(socketId);
}

function updatePlayer(socketId, update) {
  const player = players.get(socketId);
  if (!player) return;

  Object.assign(player, update);
  player.lastSeen = Date.now();
}

function getAllPlayers() {
  return Array.from(players.values());
}
