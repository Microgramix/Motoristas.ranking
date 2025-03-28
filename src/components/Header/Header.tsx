// Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Header.module.scss';
import DownloadButton from '../Download/DownloadButton';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Fastrack" className={styles.logo} />
      </div>
      
      {/* Componente de download (ícone) */}
      <DownloadButton />

      <div className={styles.notificationIcon}>
        <motion.div whileTap={{ scale: 0.9 }} className={styles.notificationBadge}>
          <span>🔔</span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
