import { PomodoroModes } from './+xstate/pomodoro-machine.types';
import { ComplexTime } from './pomodoro.types';

export const padNumber = (n: number): string => {
  if (n >= 10) {
    return n.toString();
  }
  return `0${n}`;
};

export const minutesToMs = (minutes: number): number => 1000 * 60 * minutes;

export const msToMinutes = (ms: number): number => ms / (1000 * 60);

export const msToComplexTime = (ms: number): ComplexTime => {
  const ONE_HOUR = minutesToMs(60);

  const hours = Math.floor(ms / ONE_HOUR);

  const minutes = Math.floor(msToMinutes(ms - ONE_HOUR * hours));
  const seconds = Math.floor((ms - minutesToMs(minutes) - ONE_HOUR * hours) / 1000);

  return {
    hours,
    minutes,
    seconds,
  };
};

export const complexTimeToString = (time: ComplexTime, showSeconds = false): string => {
  const { hours, minutes, seconds } = time;
  let result = '';

  if (hours > 0) {
    result += `${padNumber(hours)}h `;
  }

  if (minutes > 0) {
    result += `${padNumber(minutes)}m `;
  }

  if (showSeconds && seconds > 0) {
    result += `${padNumber(seconds)}s`;
  }

  return result;
};

export const getNotificationTitle = (mode: PomodoroModes): string => `Your ${mode.valueOf()} Has Ended!`;

export const getDateBounds = (date: Date = new Date()): [number, number] => {
  const lowerBound = +new Date(date.toDateString());
  const upperBound = lowerBound + 60 * 1000 * 60 * 24 - 1;

  return [lowerBound, upperBound];
};
