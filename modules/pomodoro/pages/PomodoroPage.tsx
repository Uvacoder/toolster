import { ActionIcon, Card, Center, Container, Drawer, Group, SegmentedControl, Text, Tooltip } from '@mantine/core';
import { useSelector } from '@xstate/react';
import React, { FC, useState } from 'react';
import { FiSkipForward, FiRepeat, FiSettings } from 'react-icons/fi';
import { useLocalStorageObject } from '@hooks/use-local-storage-object';
import { useLiveQuery } from '@hooks/use-live-query';
import { usePomodoroContext } from '../+xstate/pomodoro.context';
import { PomodoroControls } from '../components/PomodoroControls';
import { selectControlState, selectProgressStats } from '../+xstate/pomodoro.selectors';
import { PomodoroCircularProgress } from '../components/PomodoroCircularProgress';
import { PomodoroSettingsForm } from '../components/PomodoroSettingsForm';
import { PomodoroModes } from '../+xstate/pomodoro-machine.types';
import { defaultPomodoroSettings, headingMapWithColor, PomodoroStorageKeys } from '../pomodoro.const';
import { pomodoroDb } from '../pomodoro.db';
import { getDateBounds } from '../pomodoro.utils';

/* 
Will need the following:

--- UTILS ---
1. Convert time to readable format -> minutes / seconds -- DONE
2. Convert time to % format -- DONE


--- Learn about ---
1. Playing sounds from JS / react -- DONE
2. Stable timers in XState -- DONE
3. Testing XState 
4. Testing react components

*/

const [start, end] = getDateBounds();

export const PomodoroPage: FC = () => {
  const service = usePomodoroContext();
  const progress = useSelector(service, selectProgressStats);

  const pomodoros = useLiveQuery(
    () =>
      pomodoroDb.pomodoros
        .where('createTs')
        .between(start, end)
        .toArray((r) => r.reduce((acc, c) => acc + c.duration, 0)),
    []
  );

  const { send } = service;

  const { canStart, currentMode } = useSelector(service, selectControlState);

  const [settingsOpened, setSettingsOpened] = useState(false);

  const [settings, setSettings] = useLocalStorageObject({
    key: PomodoroStorageKeys.Settings,
    defaultValue: defaultPomodoroSettings,
  });

  return (
    <>
      <Center>
        <Container size="xs">
          <Card shadow="lg" radius="lg">
            <Group position="apart">
              <Text color={headingMapWithColor[currentMode].color} weight="bold" size="lg">
                {headingMapWithColor[currentMode].text}
              </Text>
              <ActionIcon size="xl" variant="light" radius="xl" onClick={() => setSettingsOpened(true)}>
                <FiSettings />
              </ActionIcon>
            </Group>
            <Center>
              <SegmentedControl
                mt="sm"
                value={currentMode}
                color={headingMapWithColor[currentMode].color}
                onChange={(value) => send('UPDATE.MODE', { data: value })}
                data={[
                  { label: 'Pomodoro', value: PomodoroModes.Pomodoro },
                  { label: 'Short Break', value: PomodoroModes.ShortBreak },
                  { label: 'Long Break', value: PomodoroModes.LongBreak },
                ]}
              />
            </Center>
            <Group direction="column" position="center" mb="sm">
              <PomodoroCircularProgress
                currentMode={currentMode}
                progress={progress}
                controls={
                  <Group>
                    <Tooltip label={`Skip ${currentMode.valueOf()} (will not count towards statistics)`} withArrow>
                      <ActionIcon size="lg" variant="light" radius="xl" color="grape" onClick={() => send('SKIP')}>
                        <FiSkipForward />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label={`Restart ${currentMode.valueOf()}`} withArrow>
                      <ActionIcon size="lg" variant="light" radius="xl" color="indigo" onClick={() => send('RESET')}>
                        <FiRepeat />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                }
              />
              <PomodoroControls
                canStart={canStart}
                currentMode={currentMode}
                onStart={() => send('START')}
                onPause={() => send('PAUSE')}
              />
            </Group>
          </Card>
        </Container>
      </Center>

      <Drawer
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        position="right"
        size="xl"
        padding="lg"
        title="Pomodoro Settings"
        styles={{
          drawer: { overflowY: 'auto' },
        }}
      >
        <PomodoroSettingsForm
          settings={settings}
          onSettingsUpdate={(updated) => {
            setSettings(updated);
            setSettingsOpened(false);
            send('UPDATE.SETTINGS', { data: updated });
          }}
        />
      </Drawer>
    </>
  );
};
