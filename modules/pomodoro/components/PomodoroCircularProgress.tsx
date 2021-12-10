import { Group, RingProgress, Title, Text } from '@mantine/core';
import React, { FC } from 'react';
import { PomodoroModes, PomodoroProgress } from '../+xstate/pomodoro-machine.types';
import { headingMapWithColor } from '../pomodoro.const';
import { padNumber } from '../pomodoro.utils';

type PomodoroCircularProgressProps = {
  progress: PomodoroProgress;
  currentMode: PomodoroModes;
};

export const PomodoroCircularProgress: FC<PomodoroCircularProgressProps> = ({ progress, currentMode, children }) => (
  <RingProgress
    size={300}
    thickness={30}
    sections={[{ value: progress.completionPct, color: headingMapWithColor[currentMode].color }]}
    label={
      <Group position="center" direction="column">
        <Title order={1} align="center">
          <Text inherit color={headingMapWithColor[currentMode].color} weight="bold">
            {`${padNumber(progress.minutesLeft)}:${padNumber(progress.secondsLeft)}`}
          </Text>
        </Title>
        {children}
      </Group>
    }
  />
);
