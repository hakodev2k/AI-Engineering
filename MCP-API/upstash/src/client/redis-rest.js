export class UpstashRedisError extends Error {
  constructor(message, { status, retryAfter } = {}) {
    super(message);
    this.name = "UpstashRedisError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) signal.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason ?? new Error("Aborted")); }, { once: true });
  });
}

export class UpstashRedisClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    if (typeof fetchImpl !== "function") throw new Error("fetch implementation is required");
    this.config = config;
    this.fetch = fetchImpl;
  }

  async command(parts, { signal, retrySafe = true } = {}) {
    if (!Array.isArray(parts) || parts.length === 0) throw new Error("Redis command must not be empty");
    let attempt = 0;
    while (true) {
      const timeoutSignal = AbortSignal.timeout(this.config.timeoutMs);
      const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
      let response;
      try {
        response = await this.fetch(this.config.baseUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "AI-Engineering-Upstash-MCP/1.0"
          },
          body: JSON.stringify(parts),
          signal: combinedSignal
        });
      } catch (error) {
        if (!retrySafe || combinedSignal.aborted || attempt >= this.config.maxRetries) throw error;
        await sleep(Math.min(250 * (2 ** attempt), 4000), signal);
        attempt++;
        continue;
      }
      const retryAfter = response.headers.get("retry-after") || undefined;
      const text = await response.text();
      let body;
      try { body = text ? JSON.parse(text) : {}; } catch { body = { error: text || `HTTP ${response.status}` }; }
      if (response.ok && body?.error === undefined) return body?.result;
      if (retrySafe && RETRYABLE_STATUS.has(response.status) && attempt < this.config.maxRetries) {
        const waitMs = retryAfter && /^\d+$/.test(retryAfter) ? Math.min(Number(retryAfter) * 1000, 10000) : Math.min(250 * (2 ** attempt), 4000);
        await sleep(waitMs, signal);
        attempt++;
        continue;
      }
      throw new UpstashRedisError(body?.error || `Upstash Redis request failed with HTTP ${response.status}`, { status: response.status, retryAfter });
    }
  }

  ping(signal) { return this.command(["PING"], { signal }); }
  get(key, signal) { return this.command(["GET", key], { signal }); }
  mget(keys, signal) { return this.command(["MGET", ...keys], { signal }); }
  exists(keys, signal) { return this.command(["EXISTS", ...keys], { signal }); }
  ttl(key, signal) { return this.command(["TTL", key], { signal }); }
  type(key, signal) { return this.command(["TYPE", key], { signal }); }
  scan({ cursor, match, count }, signal) {
    const cmd = ["SCAN", String(cursor ?? "0")];
    if (match !== undefined) cmd.push("MATCH", match);
    cmd.push("COUNT", String(count ?? 100));
    return this.command(cmd, { signal });
  }
  hgetall(key, signal) { return this.command(["HGETALL", key], { signal }); }
  lrange(key, start, stop, signal) { return this.command(["LRANGE", key, start, stop], { signal }); }
  zrange({ key, start, stop, withScores, reverse }, signal) {
    const cmd = [reverse ? "ZREVRANGE" : "ZRANGE", key, start, stop];
    if (withScores) cmd.push("WITHSCORES");
    return this.command(cmd, { signal });
  }
  set({ key, value, ttlSeconds, onlyIf }, signal) {
    const cmd = ["SET", key, value];
    if (ttlSeconds !== undefined) cmd.push("EX", ttlSeconds);
    if (onlyIf) cmd.push(onlyIf);
    return this.command(cmd, { signal, retrySafe: false });
  }
  hset(key, fields, signal) {
    const cmd = ["HSET", key];
    for (const [field, value] of Object.entries(fields)) cmd.push(field, value);
    return this.command(cmd, { signal, retrySafe: false });
  }
  increment(key, amount, signal) { return this.command(amount === 1 ? ["INCR", key] : ["INCRBY", key, amount], { signal, retrySafe: false }); }
  expire(key, seconds, signal) { return this.command(["EXPIRE", key, seconds], { signal, retrySafe: false }); }
  delete(keys, signal) { return this.command(["DEL", ...keys], { signal, retrySafe: false }); }
}
