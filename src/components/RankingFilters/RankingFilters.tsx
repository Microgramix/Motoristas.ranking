// components/RankingFilters/RankingFilters.tsx
import React from 'react';
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

const RankingFilters: React.FC<Props> = ({
  selectedDate,
  onDateChange,
  period,
  onPeriodChange,
  viewMode,
  onViewModeChange,
  availableDates
}) => {
  // Retorna intervalo da semana baseado na selectedDate
  const getWeekRange = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = addDays(date, diff);
    const sunday = addDays(monday, 6);
    return `${format(monday, 'dd/MM/yyyy')} - ${format(sunday, 'dd/MM/yyyy')}`;
  };

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.row}>
        <label>📅 Período:</label>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as any)}
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

      {period === 'weekly' && selectedDate && (
        <div className={styles.row}>
          <span className={styles.weekRange}>
            📆 Semana: {getWeekRange(selectedDate)}
          </span>
        </div>
      )}

      <div className={styles.row}>
        <label>Visualização:</label>
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as any)}
        >
          <option value="normal">Ranking</option>
          <option value="goal">Meta ({period})</option>
        </select>
      </div>
    </div>
  );
};

export default RankingFilters;
