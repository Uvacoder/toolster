import { PomodoroModes } from './+xstate/pomodoro-machine.types';

export const minutesToMs = (minutes: number): number => 1000 * 60 * minutes;

export const msToMinutes = (ms: number): number => ms / (1000 * 60);

export const getNotificationTitle = (mode: PomodoroModes): string => `Your ${mode.valueOf()} Has Ended!`;

export const getDateBounds = (date: Date = new Date()): [number, number] => {
  const lowerBound = +new Date(date.toDateString());
  const upperBound = lowerBound + 60 * 1000 * 60 * 24 - 1;

  return [lowerBound, upperBound];
};
