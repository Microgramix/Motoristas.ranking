import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styles from './RankingList.module.scss';
import Podium from './Podium';
import Leaderboard from './Leaderboard';
import Footer from './Footer';

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
  monthlyGoal?: number; // Valor padrão usado se não for filtrado por período
}

const RankingList: React.FC<RankingListProps> = ({ ranking, highlightTop = 5, monthlyGoal = 600 }) => {
  // viewMode para alternar entre ranking e meta (como já existe)
  const [viewMode, setViewMode] = useState<'normal' | 'goal'>('normal');
  // Estado para selecionar o período: diário, semanal ou mensal
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Mapeia as metas para cada período; ajuste os valores conforme necessário
  const goalMapping = {
    daily: 20,    // ex.: meta de 40 entregas por dia
    weekly: 130,  // meta de 120 entregas por semana
    monthly: 520, // meta de 600 entregas por mês (valor padrão)
  };

  const goal = goalMapping[period];

  return (
    <div className={styles.gameContainer}>
      <div className={styles.particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      <div className={styles.header}>
        

        {/* Alternador entre visualizações: Ranking ou Meta */}
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
            Meta {period === 'monthly' ? 'Mensal' : period === 'weekly' ? 'Semanal' : 'Diária'}
          </button>
        </div>

        {/* Novo seletor de período */}
        <div className={styles.periodToggle}>
          <button
            className={`${styles.periodButton} ${period === 'daily' ? styles.active : ''}`}
            onClick={() => setPeriod('daily')}
          >
            Diário
          </button>
          <button
            className={`${styles.periodButton} ${period === 'weekly' ? styles.active : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            Semanal
          </button>
          <button
            className={`${styles.periodButton} ${period === 'monthly' ? styles.active : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            Mensal
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.goalMeter}>
            <div className={styles.goalLabel}>
              {period === 'daily'
                ? 'Meta Diário'
                : period === 'weekly'
                ? 'Meta Semanal'
                : 'Meta Mensal'}
              : {goal} entregas
            </div>
            <div className={styles.goalProgress}>
              <div
                className={styles.goalFill}
                style={{
                  width: `${
                    (ranking.reduce((sum, driver) => sum + driver.deliveries, 0) / goal) * 100
                  }%`,
                }}
              />
            </div>
          </div>
          <span className={styles.lastUpdate}>📅 Atualizado: 26/03/2025</span>
        </div>
      </div>

      {/* Componente Podium */}
      <Podium ranking={ranking} />

      {/* Renderiza Leaderboard ou visualização de meta */}
      {viewMode === 'normal' ? (
        <Leaderboard ranking={ranking} highlightTop={highlightTop} monthlyGoal={goal} />
      ) : (
        <div className={styles.goalView}>
          {ranking.slice(0, 10).map((driver, index) => {
            const progress = Math.min((driver.deliveries / goal) * 100, 100);
            return (
              <div key={`goal-${index}`} className={styles.goalCard}>
                <div className={styles.goalRank}>{index + 1}º</div>
                <div className={styles.goalAvatar}>{driver.avatar || '🚚'}</div>
                <div className={styles.goalInfo}>
                  <div className={styles.goalName}>{driver.name}</div>
                  <div className={styles.goalProgressContainer}>
                    <div className={styles.goalProgressBar} style={{ width: `${progress}%` }}>
                      <span className={styles.goalProgressText}>
                        {driver.deliveries}/{goal} ({progress.toFixed(0)}%)
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

      {/* Componente Footer */}
      <Footer ranking={ranking} />

      {ranking.length > 0 && <div className={styles.championGlow}></div>}
    </div>
  );
};

export default RankingList;
