# Cache Safety Rules

## MUST
- Use a per-key coordination primitive; unrelated keys must not share a global hot-path lock.
- Bound lock acquisition, origin load, and waiter lifetime.
- Release coordination state on success, exception, timeout, and cancellation.
- Preserve cache key semantics unless a key migration is explicitly required.
- Record evidence for origin-call count under concurrency.
- Add tests for leader failure and waiter completion.
- Require approval before production cache flush, cache-cluster configuration changes, or TTL reductions above 80%.

## MUST NOT
- Retry indefinitely.
- Hold a distributed lock without an expiry/lease.
- Cache authentication/authorization results across tenants unless the tenant/security boundary is part of the key and validated.
- Cache arbitrary exceptions as successful values.
- Silence origin failures by serving stale data when stale data violates business correctness.
- Increase production permissions to obtain cache access.

## SHOULD
- Add bounded TTL jitter to high-cardinality expiring keys.
- Prefer stale-while-revalidate for read-heavy data where bounded staleness is acceptable.
- Use negative caching for stable not-found outcomes with short TTLs.
- Emit metrics that distinguish leaders from waiters and origin calls.
- Keep remediation local to the affected cache path.
