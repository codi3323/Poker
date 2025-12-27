'use client';

import React from 'react';
import { Player } from '@/game/GameState';
import Card from '@/components/Card/Card';
import styles from './PlayerSeat.module.css';

interface PlayerSeatProps {
    player: Player;
    isMe: boolean;
    hasCards: boolean;
    isWinner: boolean;
}

export default function PlayerSeat({ player, isMe, hasCards, isWinner }: PlayerSeatProps) {
    const seatClasses = [
        styles['player-seat'],
        player.isCurrentTurn && !player.folded ? styles['current-turn'] : '',
        player.folded ? styles.folded : '',
        isWinner ? styles.winner : '',
        !player.connected ? styles.disconnected : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={seatClasses} style={{ position: 'relative' }}>
            {player.isDealer && <div className={styles['dealer-button']}>D</div>}

            <div className={styles.avatar}>
                {player.name.charAt(0).toUpperCase()}
            </div>

            <div className={styles['player-name']} title={player.name}>
                {player.name} {isMe && '(You)'}
            </div>

            <div className={styles.chips}>
                <span className={styles['chips-icon']} />
                {player.chips.toLocaleString()}
            </div>

            {hasCards && (
                <div className={styles['cards-container']}>
                    {isMe && player.cards.length > 0 ? (
                        player.cards.map((card, i) => (
                            <Card key={i} card={card} size="mini" dealing={true} delay={i * 100} />
                        ))
                    ) : player.cards.length === 0 && !player.folded ? (
                        <>
                            <Card faceDown size="mini" />
                            <Card faceDown size="mini" />
                        </>
                    ) : null}
                </div>
            )}

            {player.bet > 0 && (
                <div className={styles['bet-amount']}>
                    Bet: {player.bet}
                </div>
            )}

            {player.folded && (
                <span className={`${styles['status-badge']} ${styles['folded-text']}`}>Folded</span>
            )}
            {player.allIn && !player.folded && (
                <span className={`${styles['status-badge']} ${styles['all-in']}`}>All In</span>
            )}
            {!player.connected && (
                <span className={styles['status-badge']}>Disconnected</span>
            )}
        </div>
    );
}
