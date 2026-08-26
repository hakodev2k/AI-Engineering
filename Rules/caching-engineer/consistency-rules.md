# Cache Consistency

## Purpose
Make freshness and consistency guarantees explicit.

## Scope
Read-after-write, eventual consistency, bounded staleness, and multi-tier coherence.

## MUST
- Each cached workflow MUST define the consistency property required by consumers.
- Correctness-critical operations MUST validate authoritative state when stale values could cause irreversible business impact.
- Consistency guarantees exposed to callers MUST match implementation and failure behavior.
- Region and tier propagation delays MUST be included in the staleness budget.

## MUST NOT
- Eventual consistency MUST NOT justify unbounded stale data.
- Cache hits MUST NOT be assumed current merely because entries have not expired.
- Stronger consistency MUST NOT be claimed without tests or operational evidence.

## SHOULD
- Use version stamps, sequence numbers, or equivalent evidence where freshness comparison matters.
- Prefer bounded, documented inconsistency over implicit behavior.

## Exceptions
Record business tolerance, evidence, mitigation, and approval for weakened guarantees.

## Verification
Run concurrency and propagation tests; inspect version metadata, traces, staleness metrics, and contracts.