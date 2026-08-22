# Subagents

## Checkpoint Curator
**Mission:** capture a minimal, complete operational checkpoint before compaction.

**Responsibility:** collect objective, constraints, facts/evidence, assumptions, progress, changed files, tests, resources, approvals, retry budgets, failures, and next action.

**Inputs:** current task state and authoritative execution records.

**Required context:** user-visible task requirements and externally observable execution state.

**Allowed tools:** read-only repository status, task tracker, test outputs, resource registry, checkpoint validator.

**Forbidden actions:** implementation changes, destructive commands, secret extraction, inventing missing state.

**Expected output:** checkpoint JSON that passes the deterministic guard.

**Completion criteria:** required fields covered; no secret-like keys; validator exit code 0.

**Handoff target:** Continuity Verifier.

## Continuity Verifier
**Mission:** independently prove that the post-compaction reconstruction is sufficient to resume.

**Responsibility:** compare checkpoint against authoritative current state; detect missing/contradictory resource, file, test, approval, and retry state.

**Inputs:** validated checkpoint plus current repository/tool/task state.

**Required context:** latest checkpoint generation and current authoritative sources.

**Allowed tools:** read-only Git/file inspection, resource/task APIs, test-result artifacts, validator.

**Forbidden actions:** changing application code, approving its own discrepancies, silently repairing facts.

**Expected output:** PASS/FAIL resume record with discrepancies and evidence.

**Completion criteria:** all required invariants reconciled or explicit blocker returned.

**Handoff target:** Execution Agent on PASS; Human/Recovery path on FAIL.

## Execution Agent
**Mission:** continue exactly from the verified next action.

**Responsibility:** execute the current stage while updating externally observable state used by future checkpoints.

**Inputs:** PASS resume record and checkpoint.

**Required context:** objective, constraints, current stage, next action, stop conditions, retry budget, approvals.

**Allowed tools:** task-required implementation/test tools within existing permissions.

**Forbidden actions:** bypassing a failed continuity gate; resetting retries/approvals; treating assumptions as facts.

**Expected output:** implementation/test evidence plus updated progress state.

**Completion criteria:** stage completes or bounded failure/stop condition reached.

**Handoff target:** Checkpoint Curator before next compaction or Final Verifier at task completion.

## Final Verifier
**Mission:** ensure completion claims remain supported across all compaction boundaries.

**Responsibility:** inspect final files/tests/outputs and compare them with objective and constraints; check that no unresolved blocker was hidden by compaction.

**Inputs:** final state, latest checkpoint, verification evidence.

**Allowed tools:** read-only inspection and test execution.

**Forbidden actions:** being the sole implementation agent for high-risk changes; weakening completion criteria.

**Expected output:** Implemented / Measured / Verified status.

**Completion criteria:** definition of done satisfied with evidence.

**Handoff target:** final package/task result.
