import React, { FC, useCallback, useState } from 'react';
import {
  Button,
  Divider,
  Group,
  InputWrapper,
  Slider,
  Space,
  Switch,
  SegmentedControl,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { FiPlay } from 'react-icons/fi';
import { useNotificationSound } from '@hooks/use-notification-sound';
import { NotificationSounds } from '@enums/notification-sounds.enum';
import type { PomodoroSettings } from '../pomodoro.types';
import { ModeLengthMap, PomodoroModes } from '../+xstate/pomodoro-machine.types';
import { minutesToMs, msToMinutes } from '../pomodoro.utils';

type PomodoroSettingsFormProps = {
  settings: PomodoroSettings;
  onSettingsUpdate: (updatedSettings: PomodoroSettings) => void;
};

const convertDuration = (durations: ModeLengthMap, converter: (duration: number) => number): ModeLengthMap =>
  Object.entries(durations)
    .map(([mode, durationInMs]) => [mode, converter(durationInMs)])
    .reduce((acc, [mode, durationInMinutes]) => ({ ...acc, [mode]: durationInMinutes }), {}) as ModeLengthMap;

export const PomodoroSettingsForm: FC<PomodoroSettingsFormProps> = ({ settings, onSettingsUpdate }) => {
  const form = useForm<PomodoroSettings>({
    initialValues: {
      ...settings,
    },
  });

  const [volume, setVolume] = useState(() => settings.sounds.soundVolume);
  const [durations, setDurations] = useState(() => convertDuration(settings.durations, msToMinutes));

  const playNotificationSound = useNotificationSound();

  const mutateDurations = useCallback((mode: PomodoroModes, durationInMinutes: number): void => {
    setDurations((curr) => ({
      ...curr,
      [mode]: durationInMinutes,
    }));
  }, []);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        const updated = {
          ...values,
          durations: { ...convertDuration(durations, minutesToMs) },
          sounds: { ...values.sounds, soundVolume: volume },
        };
        onSettingsUpdate(updated);
      })}
      onReset={() => {
        setDurations(() => convertDuration(settings.durations, msToMinutes));
        setVolume(() => settings.sounds.soundVolume);
        form.reset();
      }}
    >
      <Group direction="column" grow>
        <Divider label="Durations" labelPosition="center" my="sm" />

        <InputWrapper description="Pomodoro Duration (minutes)">
          <Slider
            value={durations[PomodoroModes.Pomodoro]}
            onChange={(value) => mutateDurations(PomodoroModes.Pomodoro, value)}
            min={1}
            max={60}
            step={1}
            marks={[
              { value: 15, label: '15m' },
              { value: 30, label: '30m' },
              { value: 45, label: '45m' },
            ]}
          />
        </InputWrapper>
        <Space />
        <InputWrapper description="Short Break Duration (minutes)">
          <Slider
            min={1}
            max={30}
            step={1}
            onChange={(value) => mutateDurations(PomodoroModes.ShortBreak, value)}
            value={durations[PomodoroModes.ShortBreak]}
            marks={[
              { value: 5, label: '5m' },
              { value: 15, label: '15m' },
              { value: 25, label: '25m' },
            ]}
          />
        </InputWrapper>
        <Space />

        <InputWrapper description="Long Break Duration (minutes)">
          <Slider
            min={1}
            max={60}
            step={1}
            onChange={(value) => mutateDurations(PomodoroModes.LongBreak, value)}
            value={durations[PomodoroModes.LongBreak]}
            marks={[
              { value: 15, label: '15m' },
              { value: 30, label: '30m' },
              { value: 45, label: '45m' },
            ]}
          />
        </InputWrapper>

        <Divider label="General Settings" labelPosition="center" mb="sm" mt="xl" />

        <Switch
          label="Automatically Start Breaks"
          checked={form.values.automaticallyStartBreaks}
          onChange={(e) => form.setFieldValue('automaticallyStartBreaks', e.currentTarget.checked)}
        />
        <Switch
          label="Automatically Start Focus Time"
          checked={form.values.automaticallyStartPomodoro}
          onChange={(e) => form.setFieldValue('automaticallyStartPomodoro', e.currentTarget.checked)}
        />

        <Switch
          label="Show Notifications"
          checked={form.values.showNotifications}
          onChange={(e) => form.setFieldValue('showNotifications', e.currentTarget.checked)}
        />
        <Switch
          label="Show Nav Widget"
          checked={form.values.showWidget}
          onChange={(e) => form.setFieldValue('showWidget', e.currentTarget.checked)}
        />

        <NumberInput
          min={1}
          max={10}
          value={form.values.longBreakAfter}
          description="Start a Long Break After"
          onChange={(e) => form.setFieldValue('longBreakAfter', e)}
        />

        <Divider label="Sounds" labelPosition="center" my="sm" />

        <Group grow position="center" align="center" mb="md">
          <Switch
            label="Play Sounds"
            checked={form.values.sounds.playSound}
            onChange={(e) => {
              form.setFieldValue('sounds', {
                ...form.values.sounds,
                playSound: e.currentTarget.checked,
              });
            }}
          />

          <InputWrapper description="Volume">
            <Slider
              min={1}
              max={100}
              step={1}
              value={volume}
              onChange={setVolume}
              marks={[
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
              ]}
            />
          </InputWrapper>
        </Group>

        <InputWrapper description="Sound played when the timer is finished">
          <SegmentedControl
            onChange={(value) => {
              form.setFieldValue('sounds', {
                ...form.values.sounds,
                soundName: value as NotificationSounds,
              });
            }}
            color="blue"
            value={form.values.sounds.soundName}
            data={[
              { label: NotificationSounds.Beep, value: NotificationSounds.Beep },
              { label: NotificationSounds.Bell, value: NotificationSounds.Bell },
              { label: NotificationSounds.Chime, value: NotificationSounds.Chime },
              { label: NotificationSounds.Flute, value: NotificationSounds.Flute },
              { label: NotificationSounds.Magic, value: NotificationSounds.Magic },
            ]}
          />
        </InputWrapper>

        <Group position="right">
          <Button
            leftIcon={<FiPlay />}
            onClick={() => playNotificationSound(form.values.sounds.soundName, volume / 100)}
          >
            Test Sound
          </Button>
        </Group>

        <Group style={{ alignSelf: 'flex-end' }}>
          <Button color="gray" radius="md" variant="outline" type="reset">
            Reset
          </Button>
          <Button radius="md" styles={{ root: { width: '10rem' } }} type="submit">
            Save
          </Button>
        </Group>
        <Space />
      </Group>
    </form>
  );
};
