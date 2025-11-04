import { Heat } from '../types';

export function calculateTotalHeat(heat: Omit<Heat, 'total'>): number {
  return (heat.legal + heat.media + heat.political) / 3;
}

export function addHeat(
  currentHeat: Heat,
  heatToAdd: { legal: number; media: number; political: number }
): Heat {
  const newLegal = Math.min(100, currentHeat.legal + heatToAdd.legal);
  const newMedia = Math.min(100, currentHeat.media + heatToAdd.media);
  const newPolitical = Math.min(100, currentHeat.political + heatToAdd.political);
  const newTotal = calculateTotalHeat({
    legal: newLegal,
    media: newMedia,
    political: newPolitical,
  });
  
  return {
    legal: newLegal,
    media: newMedia,
    political: newPolitical,
    total: newTotal,
  };
}

export function reduceHeat(
  currentHeat: Heat,
  reduction: number,
  type?: 'legal' | 'media' | 'political' | 'all'
): Heat {
  if (type === 'all' || !type) {
    // Reduce all factors proportionally
    const newLegal = Math.max(0, currentHeat.legal - reduction);
    const newMedia = Math.max(0, currentHeat.media - reduction);
    const newPolitical = Math.max(0, currentHeat.political - reduction);
    const newTotal = calculateTotalHeat({
      legal: newLegal,
      media: newMedia,
      political: newPolitical,
    });
    
    return {
      legal: newLegal,
      media: newMedia,
      political: newPolitical,
      total: newTotal,
    };
  } else {
    // Reduce specific factor
    const updates = { ...currentHeat };
    updates[type] = Math.max(0, currentHeat[type] - reduction);
    updates.total = calculateTotalHeat({
      legal: updates.legal,
      media: updates.media,
      political: updates.political,
    });
    
    return updates;
  }
}

export function calculateHeatDecay(currentHeat: Heat): Heat {
  // Heat naturally decreases by 1% per turn (if no activity)
  return reduceHeat(currentHeat, 1, 'all');
}

export function isGameOver(heat: Heat): boolean {
  return heat.total >= 100;
}

export function getHeatColor(totalHeat: number): string {
  if (totalHeat < 30) return 'text-green-500';
  if (totalHeat < 50) return 'text-yellow-500';
  if (totalHeat < 70) return 'text-orange-500';
  return 'text-red-500';
}
