const BLOCKED_OPERATORS = new Set(['$where', '$function', '$accumulator', '$out', '$merge']);

export function rejectDangerousMongoOperators(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) rejectDangerousMongoOperators(item);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (BLOCKED_OPERATORS.has(key)) throw new Error(`Unsafe MongoDB operator is blocked: ${key}`);
    rejectDangerousMongoOperators(nested);
  }
}
