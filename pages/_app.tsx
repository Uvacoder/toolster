import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import { MantineProvider, NormalizeCSS, GlobalStyles, AppShell, Navbar } from '@mantine/core';
import { inspect } from '@xstate/inspect';
import { PomodoroStateProvider } from '@modules/pomodoro/+xstate/pomodoro.context';
import { NotificationsProvider } from '@mantine/notifications';

if (typeof window !== 'undefined') {
  inspect({ iframe: false });
}

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <MantineProvider
        theme={{
          colorScheme: 'dark',
        }}
      >
        <NotificationsProvider>
          <NormalizeCSS />
          <GlobalStyles />
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
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
