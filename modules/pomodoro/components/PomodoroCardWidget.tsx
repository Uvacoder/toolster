import { ActionIcon, Card, Center, Group, SegmentedControl, Text, Tooltip } from '@mantine/core';
import { useSelector } from '@xstate/react';
import React, { FC } from 'react';
import { FiSettings, FiSkipForward, FiRepeat } from 'react-icons/fi';
import { PomodoroModes } from '../+xstate/pomodoro-machine.types';
import { usePomodoroContext } from '../+xstate/pomodoro.context';
import { selectControlState, selectProgressStats } from '../+xstate/pomodoro.selectors';
import { headingMapWithColor } from '../pomodoro.const';
import { PomodoroCircularProgress } from './PomodoroCircularProgress';
import { PomodoroControls } from './PomodoroControls';

type PomodoroCardWidgetProps = {
  onOpenSettings: () => void;
};

type StartStopControlsProps = {
  currentMode: PomodoroModes;
  onSkip: () => void;
  onRestart: () => void;
};

const StartStopControls: FC<StartStopControlsProps> = React.memo(({ currentMode, onRestart, onSkip }) => (
  <Group>
    <Tooltip label={`Skip ${currentMode.valueOf()} (will not count towards statistics)`} withArrow>
      <ActionIcon size="lg" variant="light" radius="xl" color="grape" onClick={onSkip}>
        <FiSkipForward />
      </ActionIcon>
    </Tooltip>

    <Tooltip label={`Restart ${currentMode.valueOf()}`} withArrow>
      <ActionIcon size="lg" variant="light" radius="xl" color="indigo" onClick={onRestart}>
        <FiRepeat />
      </ActionIcon>
    </Tooltip>
  </Group>
));

export const PomodoroCardWidget: FC<PomodoroCardWidgetProps> = React.memo(({ onOpenSettings }) => {
  const service = usePomodoroContext();
  const { canStart, currentMode } = useSelector(service, selectControlState);
  const progress = useSelector(service, selectProgressStats);

  return (
    <Card shadow="lg" radius="lg" style={{ maxWidth: '24rem' }}>
      <Group position="apart">
        <Text color={headingMapWithColor[currentMode].color} weight="bold" size="lg">
          {headingMapWithColor[currentMode].text}
        </Text>
        <ActionIcon size="xl" variant="light" radius="xl" onClick={onOpenSettings}>
          <FiSettings />
        </ActionIcon>
      </Group>
      <Center>
        <SegmentedControl
          mt="sm"
          value={currentMode}
          color={headingMapWithColor[currentMode].color}
          onChange={(value) => service.send('UPDATE.MODE', { data: value })}
          data={[
            { label: 'Pomodoro', value: PomodoroModes.Pomodoro },
            { label: 'Short Break', value: PomodoroModes.ShortBreak },
            { label: 'Long Break', value: PomodoroModes.LongBreak },
          ]}
        />
      </Center>
      <Group direction="column" position="center" mb="sm">
        <PomodoroCircularProgress currentMode={currentMode} progress={progress}>
          <StartStopControls
            currentMode={currentMode}
            onSkip={() => service.send('SKIP')}
            onRestart={() => service.send('RESET')}
          />
        </PomodoroCircularProgress>
        <PomodoroControls
          canStart={canStart}
          currentMode={currentMode}
          onStart={() => service.send('START')}
          onPause={() => service.send('PAUSE')}
        />
      </Group>
    </Card>
  );
});
