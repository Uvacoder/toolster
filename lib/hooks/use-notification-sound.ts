import { NotificationSounds } from '@enums/notification-sounds.enum';
import { useCallback } from 'react';

type PlayFn = (audio: NotificationSounds, volume: number) => void;

export const useNotificationSound = (): PlayFn =>
  useCallback((sound: NotificationSounds, volume: number): void => {
    const audio = new Audio(`/audio/${sound.valueOf()}.mp3`);
    audio.volume = volume;

    audio.play();
    audio.remove();
  }, []);
