import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase/Firebase';
import RankingList from './components/RankingList/RankingList';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import BottomHeader from './components/BottomHeader/BottomHeader';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.scss';

interface RankingItem {
  name: string;
  deliveries: number;
}

const App: React.FC = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Busca todas as equipes e datas disponíveis do Firestore
  useEffect(() => {
    const fetchData = async () => {
      const teamsSnapshot = await getDocs(collection(db, 'records'));
      const dates = new Set<string>();
      const allDrivers: Record<string, number> = {};

      teamsSnapshot.forEach((teamDoc) => {
        const teamData = teamDoc.data();
        Object.entries(teamData).forEach(([date, drivers]) => {
          dates.add(date);
          if (!selectedDate || date === selectedDate) {
            Object.entries(drivers as Record<string, number>).forEach(([driver, count]) => {
              allDrivers[driver] = (allDrivers[driver] || 0) + count;
            });
          }
        });
      });

      setAvailableDates(Array.from(dates).sort().reverse());
      const sortedRanking = Object.entries(allDrivers)
        .map(([name, deliveries]) => ({ name, deliveries }))
        .sort((a, b) => b.deliveries - a.deliveries);
      setRanking(sortedRanking);
    };

    fetchData();
  }, [selectedDate]);

  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Header />
        <main className={styles.mainContent}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className={styles.title}>🏆 Ranking de Entregas</h1>
                  <div className={styles.filters}>
                    <select 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option value="">Todas as datas</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('pt-BR')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <RankingList ranking={ranking} />
                </>
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Outras rotas, como /home, /ranking, /desafios, podem ser adicionadas aqui */}
          </Routes>
        </main>
        <BottomHeader />
      </div>
    </BrowserRouter>
  );
};

export default App;
