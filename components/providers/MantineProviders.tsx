import React, { FC } from 'react';

import { GlobalStyles, MantineProvider, NormalizeCSS } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export const MantineProviders: FC = ({ children }) => (
  <MantineProvider>
    <NotificationsProvider>
      <NormalizeCSS />
      <GlobalStyles />
      {children}
    </NotificationsProvider>
  </MantineProvider>
);
