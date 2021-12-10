import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import { AppShell, Button, Center, Container, Navbar, Text, useMantineColorScheme } from '@mantine/core';
import { inspect } from '@xstate/inspect';
import { PomodoroStateProvider } from '@modules/pomodoro/+xstate/pomodoro.context';
import { MantineProviders } from '@providers/MantineProviders';
import { ColorSwitch } from 'components/molecules/ColorSwitch';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  inspect({ iframe: false });
}

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <MantineProviders>
        <PomodoroStateProvider>
          <AppShell
            fixed
            navbarOffsetBreakpoint="sm"
            styles={(theme) => ({
              main: {
                backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[1] : theme.colors.dark[8],
              },
            })}
            navbar={
              <Navbar hiddenBreakpoint="sm" hidden width={{ sm: 300, lg: 250 }}>
                <ColorSwitch />
              </Navbar>
            }
          >
            <Container>
              <Component {...pageProps} />
            </Container>
          </AppShell>
        </PomodoroStateProvider>
      </MantineProviders>
    </>
  );
}

export default MyApp;
