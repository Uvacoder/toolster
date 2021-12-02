import Dexie, { Table } from 'dexie';

type CompletedPomodoro = {
  id?: number;
  createTs: number;
  duration: number;
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
  }
}

export const pomodoroDb = new PomodoroDb();
