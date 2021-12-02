import { assign } from 'xstate';
import { pomodoroDb } from '../pomodoro.db';
import { PomodoroEvents, PomodoroContext, PomodoroModes } from './pomodoro-machine.types';

const isShortBreakOver = (ctx: PomodoroContext): boolean =>
  ctx.currentMode === PomodoroModes.ShortBreak && ctx.elapsed >= ctx.settings.durations[PomodoroModes.ShortBreak];

const isLongBreakOver = (ctx: PomodoroContext): boolean =>
  ctx.currentMode === PomodoroModes.LongBreak && ctx.elapsed >= ctx.settings.durations[PomodoroModes.LongBreak];

export const isPomodoroOver = (ctx: PomodoroContext): boolean =>
  ctx.currentMode === PomodoroModes.Pomodoro && ctx.elapsed >= ctx.settings.durations[ctx.currentMode];

export const isBreakOver = (ctx: PomodoroContext): boolean => isShortBreakOver(ctx) || isLongBreakOver(ctx);

export const doHandleTimerEnd = assign<PomodoroContext, PomodoroEvents>((ctx) => {
  if (ctx.currentMode !== PomodoroModes.Pomodoro) {
    return {
      currentMode: PomodoroModes.Pomodoro,
      shortBreakCount: ctx.currentMode === PomodoroModes.ShortBreak ? ctx.shortBreakCount + 1 : ctx.shortBreakCount,
      elapsed: 0,
      previousMode: ctx.currentMode,
    };
  }

  pomodoroDb.pomodoros.put({ createTs: +new Date(), duration: ctx.settings.durations[PomodoroModes.Pomodoro] });

  return {
    elapsed: 0,
    previousMode: ctx.currentMode,
    currentMode:
      ctx.shortBreakCount >= ctx.settings.longBreakAfter ? PomodoroModes.LongBreak : PomodoroModes.ShortBreak,
  };
});

export const doIncrementClock = assign<PomodoroContext, PomodoroEvents>({
  elapsed: (ctx) => {
    const diff = +new Date() - (ctx?.timerStartTs || 0);
    return diff - (diff % 1000);
  },
});

export const doResetTimer = assign<PomodoroContext, PomodoroEvents>({
  elapsed: 0,
  startedInTheSession: false,
  hasBeenPaused: false,
  pauseTs: 0,
  timerStartTs: undefined,
});
