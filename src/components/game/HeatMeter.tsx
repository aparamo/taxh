'use client';

import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/game/store';
import { getHeatColor } from '@/game/logic/heat';
import { motion } from 'motion/react';
import { InfoButton } from './InfoButton';
import { getHeatContent } from '@/game/data/educationalContent';

export function HeatMeter() {
  const heat = useGameStore((state) => state.heat);

  return (
    <div className="flex items-center gap-4">
      <motion.div 
        className="text-right"
        key={heat.total}
        initial={{ scale: 1.2, color: '#fff' }}
        animate={{ scale: 1, color: getHeatColor(heat.total).replace('text-', '#') }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-sm text-gray-400">Heat Total</div>
        <div className={`text-2xl font-bold ${getHeatColor(heat.total)}`}>
          {heat.total.toFixed(1)}%
        </div>
      </motion.div>

      <div className="space-y-2 w-48">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1">
              <span className="text-red-400">Legal</span>
              {(() => {
                const heatContent = getHeatContent('legal');
                return heatContent ? (
                  <InfoButton content={heatContent} size="sm" />
                ) : null;
              })()}
            </div>
            <span>{heat.legal.toFixed(1)}%</span>
          </div>
          <Progress value={heat.legal} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">Medios periodísticos</span>
              {(() => {
                const heatContent = getHeatContent('media');
                return heatContent ? (
                  <InfoButton content={heatContent} size="sm" />
                ) : null;
              })()}
            </div>
            <span>{heat.media.toFixed(1)}%</span>
          </div>
          <Progress value={heat.media} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1">
              <span className="text-blue-400">Político</span>
              {(() => {
                const heatContent = getHeatContent('political');
                return heatContent ? (
                  <InfoButton content={heatContent} size="sm" />
                ) : null;
              })()}
            </div>
            <span>{heat.political.toFixed(1)}%</span>
          </div>
          <Progress value={heat.political} className="h-2" />
        </div>
      </div>
    </div>
  );
}
