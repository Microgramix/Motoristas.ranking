// Leaderboard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RankingList.module.scss';
import LevelIndicator from './LevelIndicator';
import TrendChart from '../TrendChart/TrendChart';

interface Driver {
  name: string;
  deliveries: number;         // Total
  weeklyDeliveries?: number;  // Entregas da semana corrente
  avatar?: string;
  level?: number;
  trend?: number[];           // Histórico total
  weeklyTrend?: number[];     // Histórico somente da semana atual
}

interface LeaderboardProps {
  ranking: Driver[];
  highlightTop?: number;
  monthlyGoal: number; // Valor da meta conforme o período (por exemplo, semanal = 130)
}

const Leaderboard: React.FC<LeaderboardProps> = ({ ranking, highlightTop = 5, monthlyGoal }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  // Estado para controlar o período do gráfico: 'week' (semana), 'month' (mês) e 'year' (ano)
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Detecta se estamos em modo semanal (por exemplo, se a meta é 130)
  const isWeeklyMode = monthlyGoal === 130;

  // Usa o valor correto de pontuação conforme o modo (se semanal, utiliza weeklyDeliveries)
  const calculateProgress = (driver: Driver) => {
    const score = isWeeklyMode && driver.weeklyDeliveries !== undefined ? driver.weeklyDeliveries : driver.deliveries;
    return Math.min((score / monthlyGoal) * 100, 100);
  };

  // Abre o modal e reseta o período para semana
  const openModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setChartPeriod('week');
  };

  const closeModal = () => {
    setSelectedDriver(null);
  };

  // Filtra os dados do gráfico com base no período selecionado
  const getFilteredTrendData = () => {
    if (!selectedDriver) return [];
    // Se estivermos no modo semanal, utiliza o histórico semanal calculado
    if (chartPeriod === 'week') {
      return selectedDriver.weeklyTrend || [];
    } else if (chartPeriod === 'month') {
      // Últimos 30 dias do histórico total
      return selectedDriver.trend ? selectedDriver.trend.slice(-30) : [];
    } else if (chartPeriod === 'year') {
      // Últimos 365 dias do histórico total
      return selectedDriver.trend ? selectedDriver.trend.slice(-365) : [];
    }
    return selectedDriver.trend || [];
  };

  return (
    <div className={styles.leaderboard}>
      {ranking.map((driver, index) => {
        const isTopPosition = index < highlightTop;
        // Se estivermos em modo semanal, usa weeklyDeliveries; caso contrário, usa o total
        const score = isWeeklyMode && driver.weeklyDeliveries !== undefined ? driver.weeklyDeliveries : driver.deliveries;
        const progress = calculateProgress(driver);
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
                <LevelIndicator deliveries={score} />
              </div>
            </div>

            <div className={styles.driverInfo}>
              <div className={styles.nameProgress}>
                <span className={styles.name}>{driver.name}</span>
                <span className={styles.deliveries}>{score.toLocaleString()} pts</span>
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
          </motion.div>
        );
      })}

      {/* Modal para exibir detalhes do motorista e o gráfico */}
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
              <button className={styles.closeButton} onClick={closeModal}>
                X
              </button>
              
              {/* Seletor de período para o gráfico */}
              <div className={styles.chartPeriodToggle}>
                <button 
                  className={chartPeriod === 'week' ? styles.activePeriod : ''}
                  onClick={() => setChartPeriod('week')}
                >
                  Semana
                </button>
                <button 
                  className={chartPeriod === 'month' ? styles.activePeriod : ''}
                  onClick={() => setChartPeriod('month')}
                >
                  Mês
                </button>
                <button 
                  className={chartPeriod === 'year' ? styles.activePeriod : ''}
                  onClick={() => setChartPeriod('year')}
                >
                  Ano
                </button>
              </div>

              {/* Gráfico de Tendência com dados filtrados */}
              <TrendChart data={getFilteredTrendData()} />

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Entregas Hoje</span>
                  <span className={styles.statValue}>
                    {(selectedDriver.deliveries * 0.1).toFixed(0)}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Rating</span>
                  <span className={styles.statValue}>⭐{(5).toFixed(1)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Eficiência</span>
                  <span className={styles.statValue}>{(90).toFixed(0)}%</span>
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
