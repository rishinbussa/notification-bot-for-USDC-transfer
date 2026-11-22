import { findNewTransfers, getLatestTimestamp } from './newTransfers';

// Shaped like the subgraph response: newest first, timestamps as strings.
const transfer = (from, blockTimestamp) => ({
  from,
  to: '0x2222222222222222222222222222222222222222',
  value: '1000000000000000000',
  blockTimestamp,
});

const firstLoad = [transfer('0xc', '300'), transfer('0xb', '200'), transfer('0xa', '100')];

describe('findNewTransfers', () => {
  test('finds nothing on the first load', () => {
    expect(findNewTransfers(firstLoad, null)).toEqual([]);
  });

  test('finds the transfers newer than the latest timestamp', () => {
    expect(findNewTransfers(firstLoad, 150)).toEqual([firstLoad[0], firstLoad[1]]);
  });

  test('finds nothing when no transfer is newer', () => {
    expect(findNewTransfers(firstLoad, 300)).toEqual([]);
  });

  test('handles transfers that share a block timestamp', () => {
    const sameBlockA = transfer('0xd', '400');
    const sameBlockB = transfer('0xe', '400');
    const nextPoll = [sameBlockA, sameBlockB, ...firstLoad];

    // Both transfers of the new block are new; the one at the baseline is not.
    expect(findNewTransfers(nextPoll, 300)).toEqual([sameBlockA, sameBlockB]);
    // Once the baseline is that block, neither counts as new again.
    expect(findNewTransfers(nextPoll, 400)).toEqual([]);
  });

  test('only reports what arrived after the first load', () => {
    let latestTimestamp = null;
    expect(findNewTransfers(firstLoad, latestTimestamp)).toEqual([]);
    latestTimestamp = getLatestTimestamp(firstLoad, latestTimestamp);

    const newTransfer = transfer('0xd', '400');
    const nextPoll = [newTransfer, ...firstLoad];
    expect(findNewTransfers(nextPoll, latestTimestamp)).toEqual([newTransfer]);
  });
});

describe('getLatestTimestamp', () => {
  test('sets the baseline from the first load', () => {
    expect(getLatestTimestamp(firstLoad, null)).toBe(300);
  });

  test('moves forward when newer transfers arrive', () => {
    expect(getLatestTimestamp([transfer('0xd', '400'), ...firstLoad], 300)).toBe(400);
  });

  test('never moves back', () => {
    expect(getLatestTimestamp([transfer('0xa', '100')], 300)).toBe(300);
  });

  test('uses 0 when the first load has no transfers', () => {
    expect(getLatestTimestamp([], null)).toBe(0);
  });
});
