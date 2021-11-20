import { NotificationSounds } from '@enums/notification-sounds.enum';
import { ModeLengthMap } from './+xstate/pomodoro-machine.types';

export type PomodoroSettings = {
  durations: ModeLengthMap;
  longBreakAfter: number;

  automaticallyStartPomodoro: boolean;
  automaticallyStartBreaks: boolean;
  showNotifications: boolean;
  showWidget: boolean;

  sounds: {
    playSound: boolean;
    soundVolume: number;
    soundName: NotificationSounds;
  };
};
