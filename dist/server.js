"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const gameManager_1 = require("./src/server/gameManager");
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = (0, next_1.default)({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    });
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        let currentRoom = null;
        socket.on('create_room', ({ playerName }) => {
            const { roomCode, state } = (0, gameManager_1.createRoom)(socket.id, playerName);
            currentRoom = roomCode;
            socket.join(roomCode);
            socket.emit('room_created', { roomCode, state, playerId: socket.id });
        });
        socket.on('join_room', ({ roomCode, playerName }) => {
            const result = (0, gameManager_1.joinRoom)(roomCode.toUpperCase(), socket.id, playerName);
            if (result.success && result.state) {
                currentRoom = roomCode.toUpperCase();
                socket.join(currentRoom);
                socket.emit('room_joined', { roomCode: currentRoom, state: result.state, playerId: socket.id });
                // Notify all players in room of update
                const fullState = (0, gameManager_1.getFullRoomState)(currentRoom);
                if (fullState) {
                    fullState.players.forEach(p => {
                        io.to(p.id).emit('game_update', { state: (0, gameManager_1.getRoomState)(currentRoom, p.id) });
                    });
                }
            }
            else {
                socket.emit('error', { message: result.error });
            }
        });
        socket.on('start_game', () => {
            if (!currentRoom)
                return;
            const result = (0, gameManager_1.startGame)(currentRoom, socket.id);
            if (result.success) {
                broadcastGameState(currentRoom);
            }
            else {
                socket.emit('error', { message: result.error });
            }
        });
        socket.on('player_action', (action) => {
            if (!currentRoom)
                return;
            const result = (0, gameManager_1.handleAction)(currentRoom, socket.id, action);
            if (result.success) {
                broadcastGameState(currentRoom);
            }
            else {
                socket.emit('error', { message: result.error });
            }
        });
        socket.on('new_hand', () => {
            if (!currentRoom)
                return;
            if ((0, gameManager_1.newHand)(currentRoom)) {
                broadcastGameState(currentRoom);
            }
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            const roomCode = (0, gameManager_1.playerDisconnected)(socket.id);
            if (roomCode) {
                broadcastGameState(roomCode);
            }
        });
        function broadcastGameState(roomCode) {
            const fullState = (0, gameManager_1.getFullRoomState)(roomCode);
            if (fullState) {
                fullState.players.forEach(p => {
                    io.to(p.id).emit('game_update', { state: (0, gameManager_1.getRoomState)(roomCode, p.id) });
                });
            }
        }
    });
    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
