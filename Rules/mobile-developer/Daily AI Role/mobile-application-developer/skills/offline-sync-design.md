# Skill: Offline and Sync Design
Purpose: design resilient local-first or cached behavior without corrupting user state.

Trigger: cached data, editable offline state, background sync, retry queue, or intermittent-network requirement.
Inputs: entity model, authoritative source, conflict semantics, freshness needs, API idempotency, storage constraints.
Preconditions: source-of-truth and identity rules are known.
Procedure:
1. Classify each datum as authoritative-local, authoritative-remote, derived, cache, or pending mutation.
2. Define local schema/versioning and retention.
3. Model operation states: queued, sending, acknowledged, failed-retryable, failed-terminal, superseded.
4. Define idempotency keys and duplicate handling.
5. Define conflict policy: server-wins, client-wins, field merge, version check, or human resolution.
6. Define network and app-lifecycle triggers; avoid unbounded background work.
7. Use bounded exponential backoff with jitter where appropriate.
8. Define observability for queue depth, age, failures, conflicts, and data-loss signals.
9. Test airplane mode, network flap, timeout-after-server-commit, duplicate delivery, process death, clock skew, and app upgrade.
Output: sync state machine, persistence contract, conflict/retry policy, telemetry, and tests.
Quality: no mutation can disappear silently or apply twice without defined semantics.
Stop: recovery from every modeled interruption is deterministic.