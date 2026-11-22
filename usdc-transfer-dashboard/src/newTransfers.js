// Helpers for spotting transfers that arrived since the last poll.
// `latestTimestamp` is the newest blockTimestamp (Unix seconds) seen so far,
// or null before the first successful load.

// Returns the transfers newer than `latestTimestamp`. The first load only sets
// the baseline, so nothing counts as new yet. Transfers from the same block
// share a timestamp: all of them are new when that block is new, and none are
// new when the baseline came from that block.
export function findNewTransfers(transfers, latestTimestamp) {
  if (latestTimestamp === null) {
    return [];
  }

  return transfers.filter(
    transfer => parseInt(transfer.blockTimestamp) > latestTimestamp
  );
}

// Returns the newest blockTimestamp in `transfers`, or `latestTimestamp` if
// that is newer, so the baseline never moves back.
export function getLatestTimestamp(transfers, latestTimestamp) {
  const timestamps = transfers.map(transfer => parseInt(transfer.blockTimestamp));

  return Math.max(latestTimestamp ?? 0, ...timestamps);
}
