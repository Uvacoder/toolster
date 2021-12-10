import { Drawer } from '@mantine/core';
import React, { FC, useState } from 'react';
import { useLocalStorageObject } from '@hooks/use-local-storage-object';
import { SimpleStatCard } from '@atoms/SimpleStatCard';
import { usePomodoroContext } from '../+xstate/pomodoro.context';
import { PomodoroSettingsForm } from '../components/PomodoroSettingsForm';
import { defaultPomodoroSettings, PomodoroStorageKeys } from '../pomodoro.const';
import { PomodoroCardWidget } from '../components/PomodoroCardWidget';
import { usePomodoroStats } from '../hooks/use-pomodoro-stats';
import { complexTimeToString } from '../pomodoro.utils';

export const PomodoroPage: FC = () => {
  const { send } = usePomodoroContext();

  const { today, allTime } = usePomodoroStats();

  const [settingsOpened, setSettingsOpened] = useState(false);

  const [settings, setSettings] = useLocalStorageObject({
    key: PomodoroStorageKeys.Settings,
    defaultValue: defaultPomodoroSettings,
  });

  return (
    <>
      <PomodoroCardWidget onOpenSettings={() => setSettingsOpened(true)} />

      {today.pomodoroCount > 0 && (
        <SimpleStatCard
          value={complexTimeToString(today.time)}
          label="Focus Time Today"
          helpText={`Completed ${today.pomodoroCount} ${today.pomodoroCount > 1 ? 'Pomodoros' : 'Pomodoro'}`}
        />
      )}

      {allTime.pomodoroCount > 0 && (
        <SimpleStatCard
          value={complexTimeToString(allTime.time)}
          label="Focus Time Since Start"
          helpText={`Completed ${allTime.pomodoroCount} ${allTime.pomodoroCount > 1 ? 'Pomodoros' : 'Pomodoro'}`}
        />
      )}

      <Drawer
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        position="right"
        padding="sm"
        size="xl"
        title="Pomodoro Settings"
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
