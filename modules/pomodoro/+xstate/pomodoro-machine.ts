import { assign, createMachine } from 'xstate';
import { PomodoroEvents, PomodoroContext, PomodoroModes } from './pomodoro-machine.types';

const ONE_SECOND = 1000;

export const pomodoroMachine = createMachine<PomodoroContext, PomodoroEvents>({
  initial: 'idle',
  states: {
    idle: {
      always: {
        target: 'running',
        cond: (ctx) => {
          if (!ctx.startedInTheSession) {
            return false;
          }

          const shouldStartPomodoro =
            ctx.currentMode === PomodoroModes.Pomodoro && ctx.settings.automaticallyStartPomodoro;

          const shouldStartBreak =
            [PomodoroModes.LongBreak, PomodoroModes.ShortBreak].includes(ctx.currentMode) &&
            ctx.settings.automaticallyStartBreaks;

          return shouldStartBreak || shouldStartPomodoro;
        },
      },
      on: {
        START: {
          target: 'running',
          actions: assign({ startedInTheSession: (_) => true }),
        },
      },
    },
    running: {
      always: [
        {
          actions: ['doShowNotification', 'doPlayNotificationSound'],
          target: 'timerEnded',
          cond: (ctx) => ctx.elapsed >= ctx.settings.durations[ctx.currentMode],
        },
      ],
      invoke: {
        id: 'tickClock',
        src: () => (cb) => {
          const interval = setInterval(() => cb('TICK'), ONE_SECOND);
          return () => clearInterval(interval);
        },
      },
      on: {
        PAUSE: 'paused',
        RESET: 'reset',
        TICK: {
          actions: ['doIncrementClock'],
        },
      },
    },
    timerEnded: {
      always: {
        target: 'idle',
        actions: ['doHandleTimerEnd'],
      },
    },
    paused: {
      on: {
        RESET: 'reset',
        START: 'running',
      },
    },
    reset: {
      always: {
        target: 'idle',
        actions: ['doResetTimer'],
      },
    },
  },
  on: {
    SKIP: {
      target: 'idle',
      actions: assign((ctx) => {
        const { currentMode, shortBreakCount } = ctx;

        let nextMode = PomodoroModes.Pomodoro;

        if (currentMode === PomodoroModes.Pomodoro) {
          nextMode =
            shortBreakCount >= ctx.settings.longBreakAfter ? PomodoroModes.LongBreak : PomodoroModes.ShortBreak;
        }

        let updatedShortBreakCount = shortBreakCount;

        if (currentMode === PomodoroModes.ShortBreak) {
          updatedShortBreakCount += 1;
        }

        if (currentMode === PomodoroModes.LongBreak) {
          updatedShortBreakCount = 0;
        }

        return {
          elapsed: 0,
          currentMode: nextMode,
          previousMode: currentMode,
          shortBreakCount: updatedShortBreakCount,
          startedInTheSession: false,
        };
      }),
    },

    'UPDATE.SETTINGS': {
      target: 'idle',
      actions: [assign((ctx, e) => ({ ...ctx, settings: e.data })), 'doResetTimer'],
    },

    'UPDATE.MODE': {
      target: 'idle',
      actions: [
        assign({
          currentMode: (_, e) => e.data,
        }),
        'doResetTimer',
      ],
    },
  },
});
