"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialGameState = createInitialGameState;
exports.getPlayerView = getPlayerView;
function createInitialGameState(roomCode) {
    return {
        roomCode,
        phase: 'waiting',
        players: [],
        communityCards: [],
        pot: 0,
        currentBet: 0,
        dealerIndex: 0,
        currentPlayerIndex: 0,
        minRaise: 20,
        smallBlind: 10,
        bigBlind: 20,
        winners: [],
        lastAction: null
    };
}
function getPlayerView(state, playerId) {
    // Hide other players' cards unless in showdown
    return Object.assign(Object.assign({}, state), { players: state.players.map(p => (Object.assign(Object.assign({}, p), { cards: p.id === playerId || state.phase === 'showdown' ? p.cards : [] }))) });
}
