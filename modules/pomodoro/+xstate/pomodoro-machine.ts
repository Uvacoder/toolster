/* eslint-disable @typescript-eslint/no-unused-vars */
import { assign, createMachine } from 'xstate';
import { PomodoroEvents, PomodoroContext, PomodoroModes } from './pomodoro-machine.types';

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
      entry: assign({
        timerStartTs: (ctx) => (ctx.hasBeenPaused ? ctx.timerStartTs : +new Date()),
        hasBeenPaused: (_) => false,
      }),
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
          const interval = setInterval(() => cb('TICK'), 500);
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
      entry: assign({
        pauseTs: (_) => +new Date(),
        hasBeenPaused: (_) => true,
      }),
      exit: assign((ctx, e) => {
        if (e.type === 'START') {
          const elpasedInPause = +new Date() - ctx.pauseTs;
          return {
            timerStartTs: (ctx?.timerStartTs || +new Date()) + elpasedInPause,
          };
        }
        return ctx;
      }),
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
      actions: [
        assign((ctx) => {
          const { currentMode, shortBreakCount } = ctx;

          if (currentMode !== PomodoroModes.Pomodoro) {
            return {
              currentMode: PomodoroModes.Pomodoro,
              previousMode: currentMode,
              shortBreakCount: currentMode === PomodoroModes.ShortBreak ? shortBreakCount + 1 : shortBreakCount,
            };
          }

          return {
            currentMode:
              shortBreakCount >= ctx.settings.longBreakAfter ? PomodoroModes.LongBreak : PomodoroModes.ShortBreak,
            previousMode: currentMode,
          };
        }),
        'doResetTimer',
      ],
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
