import { minutesToMs } from '../pomodoro.utils';

const ONE_MINUTE = 1000 * 60;

describe('Time utils correctly convert time units', () => {
  it(' and minutes to ms returns a correct coversion', () => {
    expect(minutesToMs(25)).toEqual(ONE_MINUTE * 25);
    expect(minutesToMs(0)).toEqual(0);
  });
});

export {};
