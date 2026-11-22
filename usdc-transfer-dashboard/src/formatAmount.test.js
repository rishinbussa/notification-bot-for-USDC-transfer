import { formatAmount } from './formatAmount';

describe('formatAmount', () => {
  test('formats zero', () => {
    expect(formatAmount('0')).toBe('0');
  });

  test('formats the smallest unit, 1 wei', () => {
    expect(formatAmount('1')).toBe('0.000000000000000001');
  });

  test('formats one token as 10^18 base units', () => {
    expect(formatAmount('1000000000000000000')).toBe('1');
  });

  test('trims trailing zeros and groups thousands', () => {
    expect(formatAmount('1234500000000000000000')).toBe('1,234.5');
  });

  test('formats the largest uint256 value exactly', () => {
    expect(
      formatAmount('115792089237316195423570985008687907853269984665640564039457584007913129639935')
    ).toBe('115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457.584007913129639935');
  });

  test('does not round like floating point numbers', () => {
    // parseInt('1000000000000000001') / 10 ** 18 gives exactly 1.
    expect(formatAmount('1000000000000000001')).toBe('1.000000000000000001');
    // 2^53 + 1 tokens: a Number cannot hold even the whole part exactly.
    expect(formatAmount('9007199254740993000000000000000000')).toBe('9,007,199,254,740,993');
  });
});
