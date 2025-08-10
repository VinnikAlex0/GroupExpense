export const equalize = (
  total: number,
  ids: string[]
): Record<string, string> => {
  const totalCents = Math.round(Number(total || 0) * 100);
  const n = Math.max(1, ids.length);
  const base = Math.floor(totalCents / n);
  let remainder = totalCents % n;
  const mapping: Record<string, string> = {};
  ids.forEach((id, i) => {
    const cents = base + (i < remainder ? 1 : 0);
    mapping[id] = (cents / 100).toFixed(2);
  });
  return mapping;
};

export const centsFromStr = (v: string | undefined): number => {
  const num = parseFloat(v || "0");
  if (!isFinite(num) || isNaN(num)) return 0;
  return Math.round(num * 100);
};

export const strFromCents = (cents: number): string => (cents / 100).toFixed(2);

export const reallocateWithLocks = (
  totalCents: number,
  ids: string[],
  locks: Set<string>,
  current: Record<string, string>
): Record<string, string> => {
  const next: Record<string, string> = { ...current };
  let lockedSum = 0;
  for (const id of ids) {
    if (locks.has(id)) lockedSum += centsFromStr(current[id]);
  }
  let remaining = Math.max(0, totalCents - lockedSum);
  const unlocked = ids.filter((id) => !locks.has(id));
  if (unlocked.length === 0) {
    for (const id of ids) {
      if (!locks.has(id)) next[id] = strFromCents(0);
    }
    return next;
  }
  const base = Math.floor(remaining / unlocked.length);
  let remainder = remaining % unlocked.length;
  unlocked.forEach((id, i) => {
    const cents = base + (i < remainder ? 1 : 0);
    next[id] = strFromCents(cents);
  });
  return next;
};
