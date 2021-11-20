import { State } from 'xstate';
import { PomodoroSettings } from '../pomodoro.types';

export enum PomodoroModes {
  Pomodoro = 'Pomodoro',
  ShortBreak = 'Short Break',
  LongBreak = 'Long Break',
}

export type FinishedTimer = {
  endTs: number;
  duration: number;
  timerType: PomodoroModes;
};
export type ModeLengthMap = Record<PomodoroModes, number>;

export type PomodoroContext = {
  shortBreakCount: number;
  elapsed: number;
  currentMode: PomodoroModes;
  previousMode?: PomodoroModes;
  finishedTimers: FinishedTimer[];
  startedInTheSession?: boolean;

  settings: PomodoroSettings;
};

export type PomodoroEvents =
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SKIP' }
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'UPDATE.MODE'; data: PomodoroModes }
  | { type: 'UPDATE.SETTINGS'; data: PomodoroSettings };

export type PomodoroState = State<PomodoroContext, PomodoroEvents>;

export type PomodoroControlState = {
  currentMode: PomodoroModes;
  canPause: boolean;
  canStart: boolean;
};

export type PomodoroProgress = {
  completionPct: number;
  minutesLeft: number;
  secondsLeft: number;
};
