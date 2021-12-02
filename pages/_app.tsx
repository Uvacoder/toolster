import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import { AppShell, Navbar } from '@mantine/core';
import { inspect } from '@xstate/inspect';
import { PomodoroStateProvider } from '@modules/pomodoro/+xstate/pomodoro.context';
import { MantineProviders } from '@providers/MantineProviders';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  inspect({ iframe: false });
}

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <MantineProviders>
        <AppShell
          fixed
          navbarOffsetBreakpoint="sm"
          styles={(theme) => ({
            main: {
              padding: '15px',
              backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[8],
            },
          })}
          navbar={
            <Navbar hiddenBreakpoint="sm" width={{ base: 250, breakpoints: { sm: '0%', lg: 300 } }}>
              test
            </Navbar>
          }
        >
          <PomodoroStateProvider>
            <Component {...pageProps} />
          </PomodoroStateProvider>
        </AppShell>
      </MantineProviders>
    </>
  );
}

export default MyApp;
