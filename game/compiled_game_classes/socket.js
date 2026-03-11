// // io() comes from the CDN global
// if (typeof io !== "function") {
//     throw new Error("Socket.IO client not loaded");
// }
// export const socket = io("http://127.0.0.1:4000", {
//     transports: ["websocket"]
// });
// socket.on("connect", () => {
//     console.log("✅ Socket connected:", socket.id);
// });
// socket.on('message', (data) => {
//     console.log(data);
// });
// SocketManager.js
class SocketManager {
    constructor(serverUrl) {
        this.isTrading = false;
        this.currentTradeId = null;
        this.socket = io(serverUrl);
        this.setupListeners();
    }
    setupListeners() {
        // Use arrow functions to maintain the correct 'this' context
        // this.socket.on('connect', () => {
        //     console.log('Connected to server, socket ID:', this.socket.id);
        //     this.handleConnect();
        // });
        // this.socket.on('message', (data) => {
        //     this.handleMessage(data);
        // });
        // this.socket.on('disconnect', () => {
        //     console.log('Disconnected from server');
        // });
    }
    handleConnect() {
        // Handle connection logic
    }
    handleMessage(data) {
        console.log('Received message:', data);
        // Process the message data
    }
    sendMessage(event, data) {
        this.socket.emit(event, data);
    }
}
// Export a singleton instance
export default new SocketManager('http://127.0.0.1:4000');
