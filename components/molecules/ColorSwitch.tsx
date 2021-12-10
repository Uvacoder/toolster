import { Button, useMantineColorScheme } from '@mantine/core';
import React, { useEffect } from 'react';

export const ColorSwitch = () => {
  const { toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    console.log('r');
  });

  return <Button onClick={() => toggleColorScheme()}>Toggle Color</Button>;
};
