import React from 'react';
import styles from './components/RankingList/RankingList.module.scss';

interface TestAlertModalProps {
  onClose: () => void;
}

const TestAlertModal: React.FC<TestAlertModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 style={{ marginBottom: "1rem", textAlign: "center", color: "#FFD700" }}>
          Comunicado Importante
        </h2>
        <p style={{ textAlign: "center", color: "#FFFFFF", fontSize: "1rem" }}>
          O aplicativo de Ranking está atualmente em fase de testes e correções.<br></br>
          Os valores das entregas podem, por vezes, não refletir o valor correto.
          Contamos com o vosso feedback para aprimorar o sistema.
          Agradecemos a vossa colaboração e empenho! <br></br><br></br><br></br>
          
          FASTRACK.LU
        </p>
      </div>
    </div>
  );
};

export default TestAlertModal;
