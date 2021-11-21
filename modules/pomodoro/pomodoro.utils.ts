import { PomodoroModes } from './+xstate/pomodoro-machine.types';

export const minutesToMs = (minutes: number): number => 1000 * 60 * minutes;

export const msToMinutes = (ms: number): number => ms / (1000 * 60);

export const getNotificationTitle = (mode: PomodoroModes): string => `Your ${mode.valueOf()} Has Ended!`;
