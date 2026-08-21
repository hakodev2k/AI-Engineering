# Workflows

## Workflow 1 — Baseline → Diagnose → Guard → Measure

**Trigger:** Excessive retry latency, token/cost spike, repeated tool calls, or new runtime integration.  
**Goal:** Reduce retry amplification while preserving recovery from genuine transient failures.  
**Inputs:** Representative trace, retry policy, operation taxonomy, side-effect classification.  
**Baseline:** Physical attempts, logical operations, amplification factor, retry tokens, retry elapsed time, recovery rate, restart count.  
**Context:** Existing SDK retries, orchestrator retries, workflow watchdogs, and model-generated repeat behavior.

### Stages
1. **Observe** — Retry Evidence Analyst captures trace and baseline.
2. **Diagnose** — classify retry layers, failure classes, duplicate sequences, and side effects.
3. **Hypothesize** — Reliability Planner identifies the smallest ownership/budget change likely to remove amplification.
4. **Implement** — Implementation Agent wires fingerprints, persistent counters, backoff, circuit state, and checkpoint reuse.
5. **Measure** — rerun controlled fixtures and representative failures.
6. **Compare** — require measurable reduction in no-progress attempts without lower transient recovery rate beyond accepted tolerance.
7. **Verify** — Independent Verification Agent validates results.

**Responsible agents:** Evidence Analyst → Planner → Implementation → Independent Verification.  
**Tools:** `analyze_retry_trace.py`, `retry_guard.py`, tests, runtime telemetry.  
**Outputs:** baseline report, policy, guarded trace, comparison report.  
**Checkpoints:** after baseline, before deployment, after fixture tests, after canary measurement.  
**Metrics:** amplification factor, retry tokens, wall time, tool/model calls, recovery rate, circuit opens, false opens.  
**Retry policy:** At most 2 implementation-remediation cycles; each must address named failing metrics/tests.  
**Stop conditions:** Verification passes; or 2 remediation cycles fail; or safety/idempotency ambiguity remains.  
**Failure path:** Roll back policy/integration, preserve traces, report blocker.  
**Verification:** Independent comparison against baseline.  
**Definition of Done:** Guard is enforced, budgets are observable, fixture tests pass, and measured canary shows no blocking regression.

## Workflow 2 — Per-Operation Failure Decision

**Trigger:** Tool/API/subagent operation fails or times out.  
**Goal:** Decide safely whether another physical attempt is justified.  
**Inputs:** Operation fingerprint, failure class, retry state, progress marker, idempotency key, token/time counters.  
**Baseline:** Current attempts and cumulative budgets.

### Stages
1. Canonicalize operation and fingerprint it.
2. Determine retry owner; if current layer is not owner, return failure upward without retry.
3. Classify failure.
4. Non-retryable → fail fast.
5. Side-effecting + ambiguous outcome + no stable idempotency key → require human approval.
6. Check duplicate/no-progress streak and all budgets.
7. Exhausted → OPEN circuit.
8. Retryable and within budget → compute jittered delay and persist decision.
9. Execute once.
10. Success/progress → reset duplicate streak and close circuit when appropriate; failure → repeat from stage 3.

**Tools:** `retry_guard.py`.  
**Outputs:** decision JSON and updated state.  
**Checkpoints:** state persisted before each retry.  
**Metrics:** attempt count, duplicate streak, cumulative elapsed time/tokens.  
**Retry policy:** Bound by policy; never more than configured maximum.  
**Stop conditions:** success, fail-fast, circuit open, or human approval required.  
**Failure path:** Corrupt/missing state disables automatic retry.  
**Verification:** Decision reason and counters must reconcile with trace.  
**Definition of Done:** Exactly one terminal/next-step decision exists.

## Workflow 3 — Watchdog Stall vs Progress

**Trigger:** Child workflow approaches stall timeout.  
**Goal:** Avoid both infinite stalls and destructive restart loops.  
**Inputs:** Last material progress time, checkpoint, child events, total run budget.  
**Baseline:** Current child duration, restarts, and progress cadence.

### Stages
1. Read host-visible progress events.
2. Fresh progress within grace → continue, bounded by total run budget.
3. No progress → request checkpoint/state capture.
4. If safe checkpoint exists and retry budget remains → restart from checkpoint once.
5. If same checkpoint/failure fingerprint repeats, count as no-progress duplicate.
6. Open circuit when duplicate/restart budget is exhausted.

**Responsible agent:** Orchestrator; verifier reviews behavior.  
**Tools:** runtime event stream and guard state.  
**Outputs:** continue/restart/stop decision.  
**Retry policy:** At most policy-defined attempts; restart never resets parent budget.  
**Stop conditions:** child completes, continues with fresh progress, or circuit opens.  
**Failure path:** Missing telemetry uses conservative stop, not unlimited extension.  
**Verification:** Test both active-progress and true-stall fixtures.  
**Definition of Done:** No restart-from-zero storm and no unbounded watchdog extension.

## Workflow 4 — Circuit Recovery

**Trigger:** Dependency or operation circuit is OPEN and recovery evidence appears or cooldown expires.  
**Goal:** Restore service without immediately recreating the storm.  
**Stages:** OPEN → wait for cooldown/recovery signal → HALF_OPEN → allow at most configured probe(s) → successful progress closes circuit; failure reopens.  
**Retry policy:** One half-open probe by default.  
**Stop conditions:** CLOSED after verified success or OPEN after failed probe.  
**Failure path:** Manual review when operation has destructive side effects or repeated false recovery signals.