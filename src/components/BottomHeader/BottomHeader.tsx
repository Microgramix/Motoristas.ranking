import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './BottomHeader.module.scss';

const BottomHeader: React.FC = () => {
  return (
    <nav className={styles.bottomHeader}>
      <Link to="/" className={styles.link}>
      <motion.button whileTap={{ scale: 0.9 }} className={styles.navButton}>
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Home</span>
      </motion.button>
      </Link>
      <motion.button whileTap={{ scale: 0.9 }} className={styles.navButton}>
        <span className={styles.icon}>📊</span>
        <span className={styles.label}>Ranking</span>
      </motion.button>
      <motion.button whileTap={{ scale: 0.9 }} className={styles.navButton}>
        <span className={styles.icon}>🏁</span>
        <span className={styles.label}>Desafios</span>
      </motion.button>
      <Link to="/dashboard" className={styles.link}>
        <motion.button whileTap={{ scale: 0.9 }} className={styles.navButton}>
          <span className={styles.icon}>👤</span>
          <span className={styles.label}>Perfil</span>
        </motion.button>
      </Link>
    </nav>
  );
};

export default BottomHeader;
