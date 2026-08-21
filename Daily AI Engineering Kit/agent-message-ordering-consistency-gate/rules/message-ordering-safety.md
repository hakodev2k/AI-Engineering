# Message Ordering Safety Rules

## MUST
- Define the ordering domain and ordering key for every ordered stream under review.
- Use a monotonic sequence/version/offset or equivalent causal marker when stale messages can arrive.
- Reject or safely ignore stale messages without corrupting current state.
- Make consumer side effects idempotent for duplicate/redelivered messages.
- Preserve evidence for out-of-order, duplicate replay, stale event, and parallel-consumer verification.
- Keep retries bounded and ensure retries cannot bypass stale/duplicate guards.
- Stop for explicit approval before production broker reconfiguration, partition-count changes, retention changes, destructive purges, breaking event contracts, disabling deduplication, or weakening ordering guarantees.

## MUST NOT
- Use timestamps alone as the authoritative ordering mechanism when clock skew or delayed delivery is possible.
- Assume a broker's global ordering when only per-partition or per-session ordering is guaranteed.
- Process messages from the same ordering domain concurrently unless the implementation proves safe serialization/version conflict handling.
- Mark an assessment `pass` when any required verification scenario is missing.
- Delete or purge production messages to make tests pass.
- Increase permissions or alter production configuration silently.

## SHOULD
- Prefer ordering keys stable across publisher and consumer boundaries.
- Prefer atomic persistence of business state and inbox/idempotency metadata where feasible.
- Prefer explicit sequence/version conflict handling over implicit last-write-wins.
- Test delayed delivery, replay after restart, concurrent consumers, and duplicate side effects.
- Keep ordering scope as narrow as business correctness allows to avoid unnecessary serialization bottlenecks.
