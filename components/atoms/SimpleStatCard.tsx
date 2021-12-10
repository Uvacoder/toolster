import { Card, Text, TextProps } from '@mantine/core';
import React, { FC } from 'react';

type StringNumberOrNode = string | number | React.ReactNode;

type SimpleStatCardProps = {
  label?: StringNumberOrNode;
  value: StringNumberOrNode;
  helpText?: StringNumberOrNode;
};

const PolymorhicValue: FC<{ value: StringNumberOrNode; textProps?: TextProps<'p'> }> = ({ value, textProps }) => {
  if (!['string', 'number'].includes(typeof value)) {
    return value as React.ReactElement;
  }
  return <Text {...textProps}>{value}</Text>;
};

export const SimpleStatCard: FC<SimpleStatCardProps> = React.memo(({ value, label, helpText }) => (
  <Card shadow="lg" radius="md" style={{ width: 'max-content', paddingRight: '3rem' }}>
    {label && <PolymorhicValue value={label} />}
    <PolymorhicValue
      value={value}
      textProps={{
        size: 'xl',
        weight: 'bolder',
        variant: 'gradient',
        gradient: { from: 'teal', to: 'blue' },
      }}
    />

    {helpText && <PolymorhicValue value={helpText} textProps={{ size: 'sm', color: 'dimmed' }} />}
  </Card>
));
