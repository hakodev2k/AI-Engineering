# Core Skills

## Skill 1 — Capture Operational Checkpoint

**Purpose:** preserve task-critical execution state before context compaction.

**Trigger:** automatic/manual compaction is imminent, a long-running handoff occurs, or the model-visible context will be replaced.

**Inputs:** current task objective, explicit constraints, evidence references, changed files, tests, active resources, pending approvals, retry counters, failures, next action.

**Preconditions:** the current execution state can still be inspected; secret values are not required to be copied.

**Required context:** user-visible requirements and externally observable execution state only. Do not capture hidden chain-of-thought.

**Tools:** task tracker, repository status, test output, tool/session metadata, `scripts/context_checkpoint_guard.py`.

**Procedure:**
1. Assign a stable task ID and checkpoint generation.
2. Copy the exact objective and explicit constraints into structured fields.
3. Record facts as concise statements with evidence references.
4. Record unresolved assumptions separately from facts.
5. Record completed/current stages and the single next concrete action.
6. Record changed files and tests with outcomes.
7. Record active external/tool resources by opaque ID/handle and status, never secret value.
8. Record pending approvals, retry counters, stop conditions, blockers.
9. Validate the checkpoint with the deterministic guard.
10. If validation fails, repair only the missing/invalid fields and retry at most twice.

**Decisions:** if a field is important for correct continuation but cannot be verified, mark the task blocked rather than guessing.

**Constraints:** no credentials, no private chain-of-thought, no invented success state.

**Expected output:** a validated checkpoint JSON object.

**Metrics:** required-field coverage, unresolved assumption count, active-resource coverage, checkpoint bytes.

**Verification:** guard exit code 0 plus spot-check that every current stage/next action matches observable state.

**Failure handling:** retain pre-compaction context when possible; otherwise stop execution and request state reconstruction from authoritative sources.

**Stop conditions:** checkpoint passes or maximum two repair attempts are exhausted.

## Skill 2 — Rehydrate and Verify Continuation

**Purpose:** prevent post-compaction execution from proceeding on an incomplete or contradictory reconstruction.

**Trigger:** first turn after compaction, session handoff, or agent resume.

**Inputs:** latest validated checkpoint, reconstructed model-visible context, current repository/tool/resource state.

**Preconditions:** a checkpoint exists or the task is explicitly marked uncheckpointed.

**Procedure:**
1. Load the latest checkpoint by task ID and highest generation.
2. Re-inject objective, constraints, pending approvals, current stage, failures, and next action.
3. Resolve every declared active resource by ID/handle; mark missing resources as `unknown`, never assume active.
4. Compare changed-file state and test status against authoritative sources.
5. Revalidate the checkpoint structure.
6. Produce a compact resume record: Facts, Assumptions, Current Stage, Next Action, Risks, Verification Status.
7. Resume only if verification status is PASS.

**Decisions:** contradictory state is a blocker; choose authoritative current state over stale narrative text and record the discrepancy.

**Expected output:** verified resume record or explicit stop.

**Metrics:** rehydration coverage, orphaned resources, contradictions, duplicate/repeated work after resume.

**Failure handling:** one targeted reconstruction pass from authoritative sources; then stop if still incomplete.

**Stop conditions:** PASS or reconstruction retry exhausted.

## Skill 3 — Measure Compaction Regression

**Purpose:** prove the continuity contract improves reliability without excessive context/token overhead.

**Trigger:** package adoption or changes to compaction/checkpoint logic.

**Inputs:** representative long-running task fixtures, baseline runs without the contract, checkpointed runs.

**Procedure:**
1. Select tasks containing constraints, file changes, tests, active resources, and at least one unresolved assumption.
2. Capture baseline post-compaction outcomes.
3. Run equivalent checkpointed scenarios.
4. Compare missing constraints, repeated operations, wrong next actions, re-read/tool calls, task correctness, and checkpoint bytes.
5. Reject changes that lower task correctness even if they reduce tokens.

**Expected output:** before/after comparison with measured evidence.

**Metrics:** continuity error rate, repeated-work count, recovery tool calls, checkpoint size, correctness pass rate.

**Stop conditions:** measurable comparison exists and no correctness regression remains.
