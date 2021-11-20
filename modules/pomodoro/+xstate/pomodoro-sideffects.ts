import { assign } from 'xstate';
import { FinishedTimer, PomodoroEvents, PomodoroContext, PomodoroModes } from './pomodoro-machine.types';

const ONE_SECOND = 1000;

const isShortBreakOver = (ctx: PomodoroContext): boolean =>
  ctx.currentMode === PomodoroModes.ShortBreak && ctx.elapsed >= ctx.settings.durations[PomodoroModes.ShortBreak];

const isLongBreakOver = (ctx: PomodoroContext): boolean =>
  ctx.currentMode === PomodoroModes.LongBreak && ctx.elapsed >= ctx.settings.durations[PomodoroModes.LongBreak];

const generateFinishedTimer = (ctx: PomodoroContext): FinishedTimer => ({
  endTs: +new Date(),
  duration: ctx.elapsed,
  timerType: ctx.currentMode,
});

export const isPomodoroOver = (ctx: PomodoroContext): boolean =>
  ctx.currentMode === PomodoroModes.Pomodoro && ctx.elapsed >= ctx.settings.durations[ctx.currentMode];

export const isBreakOver = (ctx: PomodoroContext): boolean => isShortBreakOver(ctx) || isLongBreakOver(ctx);

export const doHandlePomodoroEnd = assign<PomodoroContext, PomodoroEvents>({
  elapsed: 0,
  currentMode: (ctx) =>
    ctx.shortBreakCount >= ctx.settings.longBreakAfter ? PomodoroModes.LongBreak : PomodoroModes.ShortBreak,
  finishedTimers: (ctx) => [generateFinishedTimer(ctx), ...ctx.finishedTimers],
});

export const doHandleBreakEnd = assign<PomodoroContext, PomodoroEvents>({
  elapsed: 0,
  currentMode: PomodoroModes.Pomodoro,
  shortBreakCount: (ctx) =>
    ctx.currentMode === PomodoroModes.ShortBreak ? ctx.shortBreakCount + 1 : ctx.shortBreakCount,
  finishedTimers: (ctx) => [generateFinishedTimer(ctx), ...ctx.finishedTimers],
});

export const doHandleTimerEnd = assign<PomodoroContext, PomodoroEvents>((ctx) => {
  if (ctx.currentMode !== PomodoroModes.Pomodoro) {
    return {
      currentMode: PomodoroModes.Pomodoro,
      shortBreakCount: ctx.currentMode === PomodoroModes.ShortBreak ? ctx.shortBreakCount + 1 : ctx.shortBreakCount,
      elapsed: 0,
      previousMode: ctx.currentMode,
    };
  }
  return {
    elapsed: 0,
    previousMode: ctx.currentMode,
    currentMode:
      ctx.shortBreakCount >= ctx.settings.longBreakAfter ? PomodoroModes.LongBreak : PomodoroModes.ShortBreak,
  };
});

export const doIncrementClock = assign<PomodoroContext, PomodoroEvents>({
  elapsed: (ctx) => ctx.elapsed + ONE_SECOND * 10,
});

export const doResetTimer = assign<PomodoroContext, PomodoroEvents>({
  elapsed: 0,
  startedInTheSession: false,
});
