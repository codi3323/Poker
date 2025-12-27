import { Card, SUITS, RANKS } from './Card';

export class Deck {
    private cards: Card[] = [];

    constructor() {
        this.reset();
    }

    reset(): void {
        this.cards = [];
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                this.cards.push({ suit, rank });
            }
        }
        this.shuffle();
    }

    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(count: number = 1): Card[] {
        return this.cards.splice(0, count);
    }

    remaining(): number {
        return this.cards.length;
    }
}
