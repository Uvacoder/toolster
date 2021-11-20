import { NotificationSounds } from '@enums/notification-sounds.enum';
import { PomodoroModes } from './+xstate/pomodoro-machine.types';
import { PomodoroSettings } from './pomodoro.types';
import { minutesToMs } from './pomodoro.utils';

export enum PomodoroStorageKeys {
  Settings = 'pomodoroSettings',
  State = 'pomodoroState',
}

export const headingMapWithColor: Record<PomodoroModes, { text: string; color: string }> = {
  [PomodoroModes.Pomodoro]: {
    text: 'Time to focus!',
    color: 'teal',
  },
  [PomodoroModes.ShortBreak]: {
    text: 'Time for a quick break!',
    color: 'blue',
  },
  [PomodoroModes.LongBreak]: {
    text: 'Time for a longer break!',
    color: 'indigo',
  },
};

export const defaultPomodoroSettings: PomodoroSettings = {
  durations: {
    [PomodoroModes.Pomodoro]: minutesToMs(25),
    [PomodoroModes.ShortBreak]: minutesToMs(5),
    [PomodoroModes.LongBreak]: minutesToMs(15),
  },

  longBreakAfter: 4,
  automaticallyStartBreaks: false,
  automaticallyStartPomodoro: false,
  showNotifications: true,
  showWidget: true,

  sounds: {
    playSound: true,
    soundVolume: 50,
    soundName: NotificationSounds.Bell,
  },
};
