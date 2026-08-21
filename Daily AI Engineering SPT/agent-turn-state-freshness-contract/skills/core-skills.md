# Core Skills

## Skill 1 — Turn-State Baseline & Ownership Audit

### Purpose
Find fields, events, and routing predicates that can survive one user turn and incorrectly influence the next.

### Trigger
Use when an agent is stateful, checkpointed, resumable, retryable, or stores structured/final output in durable state.

### Inputs
- state schema and reducers;
- graph/router/finalizer code;
- checkpoint/thread model;
- retry/replay logic;
- event stream schema;
- sample multi-turn traces.

### Preconditions
A concrete definition of a user turn exists or can be introduced.

### Required context
Know which state is conversation-scoped versus turn-scoped.

### Tools
State-schema inspection, trace viewer, `scripts/turn_state_guard.py`, tests.

### Procedure
1. Enumerate durable state fields.
2. Classify each as conversation-scoped, turn-scoped working state, turn-scoped evidence, or turn-scoped terminal state.
3. Locate every route/finalization predicate reading turn-scoped fields.
4. Record whether the field carries `owner_turn_id`.
5. Record whether new-turn initialization clears/tombstones it.
6. Inspect retry code for snapshots captured before tool cleanup/persistence.
7. Inspect streamed events for run/turn correlation.
8. Produce a violation list ordered by ability to cause premature exit or stale finalization.

### Decisions
- If a field legitimately survives turns, classify it conversation-scoped and document why.
- If terminal presence can end a turn, it must be owner-versioned.
- If ownership cannot be proven, treat the state as non-authoritative.

### Constraints
Do not erase long-term memory merely to solve turn ownership. Do not rely on prompt instructions for runtime routing correctness.

### Expected output
An ownership matrix and prioritized violation list.

### Metrics
Unowned terminal fields, presence-based exit predicates, retries with stale snapshot risk, uncorrelated event types.

### Verification
Every terminal/finalization input is classified and mapped to an owner check.

### Failure handling
If the runtime hides state internals, instrument middleware at turn entry/finalization and treat unknown ownership as stale.

### Stop conditions
Stop when all terminal fields and finalization predicates have explicit ownership semantics.

---

## Skill 2 — Freshness Contract Implementation

### Purpose
Make stale state unable to finalize the current turn.

### Trigger
Run after the audit identifies one or more cross-turn ownership gaps.

### Inputs
Ownership matrix, policy file, state schema, turn lifecycle hooks.

### Preconditions
A unique `turn_id` can be generated before current-turn mutable work starts.

### Procedure
1. Generate `turn_id` at turn admission.
2. Persist `active_turn_id` with the thread/run state.
3. Invalidate all configured turn-scoped terminal fields.
4. Wrap every new terminal value as `{owner_turn_id, value, produced_at_revision}`.
5. Tag tool/test/approval/artifact evidence with the active turn.
6. Replace `if terminal_field exists` predicates with `is_fresh(terminal_field, active_turn_id)`.
7. Before final response, validate all authoritative evidence and terminal ownership.
8. On stale detection, reload latest durable state once and recompute routing; never silently reuse the stale value.
9. Log stale-state violations without including sensitive payload content.

### Decisions
- Conversation memory remains reusable if it is not a terminal claim.
- Historical evidence may inform reasoning, but must not impersonate current-turn verification.
- A foreign-turn approval must be rejected unless policy explicitly defines reusable approval semantics.

### Constraints
No hidden chain-of-thought is required. Freshness is enforced using observable identifiers and state metadata.

### Expected output
Versioned turn state with fail-closed finalization.

### Metrics
Stale-finalization blocks, fresh finalizations, refresh recoveries, escalations.

### Verification
Adversarial tests inject prior-turn terminal fields and confirm they cannot end the new turn.

### Failure handling
If turn identity is missing, refuse finalization and mark the run `state_identity_error`.

### Stop conditions
Stop after one refresh and one execution retry; escalate if freshness cannot be re-established.

---

## Skill 3 — Retry/Replay Freshness Verification

### Purpose
Ensure retries, resumes, and event replay cannot regress to stale state.

### Trigger
Use for stream interruption, worker restart, checkpoint resume, protocol replay, or retry middleware.

### Inputs
Latest durable revision, in-flight tool registry, retry attempt, event/run identifiers.

### Procedure
1. Drain or reconcile completed in-flight tool operations.
2. Persist their outputs before constructing the retry request.
3. Read the newest durable state revision.
4. Rebuild retry input from that revision rather than a pre-loop cached prompt/state object.
5. Correlate replayed events to `run_id`/`turn_id`; classify unmatched historical events as non-authoritative.
6. Validate terminal/evidence ownership before resuming routing.
7. Compare resulting finalization against the active turn identity.

### Metrics
Stale retry snapshots, orphan tool outputs, foreign-run event acceptances, retry recovery rate.

### Verification
Fault-injection tests interrupt after a tool completes but before final stream completion.

### Failure handling
If latest durable state cannot be loaded, stop rather than finalize from cached state.

### Stop conditions
Maximum one state-refresh recovery followed by one retry.
