'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/game/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { getEducationalContent } from '@/game/data/educationalContent';
import { InfoButton } from './InfoButton';
import { EducationalContent } from '@/game/data/educationalContent';
import {useTranslations} from 'next-intl';
import { translateStoreMessage } from '@/game/utils/translateStoreMessage';

interface EventNotification {
  id: string;
  type: 'betrayal' | 'seizure' | 'rival_interference' | 'passive_income' | 'maintenance' | 'investigation';
  message: string;
  timestamp: number;
  assetName?: string;
}

export function EventNotifications() {
  const t = useTranslations('Game.EventNotifications');
  const tStore = useTranslations('Game.Store.messages');
  const [notifications, setNotifications] = useState<EventNotification[]>([]);

  // Use useCallback to stabilize addNotification reference
  const addNotification = React.useCallback((event: Omit<EventNotification, 'id' | 'timestamp'>) => {
    const notification: EventNotification = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 5)); // Keep max 5 notifications

    // Auto-remove after 10 seconds
    // CRITICAL: Use functional update to avoid stale closure
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 10000);
  }, []);

  // Check for events periodically (every 60 seconds)
  // CRITICAL: Use stable references by accessing store directly in interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Access store functions directly to avoid stale closures
      const {
        checkAssetEvents,
        collectPassiveIncome,
        payMaintenance,
        getPassiveIncome
      } = useGameStore.getState();

      // Check asset events (betrayals, seizures)
      const events = checkAssetEvents();
      events.forEach((event) => {
        addNotification({
          type: event.type as 'betrayal' | 'seizure',
          message: translateStoreMessage(tStore, event.message),
          assetName: event.asset?.name,
        });
      });

      // Collect passive income
      collectPassiveIncome();
      const passiveIncome = getPassiveIncome();
      if (passiveIncome > 0) {
        addNotification({
          type: 'passive_income',
          message: t('passiveIncomeReceived', {
            amount: passiveIncome.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })
          }),
        });
      }

      // Pay maintenance
      const maintenanceResult = payMaintenance();
      if (!maintenanceResult.success && maintenanceResult.message) {
        addNotification({
          type: 'maintenance',
          message: translateStoreMessage(tStore, maintenanceResult.message),
        });
      }
    }, 60000); // 60 seconds

    // CRITICAL: Clean up interval on unmount
    return () => clearInterval(interval);
  }, [addNotification, tStore, t]); // addNotification, tStore, and t are stable

  const getNotificationColor = (type: EventNotification['type']) => {
    switch (type) {
      case 'betrayal':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'seizure':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'rival_interference':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'passive_income':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'maintenance':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'investigation':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getNotificationIcon = (type: EventNotification['type']) => {
    switch (type) {
      case 'betrayal':
        return '⚠️';
      case 'seizure':
        return '🚨';
      case 'rival_interference':
        return '⚔️';
      case 'passive_income':
        return '💰';
      case 'maintenance':
        return '💸';
      case 'investigation':
        return '🔍';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationTitle = (type: EventNotification['type']) => {
    switch (type) {
      case 'betrayal':
        return t('titles.betrayal');
      case 'seizure':
        return t('titles.seizure');
      case 'rival_interference':
        return t('titles.rivalInterference');
      case 'passive_income':
        return t('titles.passiveIncome');
      case 'maintenance':
        return t('titles.maintenance');
      case 'investigation':
        return t('titles.investigation');
      default:
        return t('titles.event');
    }
  };

  const getEducationalContentForEvent = (type: EventNotification['type'], assetName?: string): EducationalContent | null => {
    switch (type) {
      case 'betrayal':
        // Map asset type to specific betrayal content
        if (assetName?.toLowerCase().includes('politic')) {
          return getEducationalContent('betrayal_politician') || null;
        }
        if (assetName?.toLowerCase().includes('juez') || assetName?.toLowerCase().includes('judge')) {
          return getEducationalContent('betrayal_judge') || null;
        }
        if (assetName?.toLowerCase().includes('polic') || assetName?.toLowerCase().includes('police')) {
          return getEducationalContent('betrayal_police') || null;
        }
        return getEducationalContent('betrayal_politician') || null;
      case 'seizure':
        return getEducationalContent('asset_seizure') || null;
      case 'investigation':
        return getEducationalContent('heat_legal') || null;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-96 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {notifications.map((notification) => {
          const educationalContent = getEducationalContentForEvent(notification.type, notification.assetName);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-4 border ${getNotificationColor(notification.type)}`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getNotificationTitle(notification.type)}
                      </Badge>
                      {notification.assetName && (
                        <span className="text-xs opacity-75">{notification.assetName}</span>
                      )}
                      {educationalContent && (
                        <InfoButton content={educationalContent} size="sm" />
                      )}
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    {educationalContent && educationalContent.realCase && (
                      <p className="text-xs opacity-75 mt-2 italic">
                        {t('similarTo', {
                          name: educationalContent.realCase.name,
                          year: educationalContent.realCase.year
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
