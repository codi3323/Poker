'use client';

import React from 'react';
import { Card as CardType, SUIT_SYMBOLS } from '@/game/Card';
import styles from './Card.module.css';

interface CardProps {
    card?: CardType;
    faceDown?: boolean;
    size?: 'normal' | 'mini';
    dealing?: boolean;
    delay?: number;
}

export default function Card({ card, faceDown = false, size = 'normal', dealing = false, delay = 0 }: CardProps) {
    if (faceDown || !card) {
        return (
            <div
                className={`${styles.card} ${styles.facedown} ${size === 'mini' ? styles['card-mini'] : ''} ${dealing ? styles.dealing : ''}`}
                style={dealing ? { animationDelay: `${delay}ms` } : undefined}
            />
        );
    }

    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

    return (
        <div
            className={`${styles.card} ${isRed ? styles.red : styles.black} ${size === 'mini' ? styles['card-mini'] : ''} ${dealing ? styles.dealing : ''}`}
            style={dealing ? { animationDelay: `${delay}ms` } : undefined}
        >
            <span className={styles.rank}>{card.rank}</span>
            <span className={styles.suit}>{SUIT_SYMBOLS[card.suit]}</span>
        </div>
    );
}
