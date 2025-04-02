// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import BottomHeader from './components/BottomHeader/BottomHeader';
import RankingList from './components/RankingList/RankingList';
import Dashboard from './components/Dashboard/Dashboard';
import RankingFilters from './components/RankingFilters/RankingFilters';
import { useRankingData } from './hooks/useRankingData';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [viewMode, setViewMode] = useState<'normal' | 'goal'>('normal');

  const goalMapping = {
    daily: 20,
    weekly: 130,
    monthly: 600,
  };
  const goal = goalMapping[period];

  const { ranking, availableDates } = useRankingData(period, selectedDate);

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

                  <RankingFilters
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    period={period}
                    onPeriodChange={setPeriod}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    availableDates={availableDates}
                  />

                  <RankingList
                    ranking={ranking}
                    viewMode={viewMode}
                    goal={goal}
                  />
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
