import React from 'react';
import { motion } from 'framer-motion';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        {/* Substitua '/logo.png' pela URL ou import do seu logo */}
        <img src="/logo.png" alt="Fastrack" className={styles.logo} />
      </div>
      <div className={styles.notificationIcon}>
        <motion.div whileTap={{ scale: 0.9 }} className={styles.notificationBadge}>
          {/* Ícone de notificação */}
          <span>🔔</span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
