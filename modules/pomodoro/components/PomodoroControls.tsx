import { Button } from '@mantine/core';
import { FC } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import { PomodoroModes } from '../+xstate/pomodoro-machine.types';

type PomodoroButtonControlProps = {
  currentMode: PomodoroModes;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
};

export const PomodoroControls: FC<PomodoroButtonControlProps> = ({ currentMode, canStart, onStart, onPause }) => (
  <>
    {canStart ? (
      <Button
        onClick={onStart}
        gradient={{ from: 'blue', to: 'teal' }}
        size="lg"
        radius="lg"
        variant="gradient"
        leftIcon={<FiPlay />}
      >
        {`Start ${currentMode.valueOf()}`}
      </Button>
    ) : (
      <Button onClick={onPause} variant="outline" color="gray" size="lg" radius="lg" leftIcon={<FiPause />}>
        Pause {currentMode.valueOf()}
      </Button>
    )}
  </>
);
