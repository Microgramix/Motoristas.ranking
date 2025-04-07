import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

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

export const useRankingData = (
  period: 'daily' | 'weekly' | 'monthly',
  selectedDate: string
) => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

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
          const recordDate = new Date(date);
          const isCurrentWeek = recordDate >= monday;
          const isCurrentMonth = recordDate >= firstDayOfMonth;
          const includeDelivery =
            (period === 'daily' && date === selectedDate) ||
            (period === 'weekly' && isCurrentWeek) ||
            (period === 'monthly' && isCurrentMonth);

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
            if (isCurrentWeek) {
              allDrivers[driver].weeklyDeliveries += currentCount;
            }
            if (!allDrivers[driver].lastUpdate || recordDate > new Date(allDrivers[driver].lastUpdate!)) {
              allDrivers[driver].lastUpdate = date;
            }
            allDrivers[driver].trend[date] = (allDrivers[driver].trend[date] || 0) + currentCount;
            if (isCurrentWeek) {
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
          // Se o driverId estiver na lista, atualiza o id para incluir o prefixo "teamSushi-"
          const isSushi = sushishopNames.has(driverId);
          const newId = isSushi ? `teamSushi-${driverId}` : driverId;
          // finalScore: se for sushi, aplicar correção (0.8); caso contrário, usar os deliveries brutos
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
              .filter((date) => new Date(date) >= monday)
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
