# Core Skills

## Skill 1 — Build a progress baseline
**Purpose:** define progress from observable task state before enabling a breaker.

**Trigger:** long-running, auto-continuing, multi-agent, compaction-prone, or unattended workflow.

**Inputs:** task definition, available tool events, repository/test state, policy.json.

**Preconditions:** event timestamps/order are available; progress markers can be emitted by host or adapter.

**Required context:** task outputs that constitute durable progress; expected legitimate repeated operations.

**Tools:** event log, Git status/diff, test runner state, task-state store.

**Procedure:**
1. Enumerate durable outputs and state transitions.
2. Map each to one configured `progress_event_type`.
3. Record a successful reference trace and a suspected looping trace.
4. Run `trajectory_guard.py` on both.
5. Adjust only thresholds that reduce measured false positives without allowing the looping trace to pass.
6. Freeze the baseline with trace fixtures.

**Decisions:** if progress cannot be observed externally, instrument it before using STOP mode; WARN-only is acceptable during calibration.

**Constraints:** do not treat commentary, promises, elapsed time, or model claims as progress by themselves.

**Expected output:** calibrated policy and baseline traces.

**Metrics:** false-stop rate; detectable-loop latency; tool calls after last durable progress.

**Verification:** reference successful trace remains healthy; looping trace reaches STOP within target bound.

**Failure handling:** switch to WARN-only and add missing instrumentation.

**Stop conditions:** calibration fails after two policy revisions or progress cannot be represented deterministically.

## Skill 2 — Diagnose a suspected no-progress loop
**Purpose:** distinguish productive repetition from stalled trajectory reuse.

**Trigger:** warning from guard, unusual token burn, repeated reads/polls/status messages, or repeated post-compaction sequence.

**Inputs:** recent JSONL events, task state, policy.

**Procedure:**
1. Identify last durable progress marker.
2. Calculate repeated action/result fingerprints since that marker.
3. Classify repetition: bounded retry, pagination, polling, verification, or unexplained.
4. For legitimate repetition, require explicit bounded allowance and changing result/state evidence.
5. For unexplained repetition, capture the shortest repeating trajectory and current blocker.
6. Mark status STOP when hard thresholds are satisfied.

**Decisions:** changed prose is not novelty if tool/action state is equivalent; changed result content can be novelty when material.

**Constraints:** never infer hidden chain-of-thought; use only observable actions, results, markers, and task state.

**Expected output:** diagnosis with threshold evidence and recovery requirement.

**Metrics:** repetition ratio, novelty ratio, turns/actions since progress.

**Verification:** another reviewer or deterministic replay reproduces the same classification.

**Failure handling:** if trace is incomplete, fail open only in WARN mode; do not claim VERIFIED.

**Stop conditions:** sufficient evidence for healthy/warn/stop, or trace quality is inadequate.

## Skill 3 — Recover without replaying the same trajectory
**Purpose:** restart useful work after circuit break without immediate relapse.

**Trigger:** STOP classification.

**Inputs:** stop report, last progress checkpoint, current task, blocker evidence.

**Procedure:**
1. Freeze automatic continuation.
2. Produce structured state: Facts, Last Progress, Repeated Actions, Repeated Results, Blocker, Failed Hypotheses.
3. Propose one materially different next action with a new `recovery_key`.
4. Verify the action changes at least one of tool, target, hypothesis, source, parameter class, or task state.
5. Resume for at most the configured recovery attempts.
6. Require a new progress marker before clearing the breaker.

**Decisions:** if no materially different action exists, exit as blocked instead of continuing.

**Constraints:** recovery cannot merely rephrase the same instruction or repeat the same fingerprint.

**Expected output:** changed trajectory or explicit escalation/blocker.

**Metrics:** recovery success rate; relapses within next N actions; extra tokens after STOP.

**Verification:** new action fingerprint and subsequent durable progress marker.

**Failure handling:** after maximum recovery attempts, stop and escalate.

**Stop conditions:** progress resumes, task exits blocked, or retry ceiling reached.
