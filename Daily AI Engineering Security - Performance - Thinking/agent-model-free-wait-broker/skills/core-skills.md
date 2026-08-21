# Core Skills

## Skill 1 — Wait-Only Baseline Profiling
**Purpose:** quantify how much model work is spent merely waiting.

**Trigger:** long-running commands, subagents, CI/build/test jobs, remote operations, or traces containing repeated wait/status calls.

**Inputs:** trace/event log with timestamps, model-turn markers, tool names, target IDs, token counts when available.

**Preconditions:** timestamps are monotonic enough for duration analysis; tool calls can be classified.

**Required context:** runtime version, model, task type, normal completion latency, current wait timeout/poll cadence.

**Tools:** trace exporter, `scripts/wait_metrics.py`, spreadsheet/observability backend if desired.

**Procedure:**
1. Capture representative tasks before changing behavior.
2. Classify a model turn as wait-only only when it performs no decision/action other than checking an existing target.
3. Count wait-only model turns, input/output tokens, tool calls, elapsed wait time, and state-change events.
4. Measure completion-detection lag: actual target terminal timestamp to parent wake timestamp.
5. Record invalid/no-op target waits separately.
6. Store baseline and fixture identifiers.

**Decisions:** optimize only when wait-only inference is material or creates operational failures; do not optimize genuine decision turns that happen to include a status check.

**Constraints:** never infer token savings from call counts alone when token telemetry exists.

**Expected output:** baseline report with ratios, absolute costs, latency distribution, and target classes.

**Metrics:** wait-only turn ratio, wait-only token ratio, polls/target, completion-detection lag, invalid wait count.

**Verification:** rerun profiler on a known fixture and manually inspect a sample of classified turns.

**Failure handling:** if logs lack enough structure, instrument first; do not manufacture a baseline.

**Stop conditions:** stop profiling after enough representative traces exist to make a stable before/after comparison.

---

## Skill 2 — Deterministic Wait Brokerage
**Purpose:** keep passive waiting outside the LLM loop.

**Trigger:** a tool/process/subagent has started successfully and the next useful action depends on its state.

**Inputs:** target ID, state provider, optional event stream, policy, deadline.

**Preconditions:** target identity is stable; runtime can query or subscribe to target state without model inference.

**Required context:** terminal states, progress semantics, cancellation behavior, target SLA.

**Tools:** host event loop, `scripts/wait_broker.py` reference implementation.

**Procedure:**
1. Validate target ID and reject sentinel/no-op IDs.
2. Read initial state and fingerprint it.
3. If terminal, wake immediately.
4. Prefer event subscription when available; otherwise poll host-side.
5. Apply exponential backoff between unchanged polls up to policy maximum.
6. Treat completion, failure, cancellation, material progress, user input, or deadline as wake events.
7. Do not invoke the model for unchanged state.
8. Emit a compact wake event containing current state, elapsed time, and progress delta.
9. Return control to the model only after a wake event.

**Decisions:** material progress thresholds are target-specific; event-driven providers should not be wrapped in unnecessary periodic model checks.

**Constraints:** waiting must remain cancellable and observable. Long waits must not hide failure.

**Expected output:** one wake event per meaningful state transition rather than repeated wait-only model turns.

**Metrics:** model re-entries avoided, host polls, wake reason, detection lag, broker CPU time.

**Verification:** run synthetic unchanged→progress→completed streams and compare wake count against baseline polling behavior.

**Failure handling:** provider errors use bounded retries; repeated provider failure wakes the model/runtime with explicit `broker_error` rather than looping forever.

**Stop conditions:** terminal state, deadline, user cancellation/input, provider failure threshold, or maximum wait.

---

## Skill 3 — Wait Regression Verification
**Purpose:** prove that reduced inference does not delay or miss important state transitions.

**Trigger:** broker policy/runtime changes or agent release.

**Inputs:** baseline fixtures, broker traces, target event fixtures.

**Preconditions:** same task class and comparable environment for before/after.

**Required context:** allowed detection-lag SLA and token/cost goals.

**Tools:** unit tests, `scripts/wait_metrics.py`, production telemetry.

**Procedure:**
1. Replay fixtures through old polling policy and broker policy.
2. Compare model re-entry count and wait-only token estimate/measurement.
3. Verify every terminal event wakes exactly once.
4. Verify material progress wakes only when configured threshold is crossed.
5. Verify invalid targets fail immediately.
6. Verify cancellation/user input interrupts waiting.
7. Compare completion-detection lag against SLA.
8. Run canary workload and observe at least one full long-running task class.

**Decisions:** reject optimization if it saves model turns but violates detection or cancellation SLA.

**Constraints:** never increase polling frequency merely to improve benchmark appearance.

**Expected output:** Implemented/Measured/Verified report with before/after values.

**Metrics:** ≥80% reduction in wait-only model turns/tokens for qualifying fixtures, zero missed terminal events, SLA-compliant detection lag.

**Verification:** independent verifier reviews telemetry and tests.

**Failure handling:** rollback to known-safe policy, preserve traces, diagnose wake condition/provider behavior.

**Stop conditions:** all gates pass or a blocking regression is documented.