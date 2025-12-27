"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUIT_SYMBOLS = exports.RANK_VALUES = exports.RANKS = exports.SUITS = void 0;
exports.cardToString = cardToString;
exports.SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
exports.RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
exports.RANK_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};
exports.SUIT_SYMBOLS = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
};
function cardToString(card) {
    return `${card.rank}${exports.SUIT_SYMBOLS[card.suit]}`;
}
