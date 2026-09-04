# Concurrency and Coordination Rules

## Purpose
Prevent races, conflicting decisions, duplicated actions, and corrupted shared state when multiple agent workers or sub-agents operate concurrently.

## Scope
Applies to parallel tool calls, multi-agent execution, shared workflow state, distributed workers, leases, queues, and concurrent mutations.

## MUST
- Shared mutable state MUST define an explicit coordination strategy such as serialization, optimistic concurrency, transactional update, lease, or lock.
- Writes that can conflict MUST carry a version, sequence, compare-and-set condition, or equivalent conflict-detection mechanism where the storage system supports it.
- Concurrent work MUST use correlation identifiers sufficient to attribute each mutation and reconcile duplicates.
- High-risk operations MUST be serialized when concurrent execution could create irreversible or ambiguous outcomes.
- Leases and locks MUST have bounded lifetime and defined behavior for holder failure.
- Conflict handling MUST preserve evidence and make retry, merge, rejection, or escalation explicit.

## MUST NOT
- Agent workflows MUST NOT assume only one runner exists unless the runtime enforces that invariant.
- Locks MUST NOT be held across unbounded external operations without a documented reason and timeout.
- Last-write-wins MUST NOT be used for consequential shared state when it can silently discard valid concurrent changes.

## SHOULD
- Independent read-only or safely commutative work SHOULD be parallelized only when the latency benefit justifies coordination complexity.
- Concurrency limits SHOULD protect downstream dependencies from fan-out amplification.

## Exceptions
Exceptions require a documented single-writer invariant or proof that concurrent effects commute safely, plus verification under representative load.

## Verification
Run race-condition tests, duplicate-worker simulations, lock-holder crash tests, lease-expiration tests, optimistic-concurrency conflicts, and concurrent side-effect scenarios.