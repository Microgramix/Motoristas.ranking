import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.scss';
import accountsData from '../../data/accounts.json';

interface Account {
  id: string;
  name: string;
  avatar: string;
  level: number;
  deliveries?: number; // Tornado opcional, pois não está no JSON
  achievements: string[];
  token: string;
  password: string;
}

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [inputId, setInputId] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Se o JSON tem a propriedade "accounts", utiliza-a:
    setAccounts(accountsData.accounts);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(
      (acc) => acc.id === inputId && acc.password === inputPassword
    );
    if (account) {
      setSelectedAccount(account);
      setLoggedIn(true);
      setError('');
    } else {
      setError('Credenciais inválidas!');
    }
  };

  if (!loggedIn) {
    return (
      <div className={styles.dashboard}>
        <h2 className={styles.dashboardTitle}>Login</h2>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <input 
            type="text"
            placeholder="ID da Conta"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className={styles.inputField}
          />
          <input 
            type="password"
            placeholder="Senha"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className={styles.inputField}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginButton}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.dashboardTitle}>Dashboard de {selectedAccount?.name}</h2>
      <div className={styles.accountCard}>
        <img src={selectedAccount?.avatar} alt={selectedAccount?.name} className={styles.avatar} />
        <h3 className={styles.name}>{selectedAccount?.name}</h3>
        <p className={styles.level}>Nível: {selectedAccount?.level}</p>
        <p className={styles.deliveries}>Entregas: {selectedAccount?.deliveries || 0}</p>
        <div className={styles.achievements}>
          {selectedAccount?.achievements.map((ach, idx) => (
            <span key={idx} className={styles.achievement}>{ach}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
