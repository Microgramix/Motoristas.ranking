// Leaderboard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RankingList.module.scss';
import LevelIndicator from './LevelIndicator';

interface Driver {
  name: string;
  deliveries: number;
  avatar?: string;
  level?: number;
}

interface LeaderboardProps {
  ranking: Driver[];
  highlightTop?: number;
  monthlyGoal: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ ranking, highlightTop = 5, monthlyGoal }) => {
  const [expandedView, setExpandedView] = useState<number | null>(null);

  const toggleDriverView = (index: number) => {
    setExpandedView(expandedView === index ? null : index);
  };

  const calculateProgress = (deliveries: number) => Math.min((deliveries / monthlyGoal) * 100, 100);

  return (
    <div className={styles.leaderboard}>
      <AnimatePresence>
        {ranking.map((driver, index) => {
          const isTopPosition = index < highlightTop;
          const progress = calculateProgress(driver.deliveries);
          const isExpanded = expandedView === index;

          return (
            <motion.div
              key={`${driver.name}-${index}`}
              className={`${styles.card} ${isTopPosition ? styles[`top-${index + 1}`] : ''} ${
                isExpanded ? styles.expanded : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 100, damping: 10 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleDriverView(index)}
              layout
            >
              <div className={styles.rankBadge}>
                <div className={styles.rank}>{index + 1}º</div>
                {isTopPosition && (
                  <div className={styles.medal}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                  </div>
                )}
              </div>

              <div className={styles.driverAvatar}>
                {driver.avatar || '🚛'}
                <div className={styles.levelBadge}>
                  <LevelIndicator deliveries={driver.deliveries} />
                </div>
              </div>

              <div className={styles.driverInfo}>
                <div className={styles.nameProgress}>
                  <span className={styles.name}>{driver.name}</span>
                  <span className={styles.deliveries}>{driver.deliveries.toLocaleString()} pts</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  <span className={styles.progressText}>{progress.toFixed(0)}%</span>
                </div>
              </div>

              {isTopPosition && (
                <div className={styles.ribbon}>
                  {index === 0 ? 'CAMPEÃO' : `${index + 1}º LUGAR`}
                </div>
              )}

              {isExpanded && (
                <motion.div
                  className={styles.expandedInfo}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Entregas Hoje</span>
                      <span className={styles.statValue}>{(driver.deliveries * 0.1).toFixed(0)}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Rating</span>
                      <span className={styles.statValue}>⭐{(5 - index * 0.5).toFixed(1)}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Eficiência</span>
                      <span className={styles.statValue}>{(90 + index * 2)}%</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Próximo Nível</span>
                      <span className={styles.statValue}>{50 - (driver.deliveries % 50)} pts</span>
                    </div>
                  </div>
                  <button
                    className={styles.challengeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Desafio enviado para ${driver.name}!`);
                    }}
                  >
                    🏁 Desafiar
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
