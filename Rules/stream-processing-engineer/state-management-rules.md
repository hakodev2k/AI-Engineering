# State Management
## Purpose
Keep streaming state correct, bounded, recoverable, and operable.
## Scope
Keyed state, operator state, retention, TTL, and state backends.
## MUST
- Stateful operators MUST define ownership, keying, retention, and recovery behavior.
- Unbounded state growth MUST be prevented with justified retention or compaction controls.
- State schema evolution MUST be tested against existing persisted state before rollout.
## MUST NOT
- State MUST NOT be deleted or reset in production without impact analysis and approval.
## SHOULD
- State size and growth SHOULD be observable per operator or partition.
## Exceptions
Long-lived state requires capacity evidence and an explicit lifecycle strategy.
## Verification
Inspect state metrics, restore tests, retention behavior, and compatibility tests using representative snapshots.