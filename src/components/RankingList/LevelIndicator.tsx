import React from 'react';

interface LevelIndicatorProps {
  deliveries: number;
  xpPerDelivery?: number; // XP ganho por entrega (padrão: 10)
  baseXP?: number;        // XP necessário para passar do nível 1 para o 2 (padrão: 100)
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  deliveries,
  xpPerDelivery = 10,
  baseXP = 100,
}) => {
  // Calcula o XP total acumulado a partir do número de entregas
  const totalXP = deliveries * xpPerDelivery;

  let level = 1;
  let xpForNextLevel = baseXP; // XP necessário para passar do nível atual para o próximo
  let cumulativeXP = xpForNextLevel; // XP total necessário para alcançar o próximo nível

  // Enquanto o XP total for suficiente para alcançar o próximo nível,
  // incrementa o nível e dobra o XP necessário para o próximo
  while (totalXP >= cumulativeXP) {
    level++;
    xpForNextLevel *= 2;
    cumulativeXP += xpForNextLevel;
  }

  return (
    <div>
      <span>Lv. {level}</span>
    </div>
  );
};

export default LevelIndicator;
