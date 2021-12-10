import { PomodoroControlState, PomodoroProgress, PomodoroState } from './pomodoro-machine.types';

export const selectProgressStats = (state: PomodoroState): PomodoroProgress => {
  const { elapsed, currentMode, settings } = state.context;

  const currentModeLength = settings.durations[currentMode];

  const completionPct = (elapsed / currentModeLength) * 100;

  const date = new Date(currentModeLength - elapsed);

  const hoursAsMinutes = (date.getHours() - 1) * 60;

  const minutes = date.getMinutes() + hoursAsMinutes;
  const seconds = date.getSeconds();

  return {
    completionPct,
    minutesLeft: minutes,
    secondsLeft: seconds,
  };
};

export const selectControlState = (state: PomodoroState): PomodoroControlState => {
  const canPause = state.matches('running');
  const canStart = state.matches('idle') || state.matches('paused');

  return {
    currentMode: state.context.currentMode,
    canPause,
    canStart,
  };
};
