import React from 'react';

interface LevelIndicatorProps {
  deliveries: number;
  xpPerDelivery?: number; // XP ganho por entrega (padrão: 10)
  baseXP?: number;        // XP necessário para passar do nível 1 para o 2 (padrão: 100)
}

// Função auxiliar para calcular o nível com base nas entregas
const getLevel = (deliveries: number, xpPerDelivery: number, baseXP: number): number => {
  const totalXP = deliveries * xpPerDelivery;
  let level = 1;
  let xpForNextLevel = baseXP;
  let cumulativeXP = xpForNextLevel;

  while (totalXP >= cumulativeXP) {
    level++;
    xpForNextLevel *= 2;
    cumulativeXP += xpForNextLevel;
  }

  return level;
};

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  deliveries,
  xpPerDelivery = 10,
  baseXP = 100,
}) => {
  const level = getLevel(deliveries, xpPerDelivery, baseXP);
  return (
    <div>
      <span>Lv. {level}</span>
    </div>
  );
};

export default LevelIndicator;
