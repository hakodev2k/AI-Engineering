# Workflows

## Workflow A — Safe Compaction Boundary

**Trigger:** automatic/manual compaction is imminent or context utilization crosses the host threshold.

**Goal:** compact narrative history without losing state required for correct continuation.

**Inputs:** current task state, repository status, tool/resource registry, test results, active approvals.

**Baseline:** record current duplicate-work count, recovery tool calls, required-field coverage, and checkpoint size for benchmark comparisons.

**Context:** user objective/constraints plus externally observable state only.

### Stages
1. **Observe** — Checkpoint Curator inventories task-critical dynamic state.
2. **Capture** — write the operational checkpoint with incremented generation.
3. **Validate** — run `python scripts/context_checkpoint_guard.py <checkpoint> --policy config/policy.json`.
4. **Checkpoint gate** — on failure, repair missing/invalid fields; maximum 2 validation attempts.
5. **Compact** — host/model compacts narrative history.
6. **Rehydrate** — inject objective, constraints, facts/evidence pointers, current stage, next action, approvals, retries, failures, active resource handles.
7. **Reconcile** — Continuity Verifier checks authoritative current state.
8. **Resume gate** — PASS resumes execution; FAIL performs one targeted reconstruction pass, then stops.

**Responsible agents:** Checkpoint Curator → Continuity Verifier → Execution Agent.

**Tools:** checkpoint guard, repository status/read, task/resource registries, test artifacts.

**Outputs:** validated checkpoint and PASS/FAIL resume record.

**Checkpoints:** before narrative compaction and immediately after rehydration.

**Metrics:** required-field coverage, orphaned resource count, contradictions, checkpoint bytes, duplicate work after resume.

**Retry policy:** validator repair max 2; post-compaction reconstruction max 1.

**Stop conditions:** PASS resume record, or retry/reconstruction budget exhausted.

**Failure path:** preserve current state if possible; do not execute new mutations; surface missing invariants and authoritative sources needed.

**Verification:** the first post-compaction action must equal the verified `state.next_action` unless fresh evidence explicitly changes the plan.

**Definition of Done:** checkpoint passes, rehydrated state reconciles, zero blocking discrepancies, and execution resumes without repeating completed work.

## Workflow B — Continuity Regression Benchmark

**Trigger:** initial adoption or changes to checkpoint schema/policy/compaction integration.

**Goal:** measure whether the contract improves post-compaction reliability.

**Inputs:** representative replay fixtures containing multiple constraints, changed files, tests, an active resource, unresolved assumption, and bounded retry state.

**Baseline:** run scenario without the contract and record lost constraints, wrong next action, repeated reads/tests, correctness, and recovery calls.

### Stages
1. Capture baseline.
2. Enable checkpoint contract.
3. Force a compaction/handoff at the same logical stage.
4. Validate/rehydrate/resume.
5. Compare outcomes.
6. If correctness regresses, reject the change.
7. If overhead is high, optimize checkpoint size without dropping required invariants and rerun once.

**Metrics:** task correctness, lost-required-field count, repeated-work count, recovery tool calls, checkpoint bytes/tokens, time-to-resume.

**Retry policy:** one optimization rerun after the initial comparison.

**Stop conditions:** evidence shows no correctness regression and continuity error rate is lower/equal to baseline; otherwise fail.

**Failure path:** restore prior schema/policy and retain benchmark evidence.

**Verification:** independent Final Verifier reviews the before/after evidence.

**Definition of Done:** comparison artifact exists, correctness passes, and every claimed improvement has measured evidence.

## Workflow C — Recovery When No Checkpoint Exists

**Trigger:** compaction/session handoff occurred without a valid checkpoint.

**Goal:** reconstruct only enough authoritative state to decide whether safe continuation is possible.

**Stages:**
1. Stop mutation.
2. Re-read explicit task request/constraints from durable user-visible history if available.
3. Inspect repository/task/test/resource state.
4. Build a new checkpoint marking uncertain values as assumptions/unknown.
5. Run validator.
6. Perform one verification pass.
7. Resume only if no required invariant remains unknown; otherwise stop and escalate.

**Retry policy:** no repeated reconstruction loops; maximum one reconstruction pass.

**Definition of Done:** safe verified resume or explicit non-resumable blocker.
