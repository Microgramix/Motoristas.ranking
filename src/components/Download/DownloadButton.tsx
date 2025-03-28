// download/download.tsx
import React, { useEffect, useState } from 'react';
import styles from './DownloadButton.module.scss'; // Crie este arquivo para customizar os estilos, se desejar.

const DownloadButton: React.FC = () => {
  // Armazena o evento 'beforeinstallprompt'
  const [deferredPrompt, setDeferredPrompt] = useState<
    (Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }) | null
  >(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const beforeInstallHandler = (
      e: Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
    ) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Exibe o prompt de instalação do PWA
    deferredPrompt.prompt();

    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('App instalado com sucesso!');
    } else {
      console.log('Instalação cancelada pelo usuário.');
    }
    // Reseta o estado
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Se não for instalável, não renderiza nada
  if (!isInstallable) return null;

  return (
    <button onClick={handleInstallClick} className={styles.downloadButton} title="Instalar App">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" 
        height="24" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M5 20h14v-2H5v2zm7-18L5 9h4v6h4V9h4l-7-7z" />
      </svg>
    </button>
  );
};

export default DownloadButton;
