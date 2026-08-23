# Message Ordering Safety Rules

## MUST
- Establish the ordering scope before reasoning about order: topic/queue, partition or aggregate key, producer, consumer, and sequence source.
- Preserve raw evidence containing message identity, partition key, sequence, and observation order.
- Distinguish duplicate delivery from out-of-order delivery; duplicates may be valid under at-least-once delivery and still require idempotent handling.
- Verify producer assignment, broker guarantees, consumer concurrency, retry/dead-letter paths, and persistence side effects separately.
- Test at least one concurrent-delivery case and one retry/redelivery case for any ordering fix.
- Keep retry loops bounded: at most 2 retries for transient tool/environment failures.
- Require explicit approval before discarding messages, rewriting sequence state, purging queues, changing production broker configuration, or disabling an ordering check.

## MUST NOT
- Assume global ordering when the transport guarantees only partition-local ordering.
- Sort messages after side effects and claim correctness; ordering must be enforced before order-sensitive mutation.
- Treat timestamps from different machines as a trustworthy sequence unless clock guarantees are proven.
- Increase consumer serialization or reduce concurrency in production without evidence and approval.
- Delete duplicate or late messages merely to make a test pass.
- expose payload secrets or PII in evidence when identifiers and sequence metadata are sufficient.

## SHOULD
- Prefer producer-assigned monotonic sequence numbers scoped to the business aggregate.
- Prefer idempotent consumers plus explicit stale/duplicate handling over relying on exactly-once marketing claims.
- Keep fixes local to the violated ordering boundary.
- Preserve before/after traces and unresolved assumptions in the final report.
