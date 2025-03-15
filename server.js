const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const socketIo = require("socket.io");
// Create an HTTP server
const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    // Map URL paths to file paths in the public directory
    let publicFilePath = path.join(__dirname, "public", pathname);
    // Serve index.html by default if URL ends with '/'
    if (publicFilePath.endsWith("/")) {
        publicFilePath = path.join(publicFilePath, "index.html");
    }
    // Determine file extension
    let extname = path.extname(publicFilePath);
    let contentType = "text/html";
    // Set content type based on file extension
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;
        case ".ico":
            contentType = "image/x-icon";
            break;
    }
    // Serve files
    fs.readFile(publicFilePath, (err, content) => {
        if (!err) {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
        else {
            res.writeHead(404);
            res.end("404 Not Found");
        }
    });
});
// Attach Socket.IO to the HTTP server
const io = socketIo(server)(3000, {
    cors: { origin: "*" }
});
let players = {};
// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log(socket);
    console.log("A user connected:", socket.id);
    // Handle messages from the client
    socket.on("message", (data) => {
        console.log("Message received:", data);
        // Broadcast message to all connected clients
        io.emit("message", data);
    });
    socket.on("currentPlayers", (data) => {
        players[data.username] = {
            id: socket.id,
            username: data.username,
            position: { x: 0, y: 1, z: 0 },
            color: Math.random() * 0xffffff,
        };
        io.emit("currentPlayers", players);
        console.log("current players:", players);
    });
    // Handle disconnections
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        // Remove the player from the game state
        delete players[socket.id];
        // Notify clients
        io.emit("removePlayer", { id: socket.id });
    });
});
// Start server
server.listen(4000, () => {
    console.log("Server running at http://127.0.0.1:4000/");
});
