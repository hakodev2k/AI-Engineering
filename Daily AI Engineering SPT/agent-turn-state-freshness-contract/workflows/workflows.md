# Workflows

## Workflow A — Audit → Contract → Verify

**Trigger:** a stateful agent persists checkpoints or structured/final state across turns.  
**Goal:** eliminate stale cross-turn finalization without destroying useful conversation memory.

### Inputs
State schema, router/finalizer code, checkpoint/retry implementation, traces, policy.

### Baseline
Capture at least: terminal fields, their owners (if any), current exit predicates, two-turn behavior, retry behavior after a completed tool call, and event correlation metadata.

### Stages
1. **Observe** — State Ownership Analyst inventories durable fields and current traces.
2. **Classify** — label values as conversation-scoped or turn-scoped working/evidence/terminal state.
3. **Cause** — identify missing ownership, presence-based routing, stale retry snapshots, or replay/live ambiguity.
4. **Hypothesis** — define the smallest ownership/freshness contract that blocks the observed path.
5. **Implement** — Freshness Contract Implementer adds turn admission, invalidation, owner tagging, centralized validation, and retry reload.
6. **Measure** — run deterministic two-turn and fault-injection tests.
7. **Verify** — Independent Turn-Safety Verifier checks stale injection, missing identity, foreign evidence, and bounded recovery.

### Checkpoints
- C1: ownership matrix complete;
- C2: all terminal predicates mapped to freshness checks;
- C3: tests demonstrate stale state is blocked;
- C4: legitimate conversation memory still works.

### Metrics
stale finalizations, unowned terminal fields, freshness blocks, refresh recoveries, foreign evidence attempts, finalization success rate.

### Retry policy
At most one contract implementation correction cycle after failed verification. If the same failure class persists, stop for architecture review.

### Failure path
Do not relax ownership checks. Record the failing field/path, preserve test evidence, and escalate.

### Definition of Done
All mandatory policy checks pass; no stale injected state can finalize a newer turn; current-turn outputs remain usable; residual risks are documented.

---

## Workflow B — Runtime Turn Admission & Finalization

**Trigger:** every new user request in a persisted thread.  
**Goal:** establish a clean current-turn authority boundary.

### Stages
1. Generate `turn_id` and read latest durable revision.
2. Write `active_turn_id` and invalidate configured terminal fields atomically where possible.
3. Process model/tool work; tag current-turn evidence and terminal candidates.
4. Before any route-to-END or user-visible final response, call the freshness validator.
5. If valid, finalize and persist terminal output with owner metadata.
6. If stale/missing ownership is detected, reload latest durable state once, re-evaluate, and retry execution at most once.
7. If still invalid, stop with explicit `state_freshness_error`.

### Outputs
Fresh current-turn finalization or explicit blocked state.

### Stop conditions
Success, or one refresh + one retry exhausted.

---

## Workflow C — Interrupted Stream / Retry Recovery

**Trigger:** stream error, process interruption, timeout, transport reset, resume, or retry.  
**Goal:** prevent a retry from using a state snapshot older than completed tool work.

### Stages
1. Stop creating additional tool work.
2. Drain/reconcile in-flight tool futures that may already have completed.
3. Persist completed outputs with `owner_turn_id` and durable revision.
4. Reload the latest checkpoint/state snapshot.
5. Reconstruct retry input from that snapshot.
6. Reject any terminal value owned by a foreign turn.
7. Correlate incoming replay events with current run/turn identity.
8. Resume once.

### Verification
Inject failure after tool completion but before normal response completion; recovered run must include the completed tool output and must not emit a prior-turn final response.

### Failure path
If tool completion state is ambiguous or latest durable state cannot be loaded, stop and require operator/user retry rather than guessing.
