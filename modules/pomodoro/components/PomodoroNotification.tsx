import { Button, Group } from '@mantine/core';
import React, { FC } from 'react';
import { FiPlay } from 'react-icons/fi';
import { PomodoroModes } from '../+xstate/pomodoro-machine.types';

type PomodoroNotificationProps = {
  color: string;
  mode: PomodoroModes;
  onStart: () => void;
};

export const PomodoroNotification: FC<PomodoroNotificationProps> = ({ onStart, mode, color }) => (
  <Group position="left">
    <Button onClick={onStart} color={color} radius="md" leftIcon={<FiPlay />} size="sm" my="md" variant="light">
      Start {mode.valueOf()}
    </Button>
  </Group>
);
