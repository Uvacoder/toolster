import { Group, RingProgress, Title, Text } from '@mantine/core';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { PomodoroModes, PomodoroProgress } from '../+xstate/pomodoro-machine.types';
import { headingMapWithColor } from '../pomodoro.const';

type PomodoroCircularProgressProps = {
  controls?: ReactElement;
  progress: PomodoroProgress;
  currentMode: PomodoroModes;
};

const padNumber = (n: number): string => {
  if (n >= 10) {
    return n.toString();
  }
  return `0${n}`;
};

export const PomodoroCircularProgress: FC<PomodoroCircularProgressProps> = ({ controls, progress, currentMode }) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    setRemainingTime(`${padNumber(progress.minutesLeft)}:${padNumber(progress.secondsLeft)}`);
  }, [progress]);

  return (
    <RingProgress
      size={300}
      thickness={30}
      sections={[{ value: progress.completionPct, color: headingMapWithColor[currentMode].color }]}
      label={
        <Group position="center" direction="column">
          <Title order={1} align="center">
            <Text inherit color={headingMapWithColor[currentMode].color} weight="bold">
              {remainingTime}
            </Text>
          </Title>
          {controls && controls}
        </Group>
      }
    />
  );
};
