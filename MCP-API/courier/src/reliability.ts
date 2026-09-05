export function classifyProviderError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (/401|unauthoriz|api.?key|authentication/i.test(message)) {
    return new Error("Courier authentication failed. Check COURIER_API_KEY and use the key for the intended Test/Production environment.");
  }
  if (/403|forbidden|permission/i.test(message)) {
    return new Error("Courier denied this operation. Verify workspace/environment access and least-privilege credentials.");
  }
  if (/429|rate.?limit|thrott/i.test(message)) {
    return new Error(`Courier rate limit reached. Preserve the provider retry window before retrying. Upstream detail: ${message}`);
  }
  return error instanceof Error ? error : new Error(message);
}

function retryable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /429|rate.?limit|thrott|502|503|504|ECONNRESET|ETIMEDOUT|temporar/i.test(message);
}

export async function callWithReadRetry<T>(operation: () => Promise<T>, retries: number): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= retries || !retryable(error)) throw error;
      const delayMs = Math.min(2000, 200 * 2 ** attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      attempt += 1;
    }
  }
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Courier MCP call timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
