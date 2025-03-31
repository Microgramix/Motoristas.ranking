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
  deliveries: number;       // Valor agregado (de acordo com o filtro aplicado)
  weeklyDeliveries: number; // Soma dos registros da semana atual (segunda a domingo)
  lastUpdate?: string;
  trend: number[];          // Histórico total (array com os valores para cada data)
  weeklyTrend: number[];    // Histórico dos dias da semana atual
  trendDates: string[];     // Datas correspondentes ao histórico
}

const App: React.FC = () => {
  // Estado para filtro diário (data selecionada)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  // Estado para escolher o período: 'daily', 'weekly' ou 'monthly'
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  // Estado para alternar entre visualizações: Ranking (normal) ou Meta (goal)
  const [viewMode, setViewMode] = useState<'normal' | 'goal'>('normal');
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Mapeamento de metas para cada período
  const goalMapping = {
    daily: 20,
    weekly: 130,
    monthly: 600,
  };
  const goal = goalMapping[period];

  // Função auxiliar para calcular a segunda-feira (início da semana)
  const getMonday = (date: Date): Date => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
  };

  useEffect(() => {
    const fetchData = async () => {
      const teamsSnapshot = await getDocs(collection(db, 'records'));
      const dates = new Set<string>();
      const today = new Date();
      const monday = getMonday(today);
      const todayStr = today.toISOString().substring(0, 10);
      dates.add(todayStr);

      // Se o período for diário, usamos a data selecionada; senão, consideramos todos os registros
      const filterByDate = period === 'daily' ? selectedDate : '';

      // Inicializa os dados dos motoristas (mesmo sem registros para a data filtrada)
      const allDrivers: Record<
        string,
        {
          deliveries: number;
          weeklyDeliveries: number;
          lastUpdate?: string;
          trend: Record<string, number>;
          weeklyTrend: Record<string, number>;
        }
      > = {};

      teamsSnapshot.forEach((teamDoc) => {
        const teamData = teamDoc.data();
        Object.entries(teamData).forEach(([date, drivers]) => {
          dates.add(date);
          Object.entries(drivers as Record<string, number>).forEach(
            ([driver, count]) => {
              if (!allDrivers[driver]) {
                allDrivers[driver] = {
                  deliveries: 0,
                  weeklyDeliveries: 0,
                  lastUpdate: undefined,
                  trend: {},
                  weeklyTrend: {},
                };
              }
              if (!filterByDate || date === filterByDate) {
                const currentCount = Number(count);
                allDrivers[driver].deliveries += currentCount;
                const recordDate = new Date(date);
                const isCurrentWeek = recordDate >= monday;
                if (isCurrentWeek) {
                  allDrivers[driver].weeklyDeliveries += currentCount;
                }
                if (
                  !allDrivers[driver].lastUpdate ||
                  recordDate > new Date(allDrivers[driver].lastUpdate!)
                ) {
                  allDrivers[driver].lastUpdate = date;
                }
                allDrivers[driver].trend[date] =
                  (allDrivers[driver].trend[date] || 0) + currentCount;
                if (isCurrentWeek) {
                  allDrivers[driver].weeklyTrend[date] =
                    (allDrivers[driver].weeklyTrend[date] || 0) + currentCount;
                }
              }
            }
          );
        });
      });

      setAvailableDates(Array.from(dates).sort().reverse());
      const sortedTrendDates = Array.from(dates).sort();
      const sortedRanking = Object.entries(allDrivers)
        .map(([name, { deliveries, weeklyDeliveries, lastUpdate, trend, weeklyTrend }]) => ({
          name,
          deliveries,
          weeklyDeliveries,
          lastUpdate,
          trend: sortedTrendDates.map(date => trend[date] || 0),
          weeklyTrend: sortedTrendDates
            .filter(date => new Date(date) >= monday)
            .map(date => weeklyTrend[date] || 0),
          trendDates: sortedTrendDates,
        }))
        .sort((a, b) => b.deliveries - a.deliveries);
      setRanking(sortedRanking);
    };

    fetchData();
  }, [selectedDate, period]);

  useEffect(() => {
    const resetViewport = () => {
      document.documentElement.style.zoom = '1';
      const viewport = document.querySelector("meta[name=viewport]");
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
    };

    window.addEventListener('resize', resetViewport);
    return () => window.removeEventListener('resize', resetViewport);
  }, []);

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

                  {/* Filtro de data aparece apenas para o modo diário */}
                  {period === 'daily' && (
                    <div className={styles.filters}>
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      >
                        <option value="">Todas as datas</option>
                        {availableDates.map(date => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('pt-BR')}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Painel de controles unificado */}
                  <div className={styles.controlPanel}>
                    <div className={styles.periodToggle}>
                      <span>Período:</span>
                      <button
                        className={period === 'daily' ? styles.active : ''}
                        onClick={() => setPeriod('daily')}
                      >
                        Diário
                      </button>
                      <button
                        className={period === 'weekly' ? styles.active : ''}
                        onClick={() => setPeriod('weekly')}
                      >
                        Semanal
                      </button>
                      <button
                        className={period === 'monthly' ? styles.active : ''}
                        onClick={() => setPeriod('monthly')}
                      >
                        Mensal
                      </button>
                    </div>
                    <div className={styles.viewToggle}>
                      <span>Visualização:</span>
                      <button
                        className={viewMode === 'normal' ? styles.active : ''}
                        onClick={() => setViewMode('normal')}
                      >
                        Ranking
                      </button>
                      <button
                        className={viewMode === 'goal' ? styles.active : ''}
                        onClick={() => setViewMode('goal')}
                      >
                        Meta ({period === 'monthly' ? 'Mensal' : period === 'weekly' ? 'Semanal' : 'Diária'})
                      </button>
                    </div>
                  </div>

                  {/* Passa os dados e configurações para o RankingList */}
                  <RankingList ranking={ranking} viewMode={viewMode} goal={goal} />
                </>
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <BottomHeader />
      </div>
    </BrowserRouter>
  );
};

export default App;
