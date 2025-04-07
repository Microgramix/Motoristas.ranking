import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RankingList.module.scss';
import LevelIndicator from './LevelIndicator';
import TrendChart from '../TrendChart/TrendChart';

interface Driver {
  id?: string;
  name: string;
  deliveries: number;
  weeklyDeliveries?: number;
  avatar?: string;
  level?: number;
  trend?: number[];
  weeklyTrend?: number[];
}

interface LeaderboardProps {
  ranking: Driver[];
  highlightTop?: number;
  monthlyGoal: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ ranking, highlightTop = 5, monthlyGoal }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week');

  const isWeeklyMode = monthlyGoal === 130;

  const calculateProgress = (driver: Driver) => {
    const score = isWeeklyMode && driver.weeklyDeliveries !== undefined ? driver.weeklyDeliveries : driver.deliveries;
    return Math.min((score / monthlyGoal) * 100, 100);
  };

  const openModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setChartPeriod('week');
  };

  const closeModal = () => {
    setSelectedDriver(null);
  };

  const getFilteredTrendData = () => {
    if (!selectedDriver) return [];
    if (chartPeriod === 'week') return selectedDriver.weeklyTrend || [];
    if (chartPeriod === 'month') return selectedDriver.trend?.slice(-30) || [];
    if (chartPeriod === 'year') return selectedDriver.trend?.slice(-365) || [];
    return selectedDriver.trend || [];
  };

  return (
    <div className={styles.leaderboard}>
      {ranking.map((driver, index) => {
        const isTopPosition = index < highlightTop;
        const rawScore = isWeeklyMode && driver.weeklyDeliveries !== undefined
          ? driver.weeklyDeliveries
          : driver.deliveries;
        const isSushishop = driver.id?.startsWith('teamSushi') || driver.name.toLowerCase().includes('sushi');
        const correctedScore = isSushishop ? Math.round(rawScore * 0.8) : rawScore;
        const progress = Math.min((correctedScore / monthlyGoal) * 100, 100);

        return (
          <motion.div
            key={`${driver.name}-${index}`}
            className={`${styles.card} ${isTopPosition ? styles[`top-${index + 1}`] : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100, damping: 10 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openModal(driver)}
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
                <LevelIndicator deliveries={correctedScore} />
              </div>
            </div>

            <div className={styles.driverInfo}>
              <div className={styles.nameProgress}>
                <span className={styles.name}>
                  {driver.name}{isSushishop ? " (Sushishop)" : ""}
                </span>
                {/* Exibe os pontos originais */}
                <span className={styles.deliveries}>{rawScore.toLocaleString()} pts</span>
              </div>
              {/* Exibe também a correção para motoristas do Sushi */}
              {isSushishop && (
                <div className={styles.sushiCorrection}>
                  ⚠️ Correçao Sushi Shop: {correctedScore.toLocaleString()} pts
                </div>
              )}
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
          </motion.div>
        );
      })}

      <AnimatePresence>
        {selectedDriver && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button className={styles.closeButton} onClick={closeModal}>X</button>
              <div className={styles.chartPeriodToggle}>
                <button className={chartPeriod === 'week' ? styles.activePeriod : ''} onClick={() => setChartPeriod('week')}>Semana</button>
                <button className={chartPeriod === 'month' ? styles.activePeriod : ''} onClick={() => setChartPeriod('month')}>Mês</button>
                <button className={chartPeriod === 'year' ? styles.activePeriod : ''} onClick={() => setChartPeriod('year')}>Ano</button>
              </div>
              <TrendChart data={getFilteredTrendData()} />
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Entregas Hoje</span>
                  <span className={styles.statValue}>{(selectedDriver.deliveries * 0.1).toFixed(0)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Rating</span>
                  <span className={styles.statValue}>⭐5.0</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Eficiência</span>
                  <span className={styles.statValue}>90%</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Próximo Nível</span>
                  <span className={styles.statValue}>
                    {50 - (selectedDriver.deliveries % 50)} pts
                  </span>
                </div>
              </div>
              <button
                className={styles.challengeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Desafio enviado para ${selectedDriver.name}!`);
                }}
              >
                🏁 Desafiar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
