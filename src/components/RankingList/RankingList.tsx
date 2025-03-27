import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './RankingList.module.scss';

interface RankingItem {
  name: string;
  deliveries: number;
  avatar?: string;
  level?: number;
  progress?: number;
}

interface RankingListProps {
  ranking: RankingItem[];
  highlightTop?: number;
  monthlyGoal?: number;
}

const GOAL = 600;

const generateConfetti = () => {
  const confetti = [];
  const emojis = ['🎉', '🏆', '🚀', '💎', '⭐', '🔥', '✨'];
  for (let i = 0; i < 75; i++) {
    confetti.push({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 0.5}s`,
        fontSize: `${Math.random() * 20 + 10}px`,
        rotate: Math.random() * 360
      },
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    });
  }
  return confetti;
};

const RankingList = ({ ranking, highlightTop = 5, monthlyGoal = GOAL }: RankingListProps) => {
  const [confetti, setConfetti] = useState<any[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const [expandedView, setExpandedView] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'goal'>('normal');

  useEffect(() => {
    setConfetti(generateConfetti());
  }, []);

  const toggleDriverView = (index: number) => {
    setExpandedView(expandedView === index ? null : index);
  };

  const calculateProgress = (deliveries: number) => {
    return Math.min((deliveries / monthlyGoal) * 100, 100);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      <div className={styles.header}>
        <motion.h1
          className={styles.title}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          🚛 FASTRACK ELITE 🏁
        </motion.h1>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${viewMode === 'normal' ? styles.active : ''}`}
            onClick={() => setViewMode('normal')}
          >
            Ranking
          </button>
          <button
            className={`${styles.toggleButton} ${viewMode === 'goal' ? styles.active : ''}`}
            onClick={() => setViewMode('goal')}
          >
            Meta Mensal
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.goalMeter}>
            <div className={styles.goalLabel}>Meta do Mês: {monthlyGoal} entregas</div>
            <div className={styles.goalProgress}>
              <div
                className={styles.goalFill}
                style={{ width: `${(ranking.reduce((sum, driver) => sum + driver.deliveries, 0) / monthlyGoal) * 100}%` }}
              />
            </div>
          </div>
          <span className={styles.lastUpdate}>📅 Atualizado: 26/03/2025</span>
        </div>
      </div>

      <div className={styles.podiumContainer}>
        {ranking.slice(0, 3).map((driver, index) => (
          <motion.div
            key={`podium-${index}`}
            className={`${styles.podium} ${styles[`podium-${index}`]}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
          >
            <div className={styles.podiumAvatar}>
              {driver.avatar || (index === 0 ? '👑' : index === 1 ? '🥈' : '🥉')}
              <div className={styles.podiumLevel}>Lv. {driver.level || Math.floor(driver.deliveries / 50) + 1}</div>
            </div>
            <div className={styles.podiumName}>{driver.name}</div>
            <div className={styles.podiumScore}>{driver.deliveries} pts</div>
            <div className={styles.podiumPosition}>{index + 1}º</div>
          </motion.div>
        ))}
      </div>

      <div className={styles.leaderboard}>
        {celebrating && (
          <div className={styles.confettiContainer}>
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className={styles.confetti}
                style={piece.style}
                initial={{ y: -100, opacity: 1 }}
                animate={{ y: '100vh', opacity: 0 }}
                transition={{
                  duration: parseFloat(piece.style.animationDuration),
                  delay: parseFloat(piece.style.animationDelay),
                  ease: 'linear'
                }}
              >
                {piece.emoji}
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {viewMode === 'normal' ? (
            ranking.map((driver, index) => {
              const isTopPosition = index < highlightTop;
              const progress = calculateProgress(driver.deliveries);
              const isExpanded = expandedView === index;

              return (
                <motion.div
                  key={`${driver.name}-${index}`}
                  className={`${styles.card} ${isTopPosition ? styles[`top-${index + 1}`] : ''} ${isExpanded ? styles.expanded : ''}`}
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
                    <div className={styles.levelBadge}>Lv. {driver.level || Math.floor(driver.deliveries / 50) + 1}</div>
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
            })
          ) : (
            <motion.div
              className={styles.goalView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {ranking.slice(0, 10).map((driver, index) => {
                const progress = calculateProgress(driver.deliveries);
                return (
                  <div key={`goal-${index}`} className={styles.goalCard}>
                    <div className={styles.goalRank}>{index + 1}º</div>
                    <div className={styles.goalAvatar}>{driver.avatar || '🚚'}</div>
                    <div className={styles.goalInfo}>
                      <div className={styles.goalName}>{driver.name}</div>
                      <div className={styles.goalProgressContainer}>
                        <div className={styles.goalProgressBar} style={{ width: `${progress}%` }}>
                          <span className={styles.goalProgressText}>
                            {driver.deliveries}/{monthlyGoal} ({progress.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    {progress >= 100 && (
                      <div className={styles.goalAchieved}>✅ CONCLUÍDO</div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <div className={styles.teamStats}>
          <div className={styles.teamStat}>
            <span>🏆 Top 1:</span>
            <span>{ranking[0]?.name || '-'}</span>
          </div>
          <div className={styles.teamStat}>
            <span>📊 Total Entregas:</span>
            <span>{ranking.reduce((sum, driver) => sum + driver.deliveries, 0).toLocaleString()}</span>
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

      {ranking.length > 0 && (
        <div className={styles.championGlow}></div>
      )}
    </div>
  );
};

export default RankingList;
