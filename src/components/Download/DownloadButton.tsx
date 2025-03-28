// DownloadButton.tsx
import React, { useEffect, useState } from 'react';
import styles from './DownloadButton.module.scss';

const DownloadButton: React.FC = () => {
  // Armazena o evento beforeinstallprompt para dispositivos que o suportam
  const [deferredPrompt, setDeferredPrompt] = useState<
    (Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }) | null
  >(null);
  // Detecta se o dispositivo é iOS
  const [isIos, setIsIos] = useState(false);
  // Estado para exibir uma mensagem de ajuda em iOS
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    // Verifica o userAgent para identificar iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));

    // Listener para beforeinstallprompt (funciona em Android/Chrome)
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
      // Para iOS, mostra uma mensagem de ajuda
      setShowIosHelp(true);
      return;
    }
    if (!deferredPrompt) return;

    // Exibe o prompt nativo para instalação (Android/Chrome)
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('App instalado com sucesso!');
    } else {
      console.log('Instalação cancelada pelo usuário.');
    }
    setDeferredPrompt(null);
  };

  // O botão será exibido se for iOS ou se houver deferredPrompt
  const shouldRenderButton = isIos || deferredPrompt !== null;
  if (!shouldRenderButton) return null;

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

      {/* Mensagem de ajuda para iOS */}
      {isIos && (
        <p className={styles.iosHelp}>
          Para instalar no iOS, toque no ícone de compartilhamento do Safari e selecione "Adicionar à Tela de Início".
        </p>
      )}

      {/* Modal de ajuda opcional para iOS */}
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
