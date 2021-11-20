import { useLocalStorageObject } from '@hooks/use-local-storage-object';
import { useNotificationSound } from '@hooks/use-notification-sound';
import { useNotifications } from '@mantine/notifications';
import { useActor, useInterpret } from '@xstate/react';
import { createContext, FC, useContext } from 'react';
import type { Interpreter } from 'xstate';
import { defaultPomodoroSettings, PomodoroStorageKeys } from '../pomodoro.const';
import { pomodoroMachine } from './pomodoro-machine';
import { PomodoroEvents, PomodoroContext, PomodoroModes } from './pomodoro-machine.types';
import {
  doHandleTimerEnd,
  doHandlePomodoroEnd,
  doHandleBreakEnd,
  doIncrementClock,
  doResetTimer,
  isPomodoroOver,
  isBreakOver,
} from './pomodoro-sideffects';

type PomodoroContextType = Interpreter<PomodoroContext, any, PomodoroEvents>;

export const PomodoroStateContext = createContext<PomodoroContextType | null>(null);

export const PomodoroStateProvider: FC = ({ children }) => {
  const [settings] = useLocalStorageObject({
    key: PomodoroStorageKeys.Settings,
    defaultValue: defaultPomodoroSettings,
  });

  const notifications = useNotifications();
  const playNotificationSound = useNotificationSound();

  const service = useInterpret(pomodoroMachine, {
    context: {
      shortBreakCount: 0,
      elapsed: 0,
      currentMode: PomodoroModes.Pomodoro,
      finishedTimers: [],
      settings,
    },
    devTools: true,
    actions: {
      doHandlePomodoroEnd,
      doHandleBreakEnd,
      doIncrementClock,
      doResetTimer,
      doHandleTimerEnd,
      doShowNotification: (ctx) => {
        if (!ctx.settings.showNotifications) {
          return;
        }

        notifications.showNotification({
          title: `${ctx?.previousMode} has ended`,
          message: 'Time to focus',
        });
      },
      doPlayNotificationSound: (ctx) => {
        if (!ctx.settings.sounds.playSound) {
          return;
        }
        return playNotificationSound(ctx.settings.sounds.soundName, ctx.settings.sounds.soundVolume / 100);
      },
    },
    guards: {
      isPomodoroOver,
      isBreakOver,
    },
  });

  return <PomodoroStateContext.Provider value={service}>{children}</PomodoroStateContext.Provider>;
};

export const usePomodoroContext = (): PomodoroContextType => useContext(PomodoroStateContext)!;

export const usePomodorActor = () => {
  const service = usePomodoroContext();
  return useActor(service);
};
