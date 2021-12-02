import { useLocalStorageObject } from '@hooks/use-local-storage-object';
import { useNotificationSound } from '@hooks/use-notification-sound';
import { useNotifications } from '@mantine/notifications';
import { useActor, useInterpret } from '@xstate/react';
import { createContext, FC, useContext, useEffect } from 'react';
import type { Interpreter } from 'xstate';
import { PomodoroNotification } from '../components/PomodoroNotification';
import { defaultPomodoroSettings, headingMapWithColor, PomodoroStorageKeys } from '../pomodoro.const';
import { getNotificationTitle } from '../pomodoro.utils';
import { pomodoroMachine } from './pomodoro-machine';
import { PomodoroEvents, PomodoroContext, PomodoroModes } from './pomodoro-machine.types';
import { doHandleTimerEnd, doIncrementClock, doResetTimer, isPomodoroOver, isBreakOver } from './pomodoro-sideffects';

type PomodoroContextType = Interpreter<PomodoroContext, never, PomodoroEvents>;

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
      pauseTs: 0,
      hasBeenPaused: false,
      currentMode: PomodoroModes.Pomodoro,
      finishedTimers: [],
      settings,
    },
    devTools: true,
    actions: {
      doIncrementClock,
      doResetTimer,
      doHandleTimerEnd,
      doShowNotification: (ctx) => {
        if (!ctx.settings.showNotifications) {
          return;
        }

        const mode = ctx.previousMode || PomodoroModes.Pomodoro;

        const notificationColor = headingMapWithColor[mode].color;
        const notificationTitle = getNotificationTitle(mode);

        const isABreak = mode !== PomodoroModes.Pomodoro;
        const isPomodoro = !isABreak;

        const shouldShowNotificationWithCta =
          (isABreak && !ctx.settings.automaticallyStartPomodoro) ||
          (isPomodoro && !ctx.settings.automaticallyStartBreaks);

        if (shouldShowNotificationWithCta) {
          const notificationId = notifications.showNotification({
            title: notificationTitle,
            color: notificationColor,
            autoClose: false,
            message: (
              <PomodoroNotification
                mode={ctx.currentMode}
                onStart={() => {
                  service.send('START');
                  notifications.hideNotification(notificationId);
                }}
                color={notificationColor}
              />
            ),
          });
          return;
        }
        notifications.showNotification({
          color: notificationColor,
          title: notificationTitle,
          message: headingMapWithColor[ctx.currentMode].text,
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePomodoroContext = (): PomodoroContextType => useContext(PomodoroStateContext)!;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePomodorActor = () => {
  const service = usePomodoroContext();
  return useActor(service);
};
