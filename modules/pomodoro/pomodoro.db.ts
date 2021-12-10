import Dexie from 'dexie';
import { minutesToMs } from './pomodoro.utils';

type CompletedPomodoro = {
  id?: number;
  createTs: number;
  duration: number;
};

const makePomodoros = (amount: number): CompletedPomodoro[] => {
  const start = +new Date();
  const buffer = () => Math.floor(Math.random() * 1_000_000) + Math.floor(Math.random() * 1_000_000);
  const duration = minutesToMs(25);
  return new Array(amount)
    .fill(0)
    .map((_, idx) => ({
      duration,
      createTs: start - duration * idx - buffer(),
    }))
    .reverse();
};

export class PomodoroDb {
  pomodoros!: Dexie.Table<CompletedPomodoro, number>;

  private db!: Dexie;

  constructor() {
    this.db = new Dexie('pomodorosDb');

    this.db.version(1).stores({
      completePomodoros: '++id, createTs, duration',
    });

    this.pomodoros = this.db.table('completePomodoros');

    this.db.on('populate', () => {
      this.pomodoros.bulkAdd(makePomodoros(36));
    });
  }
}

export const pomodoroDb = new PomodoroDb();
