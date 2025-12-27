'use client';

import { io, Socket } from 'socket.io-client';
import { GameState, PlayerAction } from '@/game/GameState';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io({
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
    }
    return socket;
}

export function createRoom(playerName: string): Promise<{ roomCode: string; state: GameState; playerId: string }> {
    return new Promise((resolve, reject) => {
        const s = getSocket();
        s.emit('create_room', { playerName });

        s.once('room_created', (data) => resolve(data));
        s.once('error', (data) => reject(new Error(data.message)));
    });
}

export function joinRoom(roomCode: string, playerName: string): Promise<{ roomCode: string; state: GameState; playerId: string }> {
    return new Promise((resolve, reject) => {
        const s = getSocket();
        s.emit('join_room', { roomCode, playerName });

        s.once('room_joined', (data) => resolve(data));
        s.once('error', (data) => reject(new Error(data.message)));
    });
}

export function startGame(): void {
    getSocket().emit('start_game');
}

export function sendAction(action: PlayerAction): void {
    getSocket().emit('player_action', action);
}

export function requestNewHand(): void {
    getSocket().emit('new_hand');
}

export function onGameUpdate(callback: (data: { state: GameState }) => void): () => void {
    const s = getSocket();
    s.on('game_update', callback);
    return () => s.off('game_update', callback);
}

export function onError(callback: (data: { message: string }) => void): () => void {
    const s = getSocket();
    s.on('error', callback);
    return () => s.off('error', callback);
}

export function disconnect(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function rejoinRoom(roomCode: string, playerName: string): Promise<{ roomCode: string; state: GameState; playerId: string }> {
    return new Promise((resolve, reject) => {
        const s = getSocket();
        s.emit('join_room', { roomCode, playerName });

        const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
        }, 5000);

        s.once('room_joined', (data) => {
            clearTimeout(timeout);
            resolve(data);
        });
        s.once('error', (data) => {
            clearTimeout(timeout);
            reject(new Error(data.message));
        });
    });
}
