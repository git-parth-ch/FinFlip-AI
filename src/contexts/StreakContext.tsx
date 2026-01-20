import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { format, subDays } from 'date-fns';

type ActivityType = 'learning' | 'transaction';

type StreakCelebration = {
  title: string;
  message: string;
  xpEarned?: number;
  badge?: string;
} | null;

interface StreakState {
  completedDays: string[]; // yyyy-MM-dd
  bonusXp: number;
  awardedMilestones: number[]; // e.g. 7, 14, 21...
}

interface StreakContextType {
  streakCount: number;
  hasCompletedToday: boolean;
  week: { key: string; label: string; completed: boolean }[];
  bonusXp: number;
  celebration: StreakCelebration;
  clearCelebration: () => void;
  markDailyActivity: (type: ActivityType) => void;
}

const STORAGE_KEY = 'fined_streak_state_v1';

const StreakContext = createContext<StreakContextType | undefined>(undefined);

function safeParseState(raw: string | null): StreakState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    if (!Array.isArray(parsed.completedDays)) return null;
    return {
      completedDays: parsed.completedDays.filter((d) => typeof d === 'string'),
      bonusXp: typeof parsed.bonusXp === 'number' ? parsed.bonusXp : 0,
      awardedMilestones: Array.isArray(parsed.awardedMilestones)
        ? parsed.awardedMilestones.filter((n) => typeof n === 'number')
        : [],
    };
  } catch {
    return null;
  }
}

function dateKey(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function computeConsecutiveStreak(completed: Set<string>, includeTodayIfMissing: boolean) {
  const today = new Date();
  const todayKey = dateKey(today);
  const start = completed.has(todayKey)
    ? today
    : includeTodayIfMissing
      ? subDays(today, 1)
      : today;

  let count = 0;
  for (let i = 0; i < 366; i++) {
    const key = dateKey(subDays(start, i));
    if (!completed.has(key)) break;
    count++;
  }
  return count;
}

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StreakState>(() => {
    if (typeof window === 'undefined') {
      return { completedDays: [], bonusXp: 0, awardedMilestones: [] };
    }
    return (
      safeParseState(window.localStorage.getItem(STORAGE_KEY)) ?? {
        completedDays: [],
        bonusXp: 0,
        awardedMilestones: [],
      }
    );
  });

  const [celebration, setCelebration] = useState<StreakCelebration>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completedSet = useMemo(() => new Set(state.completedDays), [state.completedDays]);
  const todayKey = useMemo(() => dateKey(new Date()), []);
  const hasCompletedToday = completedSet.has(todayKey);

  const streakCount = useMemo(() => {
    // If today isn't completed yet, show streak up to yesterday (more motivating UX)
    return computeConsecutiveStreak(completedSet, true);
  }, [completedSet]);

  const week = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, idx) => {
      const d = subDays(today, 6 - idx);
      const key = dateKey(d);
      return {
        key,
        label: format(d, 'EEE').slice(0, 1),
        completed: completedSet.has(key),
      };
    });
    return days;
  }, [completedSet]);

  const markDailyActivity = () => {
    const key = dateKey(new Date());

    setState((prev) => {
      if (prev.completedDays.includes(key)) return prev;

      const nextCompletedDays = [...prev.completedDays, key];
      const nextSet = new Set(nextCompletedDays);
      const nextStreak = computeConsecutiveStreak(nextSet, false);

      let nextBonusXp = prev.bonusXp;
      let nextAwarded = prev.awardedMilestones;
      let xpEarned: number | undefined;

      if (nextStreak > 0 && nextStreak % 7 === 0 && !prev.awardedMilestones.includes(nextStreak)) {
        nextBonusXp = prev.bonusXp + 50;
        nextAwarded = [...prev.awardedMilestones, nextStreak];
        xpEarned = 50;
      }

      if ([3, 7, 21].includes(nextStreak)) {
        const milestoneMessage =
          nextStreak === 3
            ? "3 Days! You're building the habit."
            : nextStreak === 7
              ? "7 Days! You're on fire — keep it going."
              : "21 Days! You’ve officially made financial tracking a habit!";

        setCelebration({
          title: `${nextStreak} Day Streak!`,
          message: milestoneMessage,
          xpEarned,
          badge: '🔥',
        });
      }

      return {
        completedDays: nextCompletedDays,
        bonusXp: nextBonusXp,
        awardedMilestones: nextAwarded,
      };
    });
  };

  const value: StreakContextType = {
    streakCount,
    hasCompletedToday,
    week,
    bonusXp: state.bonusXp,
    celebration,
    clearCelebration: () => setCelebration(null),
    markDailyActivity,
  };

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within a StreakProvider');
  return ctx;
}
