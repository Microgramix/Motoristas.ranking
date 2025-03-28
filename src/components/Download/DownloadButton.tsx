// DownloadButton.tsx
import React, { useEffect, useState } from 'react';
import styles from './DownloadButton.module.scss';

const DownloadButton: React.FC = () => {
  // Armazena o evento beforeinstallprompt (para Android/Chrome)
  const [deferredPrompt, setDeferredPrompt] = useState<
    (Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }) | null
  >(null);
  // Detecta se o dispositivo é iOS
  const [isIos, setIsIos] = useState(false);
  // Estado para exibir o modal de instruções para iOS
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    // Verifica o userAgent para identificar dispositivos iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));

    // Listener para beforeinstallprompt (Android/Chrome)
    const beforeInstallHandler = (
      e: Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
    ) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      // Em iOS, mostra o modal com as instruções de instalação
      setShowIosHelp(true);
      return;
    }
    if (deferredPrompt) {
      // Em dispositivos que suportam beforeinstallprompt, exibe o prompt nativo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App instalado com sucesso!');
      } else {
        console.log('Instalação cancelada pelo usuário.');
      }
      setDeferredPrompt(null);
    } else {
      // Se não houver deferredPrompt, exibe uma mensagem simples
      alert('Instalação não disponível. Tente através do navegador.');
    }
  };

  return (
    <div className={styles.downloadContainer}>
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

      {/* Modal de ajuda para dispositivos iOS */}
      {showIosHelp && (
        <div className={styles.iosHelpModal}>
          <p>
            Para instalar o app no seu dispositivo iOS, abra o menu de compartilhamento do Safari (ícone de compartilhamento) e selecione "Adicionar à Tela de Início".
          </p>
          <button onClick={() => setShowIosHelp(false)}>Fechar</button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
