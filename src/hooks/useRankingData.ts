import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import { addDays } from 'date-fns';

export interface RankingItem {
  id: string;
  name: string;
  deliveries: number;
  weeklyDeliveries: number;
  lastUpdate?: string;
  trend: number[];
  weeklyTrend: number[];
  trendDates: string[];
  finalScore: number;
}

// Função para normalizar uma data (ignora as horas)
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const useRankingData = (
  period: 'daily' | 'weekly' | 'monthly',
  selectedDate: string
) => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Calcula a segunda-feira da semana de uma data
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
      const mondayToday = normalizeDate(getMonday(today));
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const todayStr = today.toISOString().substring(0, 10);
      dates.add(todayStr);

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

      const allKnownDrivers = new Set<string>();

      teamsSnapshot.forEach((teamDoc) => {
        const teamData = teamDoc.data();
        Object.entries(teamData).forEach(([date, drivers]) => {
          dates.add(date);
          Object.keys(drivers as Record<string, number>).forEach((driver) => {
            allKnownDrivers.add(driver);
          });
          // Normaliza a data para ignorar horas
          const recordDate = normalizeDate(new Date(date));

          let includeDelivery = false;
          if (period === 'daily') {
            includeDelivery = date === selectedDate;
          } else if (period === 'weekly') {
            // Para semanal, utiliza a data selecionada para definir o intervalo (segunda a domingo)
            const selectedMonday = normalizeDate(getMonday(new Date(selectedDate)));
            const selectedSunday = addDays(selectedMonday, 6);
            includeDelivery = recordDate >= selectedMonday && recordDate <= selectedSunday;
          } else if (period === 'monthly') {
            includeDelivery = recordDate >= firstDayOfMonth;
          }

          if (!includeDelivery) return;

          Object.entries(drivers as Record<string, number>).forEach(([driver, count]) => {
            if (!allDrivers[driver]) {
              allDrivers[driver] = {
                deliveries: 0,
                weeklyDeliveries: 0,
                lastUpdate: undefined,
                trend: {},
                weeklyTrend: {},
              };
            }
            const currentCount = Number(count);
            allDrivers[driver].deliveries += currentCount;
            if (period === 'weekly') {
              allDrivers[driver].weeklyDeliveries += currentCount;
            }
            if (!allDrivers[driver].lastUpdate || recordDate > new Date(allDrivers[driver].lastUpdate!)) {
              allDrivers[driver].lastUpdate = date;
            }
            allDrivers[driver].trend[date] = (allDrivers[driver].trend[date] || 0) + currentCount;
            if (period === 'weekly') {
              allDrivers[driver].weeklyTrend[date] = (allDrivers[driver].weeklyTrend[date] || 0) + currentCount;
            }
          });
        });
      });

      if (period === 'daily') {
        allKnownDrivers.forEach((driver) => {
          if (!allDrivers[driver]) {
            allDrivers[driver] = {
              deliveries: 0,
              weeklyDeliveries: 0,
              lastUpdate: undefined,
              trend: {},
              weeklyTrend: {},
            };
          }
        });
      }

      setAvailableDates(Array.from(dates).sort().reverse());
      const sortedTrendDates = Array.from(dates).sort();

      // Lista dos nomes conhecidos do Sushishop
      const sushishopNames = new Set([
        "Rui Varela",
        "Farlom Miguel",
        "Fred",
        "Ricardo A.",
        "Figarella",
        "Wagner"
      ]);

      const sortedRanking = Object.entries(allDrivers)
        .map(([driverId, { deliveries, weeklyDeliveries, lastUpdate, trend, weeklyTrend }]) => {
          const isSushi = sushishopNames.has(driverId);
          const newId = isSushi ? `teamSushi-${driverId}` : driverId;
          const finalScore = isSushi ? Math.round(deliveries * 0.8) : deliveries;
          return {
            id: newId,
            name: driverId,
            deliveries,
            weeklyDeliveries,
            lastUpdate,
            finalScore,
            trend: sortedTrendDates.map((date) => trend[date] || 0),
            weeklyTrend: sortedTrendDates
              .filter((date) => {
                if (period === 'weekly') {
                  const selectedMonday = normalizeDate(getMonday(new Date(selectedDate)));
                  const selectedSunday = addDays(selectedMonday, 6);
                  return normalizeDate(new Date(date)) >= selectedMonday && normalizeDate(new Date(date)) <= selectedSunday;
                }
                return true;
              })
              .map((date) => weeklyTrend[date] || 0),
            trendDates: sortedTrendDates,
          };
        })
        .sort((a, b) => b.finalScore - a.finalScore);

      setRanking(sortedRanking);
    };

    fetchData();
  }, [selectedDate, period]);

  return { ranking, availableDates };
};
