import React from 'react';
import { motion } from 'framer-motion';
import styles from './RankingList.module.scss';
import LevelIndicator from './LevelIndicator';

interface PodiumProps {
  ranking: {
    name: string;
    deliveries: number;
    avatar?: string;
    level?: number;
  }[];
}

const Podium: React.FC<PodiumProps> = ({ ranking }) => {
  return (
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
            <div className={styles.podiumLevel}>
              <LevelIndicator deliveries={driver.deliveries} />
            </div>
          </div>
          <div className={styles.podiumName}>{driver.name}</div>
          <div className={styles.podiumScore}>{driver.deliveries} pts</div>
          <div className={styles.podiumPosition}>{index + 1}º</div>
        </motion.div>
      ))}
    </div>
  );
};

export default Podium;
