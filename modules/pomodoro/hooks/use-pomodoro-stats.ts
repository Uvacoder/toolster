import { useLiveQuery } from '@hooks/use-live-query';
import { useMemo } from 'react';
import { start } from 'repl';
import { pomodoroDb } from '../pomodoro.db';
import { ComplexTime } from '../pomodoro.types';
import { getDateBounds, msToComplexTime } from '../pomodoro.utils';

type PomodoroStat = {
  time: ComplexTime;
  pomodoroCount: number;
  change?: number;
};

type PomodoroStats = {
  today: PomodoroStat;
  allTime: PomodoroStat;
};

const [todayStart, todayEnd] = getDateBounds();

export const usePomodoroStats = (): PomodoroStats => {
  const allPomodoros = useLiveQuery(() => pomodoroDb.pomodoros.toArray(), []);

  const todaysStats: PomodoroStat = useMemo(() => {
    const todaysPomodors = allPomodoros?.filter(({ createTs }) => createTs >= todayStart && createTs < todayEnd) || [];

    const timeSpent = todaysPomodors.reduce((acc, curr) => acc + curr.duration, 0);

    return { time: msToComplexTime(timeSpent), pomodoroCount: todaysPomodors.length };
  }, [allPomodoros]);

  const allTime: PomodoroStat = useMemo(() => {
    const timeSpent = (allPomodoros || []).reduce((acc, curr) => acc + curr.duration, 0);

    return { time: msToComplexTime(timeSpent), pomodoroCount: allPomodoros?.length || 0 };
  }, [allPomodoros]);

  return {
    today: todaysStats,
    allTime,
  };
};
