import React from 'react';
import { motion } from 'framer-motion';
import styles from './RankingList.module.scss';

interface FooterProps {
  ranking: { name: string; deliveries: number }[];
}

const Footer: React.FC<FooterProps> = ({ ranking }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.teamStats}>
        <div className={styles.teamStat}>
          <span>🏆 Top 1:</span>
          <span>{ranking[0]?.name || '-'}</span>
        </div>
        <div className={styles.teamStat}>
          <span>📊 Total Entregas:</span>
          <span>
            {ranking.reduce((sum, driver) => sum + driver.deliveries, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.powerupButton}
          onClick={() => alert('Power-up ativado! Bônus de 10% por 2 horas!')}
        >
          🎮 ATIVAR TURBO
        </button>
        <div className={styles.timer}>
          ⏳ Próxima atualização: <span>2h 15m</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
