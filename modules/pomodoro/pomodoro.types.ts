import { NotificationSounds } from '@enums/notification-sounds.enum';
import { ModeLengthMap, PomodoroModes } from './+xstate/pomodoro-machine.types';

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

export type PomodoroColorTextConfig = Record<
  PomodoroModes,
  {
    color: string;
    ctaMessage: string;
    notificationTitle: string;
  }
>;

export type PomodoroSettingsTemplate = {
  name: string;
  config: PomodoroSettings;
  canEdit: boolean;
  canDelete: boolean;
};

export type ComplexTime = {
  hours: number;
  minutes: number;
  seconds: number;
};
