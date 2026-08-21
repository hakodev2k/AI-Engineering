# Distributed Lock Safety Rules

## MUST
- Use a unique opaque owner token for every acquisition attempt.
- Use a monotonically increasing fencing token for protected writes; downstream state-changing code must reject stale fencing tokens where the resource supports it.
- Release or renew only when the stored owner and fencing token match the current holder.
- Set a finite lease for every lock and bound acquisition retries to three attempts.
- Keep the critical section smaller than the lease or renew before two-thirds of the lease has elapsed.
- Preserve acquisition, renewal, release, fencing token, elapsed time, and failure evidence without logging Redis credentials.
- Treat a lost lease or ownership mismatch as loss of authority and stop protected work before any further side effect.
- Require human approval before changing production lock scope, disabling fencing, force-unlocking, or raising lease duration above 120 seconds.

## MUST NOT
- Do not implement unlock as an unconditional `DEL`.
- Do not use process ID, hostname, username, timestamp, or another guessable/reused value as the sole owner token.
- Do not retry forever, busy-wait, or silently continue when acquisition fails.
- Do not assume a Redis lock proves exclusive authority after its TTL has expired.
- Do not perform production force unlock automatically.
- Do not expose `REDIS_URL`, passwords, tokens, or connection strings in reports.

## SHOULD
- Prefer idempotent protected operations even when a lock exists.
- Add jitter to retry timing in high-contention systems.
- Select lock keys from stable business-resource identifiers rather than broad global scopes.
- Track contention and lease-loss rates as operational signals.
