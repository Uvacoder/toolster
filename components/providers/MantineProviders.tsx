import React, { FC, useState } from 'react';

import { ColorScheme, ColorSchemeProvider, GlobalStyles, MantineProvider, NormalizeCSS } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export const MantineProviders: FC = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          <NormalizeCSS />
          <GlobalStyles />
          {children}
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
