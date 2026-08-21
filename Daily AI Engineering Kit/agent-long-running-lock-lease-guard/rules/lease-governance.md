# Long-Running Agent Lease Governance

## MUST
- Use a canonical `resource_key` for every protected mutation scope.
- Bind each lease to `owner_id`, `lease_id`, scope fingerprint, expiry and strictly increasing fencing token.
- Check current lease/token immediately before every protected mutation boundary.
- Stop new mutations immediately after lease expiry or unrecoverable heartbeat failure.
- Preserve previous lease/takeover evidence.
- Refresh mutable resource state after takeover before resuming work.
- Require independent review for high/critical or ambiguous takeover.
- Require explicit human approval for production lock breaking and all dangerous actions listed by policy.
- Use least privilege and provider-native optimistic concurrency/locks where available.

## MUST NOT
- Treat process liveness, browser/tab presence, agent memory or chat state as lease ownership.
- Renew a lease after it has expired as though ownership were uninterrupted.
- Reuse a fencing token across lease acquisitions.
- Force takeover merely because a worker is slow.
- Increase permissions to make lock acquisition succeed.
- Delete lease history to resolve conflicts.
- Retry acquisition indefinitely.
- Let the implementation owner be the sole reviewer of high-risk forced takeover.
- Treat lease ownership as verification of business correctness.

## SHOULD
- Keep lease duration short relative to expected failure detection time.
- Heartbeat at one quarter to one third of lease duration.
- Scope locks narrowly enough to allow safe parallel read-only work.
- Store lease records in a durable system supporting compare-and-set/transactional writes in production.
- Include fencing tokens in downstream writes when the backend supports conditional versions.
