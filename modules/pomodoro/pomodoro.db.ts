import Dexie, { Table } from 'dexie';

export const pomodoroDb = new Dexie('completePomodoros');

pomodoroDb.version(1).stores({
  pomodoros: '++id, endTs, duration, timerType',
});
