// MockUSDC keeps OpenZeppelin's default of 18 decimals, so one token is
// 10^18 base units (real USDC uses 6).
export const TOKEN_DECIMALS = 18;

const UNITS_PER_TOKEN = BigInt(10) ** BigInt(TOKEN_DECIMALS);

// Turns a raw amount from the subgraph, a string of base units such as
// "1234500000000000000000", into a token amount such as "1,234.5".
// BigInt keeps every digit; parseInt would round values above 2^53.
export function formatAmount(value) {
  const units = BigInt(value);
  const whole = units / UNITS_PER_TOKEN;
  const fraction = units % UNITS_PER_TOKEN;

  // en-US groups thousands with commas, which matches the "." used below.
  const wholeText = whole.toLocaleString('en-US');
  const fractionText = fraction
    .toString()
    .padStart(TOKEN_DECIMALS, '0')
    .replace(/0+$/, '');

  return fractionText ? `${wholeText}.${fractionText}` : wholeText;
}
