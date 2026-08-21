# Workflows

## Workflow 1 — Pre-Compaction Checkpoint

**Trigger:** compaction imminent, context ≥ configured risk threshold, major verified milestone, or handoff.

**Goal:** create an authoritative continuity capsule before conversational state may be compressed or lost.

**Inputs:** current task state, previous capsule, policy.

**Baseline:** current generation, capsule age, critical-field coverage, unresolved blockers.

**Context:** observable task facts, artifact IDs, evidence refs; no hidden reasoning.

**Stages:**
1. Observe current task/turn identity.
2. Reconcile completed work against artifacts/tests.
3. Reconcile failed approaches and reasons.
4. Record active goal, constraints, decisions, blockers, open items, next action.
5. Increment generation.
6. Canonicalize/checksum.
7. Validate policy and byte budget.
8. Persist atomically.

**Responsible agent:** Continuity Custodian.

**Tools:** artifact lookup, `continuity_guard.py stamp`, `continuity_guard.py validate`.

**Outputs:** valid capsule.

**Checkpoints:** validation must pass before compaction proceeds when the harness can control the event.

**Metrics:** capsule bytes, checkpoint age, evidence coverage.

**Retry policy:** one repair retry for malformed capsule; no retry for missing authoritative facts.

**Stop conditions:** valid capsule persisted, or state marked unknown and task paused.

**Failure path:** retain previous valid generation, report missing fields, block risky continuation.

**Verification:** checksum + policy validation.

**Definition of Done:** valid generation exists outside compactable transcript and critical fields are complete.

---

## Workflow 2 — Post-Compaction Continuity Gate

**Trigger:** compaction/resume/handoff/model switch completes.

**Goal:** verify the resumed agent is continuing the same task with the same critical state.

**Inputs:** authoritative capsule, recovered capsule, policy.

**Baseline:** authoritative task ID, generation, turn ID, goal, constraints, blockers and state lists.

**Stages:**
1. Validate authoritative capsule.
2. Produce recovered structured state without mutation.
3. Deterministically compare critical fields.
4. Classify mismatch as critical/non-critical/authorized.
5. If invalid, rehydrate from authoritative capsule.
6. Compare again.
7. If valid, release mutation gate.
8. If still invalid after bounded retries, stop.

**Responsible agent:** Recovery Verifier.

**Tools:** `continuity_guard.py compare`, read-only artifact lookup.

**Outputs:** continuity report.

**Checkpoints:** mutation gate remains locked until status `valid`.

**Metrics:** mismatch count, recovery attempts, recovery latency, stale-turn detections.

**Retry policy:** maximum two rehydrate attempts by default; policy controls final value.

**Stop conditions:** valid continuity or retry budget exhausted.

**Failure path:** preserve artifacts, prohibit mutation, escalate with exact mismatches.

**Verification:** compare exit code 0 and no unresolved critical fields.

**Definition of Done:** resumed execution has proven task, turn, goal, constraints and work-state continuity.

---

## Workflow 3 — Repeat/Regression Guard

**Trigger:** first proposed action after recovery or any action overlapping completed/failed work.

**Goal:** prevent wasted re-execution caused by compaction amnesia.

**Inputs:** proposed action ID/description, validated capsule.

**Baseline:** completed IDs, failed-approach IDs, evidence refs.

**Stages:**
1. Check whether target artifact is already completed.
2. Check whether approach is known-failed.
3. If repeated, require a changed-input/regression/retest justification.
4. If known-failed, require new evidence invalidating prior failure reason.
5. Record authorized retest reason.
6. Otherwise block and choose next open item.

**Responsible agent:** Execution Agent, verified by continuity gate.

**Tools:** structured state lookup.

**Outputs:** allow/block decision.

**Checkpoints:** before mutating tool call.

**Metrics:** duplicate work blocked, justified retests, unnecessary tool calls avoided.

**Retry policy:** no blind retries; one evidence-based reconsideration.

**Stop conditions:** action authorized or blocked.

**Failure path:** block on ambiguous state.

**Verification:** decision references capsule IDs.

**Definition of Done:** no unexplained repeated work reaches a mutating tool.
