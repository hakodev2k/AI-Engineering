# Core Skills

## Skill 1 — Retry Baseline and Ownership Audit

**Purpose:** Establish where retries occur before changing behavior.  
**Trigger:** New agent/tool integration, unexplained latency/cost spike, repeated failures, or before tuning retry settings.  
**Inputs:** Runtime trace, SDK configuration, orchestrator retry policy, tool metadata, operation taxonomy.  
**Preconditions:** Trace includes timestamps and operation/tool identity.  
**Required context:** Which layer owns SDK retries, orchestration retries, model re-planning, and workflow restarts.  
**Tools:** Trace export, `scripts/analyze_retry_trace.py`, configuration inspection.

### Procedure
1. Capture a representative failed run without changing policy.
2. Normalize each physical attempt into a logical operation fingerprint.
3. Count attempts by layer: SDK, tool adapter, orchestrator, subagent/workflow, model-generated repeat.
4. Compute retry amplification factor = physical attempts / logical operations.
5. Classify each failure as transient, throttling, non-retryable, ambiguous, or application-specific.
6. Identify operations retried by more than one layer.
7. Record side-effecting operations and whether a stable idempotency key exists.
8. Record no-progress duplicate sequences and the longest sequence.
9. Produce a baseline for attempts, elapsed time, estimated retry tokens, recovery rate, and circuit candidates.

**Decisions:** Choose one retry owner per logical operation. Preserve lower-level SDK retries only when their scope is understood and bounded.  
**Constraints:** Do not disable provider/SDK safety mechanisms blindly. Do not infer success from lack of errors.  
**Expected output:** Baseline report with amplification hotspots and retry owners.  
**Metrics:** amplification factor, duplicate streak, retries/run, retry tokens/run, recovery rate.  
**Verification:** Recompute metrics from raw trace and confirm totals reconcile.  
**Failure handling:** If trace lacks layer or operation IDs, add instrumentation first; do not optimize from guesses.  
**Stop conditions:** Baseline reconciles and every high-volume retry path has an owner.

## Skill 2 — Logical Operation Fingerprinting

**Purpose:** Detect semantically repeated calls even when invocation IDs differ.  
**Trigger:** Model/harness creates new invocation IDs for equivalent retries.  
**Inputs:** Tool name, operation type, normalized arguments, resource identity, optional idempotency key.  
**Preconditions:** Sensitive values can be redacted before persistence.  
**Required context:** Fields that change semantics versus noise such as timestamps, trace IDs, generated request IDs.  
**Tools:** `scripts/retry_guard.py` fingerprint command.

### Procedure
1. Define canonical fields for each operation family.
2. Remove explicitly declared non-semantic fields only.
3. Canonically serialize with stable key ordering.
4. Hash the canonical representation.
5. Store fingerprint with result class and progress marker, not raw secrets.
6. Compare new attempts against the recent window.
7. Increment no-progress duplicate count only when fingerprint and material result are equivalent and no new progress marker appears.

**Decisions:** If argument normalization might change meaning, fail conservative and treat calls as distinct.  
**Constraints:** Never strip resource IDs, destinations, amounts, paths, branches, or other state-changing fields merely to increase deduplication.  
**Expected output:** Stable operation fingerprint and duplicate/no-progress classification.  
**Metrics:** duplicate detection rate, false-merge rate, false-split rate.  
**Verification:** Same semantic fixture hashes identically; materially different fixture hashes differently.  
**Failure handling:** Unknown operation schema uses full canonical arguments.  
**Stop conditions:** Fingerprinting behavior is deterministic across test fixtures.

## Skill 3 — Bounded Retry Decision

**Purpose:** Decide retry, fail-fast, wait, half-open probe, or escalate deterministically.  
**Trigger:** An operation fails or times out.  
**Inputs:** Error class, attempt history, elapsed time, token estimate, circuit state, idempotency status, progress marker.  
**Preconditions:** Policy loaded and operation fingerprint known.  
**Required context:** Whether the operation is side-effecting and whether the failure is ambiguous.  
**Tools:** `scripts/retry_guard.py decide`.

### Procedure
1. Reject retry immediately for configured non-retryable classes.
2. For side-effecting operations, require a stable idempotency key before automatic retry.
3. Check per-operation attempt, elapsed-time, token, and no-progress budgets.
4. Check global run retry budget.
5. If any budget is exhausted, open the circuit.
6. If retryable, compute capped exponential backoff with full jitter.
7. Persist the decision before sleeping/retrying.
8. After OPEN cooldown or explicit recovery evidence, allow at most the configured HALF_OPEN probe count.
9. Close only after a successful probe with observable progress.

**Decisions:** Ambiguous errors on non-idempotent side effects require human approval rather than automatic retry.  
**Constraints:** Never reset counters by spawning a new subagent or session for the same logical operation.  
**Expected output:** `retry`, `fail_fast`, `open_circuit`, `half_open_probe`, or `human_approval_required` with reason code.  
**Metrics:** stopped retry storms, transient recovery rate, mean attempts to recovery, false-open rate.  
**Verification:** Policy boundary tests pass.  
**Failure handling:** Missing policy or corrupt state fails closed for automatic retry.  
**Stop conditions:** One deterministic decision is emitted.

## Skill 4 — Progress-Aware Watchdog Recovery

**Purpose:** Prevent watchdogs from killing long-running but actively progressing subagents.  
**Trigger:** Workflow/subagent approaches stall timeout.  
**Inputs:** Last progress timestamp, checkpoint ID, tool-result events, child status.  
**Preconditions:** Progress events are host-visible and cannot be fabricated solely from prose claims.  
**Required context:** What constitutes material progress for the task.  
**Tools:** Runtime event stream and retry guard state.

### Procedure
1. Define material progress signals: new file/commit/artifact, completed setup phase, test phase transition, fresh tool result, or host-confirmed checkpoint.
2. Measure time since material progress rather than time since spawn only.
3. If progress is fresh, extend the watchdog within the total run budget.
4. If no progress exceeds grace, capture checkpoint/state before termination where possible.
5. Restart only if retry budget allows and resume from checkpoint.
6. If the same checkpoint/fingerprint fails repeatedly, open the circuit rather than restart from zero.

**Decisions:** Time alone is insufficient to declare a stall when host-visible progress is continuing.  
**Constraints:** Extensions remain bounded by total runtime and retry budgets.  
**Expected output:** continue, checkpoint-and-restart, or stop/escalate.  
**Metrics:** restart-from-zero count, checkpoint reuse rate, productive-work loss, watchdog false-positive rate.  
**Verification:** Long-running progress fixture is not killed; stagnant fixture opens circuit after bounds.  
**Failure handling:** Missing progress telemetry uses conservative timeout and no unlimited extension.  
**Stop conditions:** Work progresses, resumes safely, or terminates with explicit evidence.