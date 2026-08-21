# Workflows

## Workflow 1 — Detect and stop a no-progress trajectory
**Trigger:** every completed tool result, turn boundary, auto-continue boundary, compaction resume, or reconnect.

**Goal:** prevent unbounded repetition while preserving legitimate bounded retries/polling.

**Inputs:** ordered event trace, `config/policy.json`, task-specific progress markers.

**Baseline:** capture at least one successful and one looping trace before enabling STOP in production.

**Stages:**
1. **Observe** — append normalized action/result/turn/progress events.
2. **Measure** — run `scripts/trajectory_guard.py` over the active sliding trace.
3. **Classify** — HEALTHY, WARN, or STOP from configured thresholds.
4. **Checkpoint** — on WARN, record last progress and repeated fingerprints; permit execution to continue without resetting counters.
5. **Break** — on STOP, freeze automatic continuation and prevent replay of the stopped fingerprint sequence.
6. **Recover** — hand off to Recovery Planner for one materially changed trajectory.
7. **Verify** — clear STOP only after a new recovery key and a durable progress event.

**Responsible agents:** Trajectory Analyst → Recovery Planner → Execution Agent → Independent Verifier.

**Tools:** host event stream, trajectory guard, repository/test/task-state instrumentation.

**Outputs:** guard report, stop evidence, recovery checkpoint, verification state.

**Checkpoints:** WARN threshold; STOP threshold; recovery-action approval; first post-recovery progress marker.

**Metrics:** no-progress actions, max identical action/result fingerprint, action novelty ratio, tokens/tool calls after last progress, recovery relapse rate.

**Retry policy:** at most `max_recovery_attempts`; each retry requires a different recovery key.

**Stop conditions:** STOP threshold; explicit blocker; recovery attempts exhausted; dangerous/irreversible action requires human approval.

**Failure path:** if trace/instrumentation is incomplete, freeze automatic continuation and mark verification incomplete rather than resetting evidence.

**Verification:** compare guarded behavior to baseline trace and ensure STOP occurs before configured bound.

**Definition of Done:** loop is stopped or useful progress resumes; evidence and metrics are retained; no unbounded continuation remains.

## Workflow 2 — Calibrate without suppressing productive repetition
**Trigger:** initial integration, new tool family, workflow change, or false-stop report.

**Goal:** tune thresholds using evidence rather than intuition.

**Inputs:** corpus of successful and looping traces.

**Stages:**
1. Label durable progress events independently of the detector.
2. Run guard in WARN-only mode.
3. Record false warnings/stops and missed loops.
4. Identify legitimate repetition classes: pagination, polling, verification, bounded retries.
5. Add explicit allowances only when state/result evidence distinguishes them.
6. Re-run corpus.
7. Enable STOP only when looping fixtures stop within bound and productive fixtures remain healthy.

**Retry policy:** maximum two threshold revisions per calibration cycle; if still ambiguous, improve instrumentation rather than widening thresholds indefinitely.

**Verification:** Independent Verifier signs off using fixture results.

**Definition of Done:** thresholds, exceptions, and known blind spots documented; regression traces pass.
