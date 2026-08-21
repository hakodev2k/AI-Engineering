# Workflows

## Workflow A — Proactive Checkpoint and Compact

### Trigger
Any of:
- context ratio reaches `checkpointContextRatio`;
- major implementation/debugging phase completes;
- model/subagent handoff is about to occur;
- a large tool call may consume the recovery reserve;
- user/runtime requests compaction.

### Goal
Create a verified operational checkpoint before platform compaction so the task can resume without depending on full transcript replay.

### Inputs
Context telemetry, active model limit, task state, changed files, tests/commands, artifacts, policy.

### Baseline
Record current input tokens, context ratio, active model, recent tool-output bytes, checkpoint size if one exists, and number of unresolved blockers.

### Stages
1. **Measure** — Context Budget Analyst resolves per-model budget.
2. **Gate** — If below threshold and no milestone trigger exists, stop with `continue`.
3. **Collect** — Checkpoint Curator gathers observable operational state.
4. **Externalize** — Persist large durable tool outputs; compute hashes.
5. **Build** — Produce checkpoint JSON.
6. **Validate** — Run deterministic checkpoint validator.
7. **Independent verify** — Checkpoint Verifier confirms artifacts and operational invariants.
8. **Activate** — Persist checkpoint as latest verified version without deleting predecessor.
9. **Compact** — Invoke platform compaction when available.
10. **Resume validate** — Load compacted state plus checkpoint and verify the goal/constraints/next action.
11. **Continue** — Rehydrate only the artifacts needed for the next action.

### Responsible agents
Budget Analyst → Checkpoint Curator → Checkpoint Verifier → Coordinator.

### Tools
Context telemetry, artifact store, SHA-256, `context_checkpoint.py`, `verify_checkpoint.py`, platform compaction API/command when available.

### Outputs
Verified checkpoint, artifact manifest, compaction result, resume-validation result, metrics event.

### Checkpoints
- CP1: token budget is known.
- CP2: artifact persistence succeeds.
- CP3: checkpoint validator exits 0.
- CP4: independent verification passes.
- CP5: post-compaction resume validation passes.

### Metrics
Pre/post token count, checkpoint token estimate, bytes externalized, reserve remaining, validation failures, compaction duration/failure, resume success.

### Retry policy
- Checkpoint correction: maximum 1 retry.
- Platform compaction: maximum 1 retry if failure is transient and reserve remains safe.
- Resume validation: no blind retry; enter recovery on blocking discrepancy.

### Stop conditions
- Success: `resume-ok` and next action is executable.
- Safety stop: context ratio >= hard-stop before verified checkpoint exists.
- Failure stop: checkpoint remains invalid after one correction.
- Escalation: required artifact is missing/corrupt or platform compaction is unrecoverable.

### Failure path
Do not delete current context. Load the last verified checkpoint. Enter Workflow C.

### Verification
Checkpoint hash/artifact invariants pass and the resumed agent can state goal, hard constraints, changed files, verification state, blocker set, and next action from checkpoint-derived state.

### Definition of Done
A verified checkpoint exists, compaction is complete or safely skipped, resume integrity passes, and metrics are recorded.

---

## Workflow B — Large Tool Output Containment

### Trigger
A tool result exceeds `artifactPolicy.inlineMaxChars`, is binary, is expensive to reproduce, or is required later for verification.

### Goal
Keep the context small without losing durable evidence.

### Inputs
Tool output, media type, producing command/tool, task/checkpoint identifiers.

### Baseline
Record raw output size and current context ratio.

### Stages
1. Classify output as ephemeral/durable.
2. Scan for secrets or sensitive values according to host policy.
3. Persist durable data outside the model transcript.
4. Compute SHA-256.
5. Create compact artifact metadata: purpose, path/URI, size, hash, producer, timestamp.
6. Keep only the minimum useful excerpt in the operational tail.
7. Verify artifact retrievability.
8. Update checkpoint candidate or active artifact manifest.

### Responsible agent
Checkpoint Curator; Checkpoint Verifier validates later.

### Tools
Artifact store, hash utility, secret scanner/redactor when configured.

### Outputs
Artifact record + bounded excerpt.

### Checkpoints
Persistence succeeds; hash exists; retrievability succeeds.

### Metrics
Raw bytes, retained inline bytes, reduction ratio, retrieval failures.

### Retry policy
Storage write may retry once if transient. Hash mismatch gets no blind retry; re-read/recompute then stop on mismatch.

### Stop conditions
Success when durable artifact is retrievable. If artifact is required but cannot be persisted, do not intentionally evict the raw source.

### Verification
Hash and size match; purpose explains why the artifact is needed.

### Definition of Done
No required large artifact depends solely on transcript retention.

---

## Workflow C — Compaction/Resume Recovery

### Trigger
Compaction fails, resumed state is inconsistent, latest checkpoint is invalid, or a context-limit error blocks normal continuation.

### Goal
Recover from the newest verified state without guessing and without immediate full-history replay.

### Inputs
Failure event, verified checkpoints, artifact store, repository/runtime state.

### Baseline
Record failure type, current model/context ratio, last verified checkpoint ID, repository commit/status, and missing artifacts.

### Stages
1. Freeze optional writes/actions.
2. Select latest verified checkpoint.
3. Validate checkpoint again.
4. Verify referenced artifact hashes.
5. Compare changed-file/test state with current repository/runtime state.
6. Rehydrate only artifacts required for the next action.
7. Construct a bounded resume packet.
8. Validate goal, constraints, blockers, and next action.
9. Resume if consistent; otherwise escalate with discrepancy list.

### Responsible agent
Recovery Agent, with read-only verification where possible.

### Tools
`verify_checkpoint.py`, artifact store, repository status/diff, safe test commands.

### Outputs
Resume packet and one of: `resume-ok`, `resume-with-warning`, `human-escalation`.

### Checkpoints
Latest verified checkpoint loads; artifacts validate; repository state is reconciled.

### Metrics
Recovery duration, artifacts loaded, tokens used for recovery, full-history fallback rate, human escalation rate.

### Retry policy
One targeted recovery attempt per checkpoint. If it fails, try at most one older verified checkpoint. Then stop.

### Stop conditions
Resume only when blocking invariants pass. Escalate rather than inventing missing state.

### Verification
The recovered next action is grounded in checkpoint + current observable state.

### Definition of Done
Either safe continuation is restored or a finite discrepancy report explains why human intervention is required.