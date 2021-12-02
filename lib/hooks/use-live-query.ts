import { liveQuery } from 'dexie';
import React from 'react';
import { useSubscription } from './use-subscription';

export function useLiveQuery<T>(querier: () => Promise<T> | T, dependencies?: unknown[]): T | undefined;
export function useLiveQuery<T, TDefault>(
  querier: () => Promise<T> | T,
  dependencies: unknown[],
  defaultResult: TDefault
): T | TDefault;
export function useLiveQuery<T, TDefault>(
  querier: () => Promise<T> | T,
  dependencies?: unknown[],
  defaultResult?: TDefault
): T | TDefault {
  const [lastResult, setLastResult] = React.useState(defaultResult as T | TDefault);
  const subscription = React.useMemo(
    () => {
      // Make it remember previous subscription's default value when
      // resubscribing (á la useTransition())
      let currentValue = lastResult;
      if (typeof window === 'undefined') {
        return {
          getCurrentValue: () => currentValue,
          subscribe: () => () => undefined,
        };
      }

      const observable = liveQuery(querier);
      return {
        getCurrentValue: () => currentValue,
        subscribe: (onNext: (arg: T) => void, onError: ((error: any) => void) | null | undefined) => {
          const esSubscription = observable.subscribe((value) => {
            currentValue = value;
            setLastResult(value);
            onNext(value);
          }, onError);
          return esSubscription.unsubscribe.bind(esSubscription);
        },
      };
    },

    // Re-subscribe any time any of the given dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies || []
  );

  // The value returned by this hook reflects the current result from the querier
  // Our component will automatically be re-rendered when that value changes.

  const value = useSubscription(subscription);
  return value;
}
