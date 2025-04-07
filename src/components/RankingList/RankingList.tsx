import React from 'react';
import styles from './RankingList.module.scss';
import Podium from './Podium';
import Leaderboard from './Leaderboard';
import Footer from './Footer';

export interface RankingItem {
  id: string;
  name: string;
  deliveries: number;
  finalScore: number; // Pontos corrigidos para ordenação (para Sushishop)
  avatar?: string;
  level?: number;
  progress?: number;
}

interface RankingListProps {
  ranking: RankingItem[];
  viewMode: 'normal' | 'goal';
  goal: number;
  highlightTop?: number;
}

const RankingList: React.FC<RankingListProps> = ({
  ranking,
  viewMode,
  goal,
  highlightTop = 5,
}) => {
  // Calcula o total de entregas e a porcentagem para preencher a meta
  const totalDeliveries = ranking.reduce((sum, driver) => sum + driver.deliveries, 0);
  const goalProgressPercentage = Math.min((totalDeliveries / goal) * 100, 100);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.goalMeter}>
          <div className={styles.goalLabel}>Meta: {goal} entregas</div>
          <div className={styles.goalProgress}>
            <div
              className={styles.goalFill}
              style={{ width: `${goalProgressPercentage}%` }}
            />
          </div>
        </div>
        <span className={styles.lastUpdate}>📅 Atualizado: 07/04/2025</span>
      </div>

      <Podium ranking={ranking} />

      {viewMode === 'normal' ? (
        <Leaderboard ranking={ranking} highlightTop={highlightTop} monthlyGoal={goal} />
      ) : (
        <div className={styles.goalView}>
          {ranking.slice(0, 10).map((driver, index) => {
            const isSushishop =
              driver.id?.startsWith('teamSushi') ||
              driver.name.toLowerCase().includes('sushi');
            const correctedScore = isSushishop
              ? Math.round(driver.deliveries * 0.8)
              : driver.deliveries;
            const progress = Math.min((correctedScore / goal) * 100, 100);

            return (
              <div key={`goal-${index}`} className={styles.goalCard}>
                <div className={styles.goalRank}>{index + 1}º</div>
                <div className={styles.goalAvatar}>{driver.avatar || '🚚'}</div>
                <div className={styles.goalInfo}>
                  <div className={styles.goalName}>
                    {driver.name}
                    {isSushishop && ' (Sushishop)'}
                  </div>
                  <div className={styles.goalProgressContainer}>
                    <div className={styles.goalProgressBar} style={{ width: `${progress}%` }}>
                      <span className={styles.goalProgressText}>
                        {driver.deliveries} pts | Corrigido: {correctedScore} pts ({progress.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>
                {progress >= 100 && <div className={styles.goalAchieved}>✅ CONCLUÍDO</div>}
              </div>
            );
          })}
        </div>
      )}

      <Footer ranking={ranking} />
      {ranking.length > 0 && <div className={styles.championGlow} />}
    </div>
  );
};

export default RankingList;
