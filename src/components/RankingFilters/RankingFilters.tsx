// components/RankingFilters/RankingFilters.tsx
import React, { useMemo } from 'react';
import styles from './RankingFilters.module.scss';
import { format, addDays } from 'date-fns';

interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
  viewMode: 'normal' | 'goal';
  onViewModeChange: (mode: 'normal' | 'goal') => void;
  availableDates: string[];
}

// Função auxiliar para obter a segunda-feira de uma determinada data
const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
};

const RankingFilters: React.FC<Props> = ({
  selectedDate,
  onDateChange,
  period,
  onPeriodChange,
  viewMode,
  onViewModeChange,
  availableDates
}) => {
  // Para o modo semanal, agrupar as datas disponíveis por semana (segunda-feira)
  const availableWeeks = useMemo(() => {
    const weeksMap = new Map<string, Date>();
    availableDates.forEach(dateStr => {
      const date = new Date(dateStr);
      const monday = getMonday(date);
      const mondayStr = monday.toISOString().substring(0, 10);
      weeksMap.set(mondayStr, monday);
    });
    // Ordena as semanas de forma decrescente (mais recente primeiro)
    const weeks = Array.from(weeksMap.values()).sort((a, b) => b.getTime() - a.getTime());
    return weeks.map(monday => ({
      monday: monday.toISOString().substring(0, 10),
      range: `${format(monday, 'dd/MM/yyyy')} - ${format(addDays(monday, 6), 'dd/MM/yyyy')}`
    }));
  }, [availableDates]);

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.row}>
        <label>📅 Período:</label>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as 'daily' | 'weekly' | 'monthly')}
        >
          <option value="daily">Diário</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
        </select>
      </div>

      {period === 'daily' && (
        <div className={styles.row}>
          <label>Data:</label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('pt-BR')}
              </option>
            ))}
          </select>
        </div>
      )}

      {period === 'weekly' && (
        <div className={styles.row}>
          <label>Semana:</label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          >
            {availableWeeks.map((week) => (
              <option key={week.monday} value={week.monday}>
                {week.range}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.row}>
        <label>Visualização:</label>
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as 'normal' | 'goal')}
        >
          <option value="normal">Ranking</option>
          <option value="goal">Meta ({period})</option>
        </select>
      </div>
    </div>
  );
};

export default RankingFilters;
