import { Card } from './Card';

export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'ended';

export interface Player {
    id: string;
    name: string;
    chips: number;
    cards: Card[];
    bet: number;
    folded: boolean;
    allIn: boolean;
    isDealer: boolean;
    isCurrentTurn: boolean;
    connected: boolean;
}

export interface GameState {
    roomCode: string;
    phase: GamePhase;
    players: Player[];
    communityCards: Card[];
    pot: number;
    currentBet: number;
    dealerIndex: number;
    currentPlayerIndex: number;
    minRaise: number;
    smallBlind: number;
    bigBlind: number;
    winners: { playerId: string; amount: number; handDescription: string }[];
    lastAction: { playerId: string; action: string; amount?: number } | null;
}

export interface PlayerAction {
    type: 'fold' | 'check' | 'call' | 'raise' | 'all_in';
    amount?: number;
}

export function createInitialGameState(roomCode: string): GameState {
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

export function getPlayerView(state: GameState, playerId: string): GameState {
    // Hide other players' cards unless in showdown
    return {
        ...state,
        players: state.players.map(p => ({
            ...p,
            cards: p.id === playerId || state.phase === 'showdown' ? p.cards : []
        }))
    };
}
