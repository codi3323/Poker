"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const Card_1 = require("./Card");
class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }
    reset() {
        this.cards = [];
        for (const suit of Card_1.SUITS) {
            for (const rank of Card_1.RANKS) {
                this.cards.push({ suit, rank });
            }
        }
        this.shuffle();
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    deal(count = 1) {
        return this.cards.splice(0, count);
    }
    remaining() {
        return this.cards.length;
    }
}
exports.Deck = Deck;
