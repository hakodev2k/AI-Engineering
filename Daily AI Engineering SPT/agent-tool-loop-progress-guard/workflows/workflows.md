# Workflows

## Workflow A — Baseline → Diagnose → Guard → Measure

**Trigger:** Tool-call count, task latency, or loop incidents exceed expected range.

**Goal:** Reduce redundant tool execution without reducing completion quality.

**Inputs:** Representative traces, tool registry, policy defaults, success criteria.

**Baseline:** Record calls/task, repeated-call ratio, no-novelty ratio, elapsed tool time, task completion, token estimate.

**Context:** Agent runtime, tool semantics, phase boundaries, external service limits.

### Stages
1. **Collect baseline** — Trace Analyst.
2. **Group call families** — exact and strategy fingerprints.
3. **Diagnose loop class** — successful-no-novelty, repeated failure, invalid strategy retry, polling, or legitimate progressive exploration.
4. **Form policy hypothesis** — Policy Designer selects thresholds/normalization.
5. **Replay fixtures** — verify expected allow/warn/block decisions.
6. **Integrate guard** — Implementation Agent.
7. **Measure again** — paired replay or controlled benchmark.
8. **Independent verification** — Verification Agent.

**Tools:** `analyze_trace.py`, `tool_loop_guard.py`, unit tests, benchmark traces.

**Outputs:** baseline report, policy, guarded trace, comparison report.

**Checkpoints:** after baseline, policy approval, integration test, benchmark.

**Metrics:** duplicate calls avoided, total calls, elapsed time, completion rate, false blocks.

**Retry policy:** One policy-tuning retry if quality regression is detected; a second failure escalates for human review.

**Stop conditions:** verified improvement; no measurable loop problem; or guard causes unacceptable task-quality regression.

**Failure path:** revert policy version; preserve baseline and failed benchmark evidence.

**Verification:** Guarded benchmark must show measured improvement and satisfy completion/false-block thresholds.

**Definition of Done:** baseline and guarded metrics exist, no unsafe auto-retry path exists, policy is versioned, fixtures pass.

---

## Workflow B — Per-Call Progress Gate

**Trigger:** Immediately before each tool invocation.

**Goal:** Prevent non-progress repetition while allowing legitimate work.

**Inputs:** candidate call, phase, tool class, recent history, budgets.

**Baseline:** Current exact/family repetition counters and evidence coverage.

### Stages
1. Canonicalize candidate.
2. Compute exact and strategy fingerprints.
3. Load recent matching calls.
4. Inspect prior statuses and output digests.
5. Check phase/global budget.
6. Check polling/explicit exception.
7. Return decision:
   - `allow`
   - `warn`
   - `require-strategy-change`
   - `block`
   - `verify-before-retry`
8. If executed, update history with result digest and elapsed time.

**Responsible agent:** Orchestrator invokes host-side guard; model does not own the final decision.

**Outputs:** decision event and, after execution, result event.

**Checkpoints:** warning threshold and hard threshold.

**Metrics:** decision counts and calls avoided.

**Retry policy:** No immediate retry after `block`; `require-strategy-change` requires a different strategy fingerprint. Ambiguous side-effect failure requires postcondition verification.

**Stop conditions:** candidate allowed, blocked, or escalated.

**Failure path:** malformed policy fails closed for risky/side-effecting tools; optionally allow-with-warning for explicitly configured read-only tools.

**Definition of Done:** every attempted call produces an auditable guard decision.

---

## Workflow C — Loop Recovery

**Trigger:** `require-strategy-change` or `block`.

**Goal:** Preserve useful evidence and make one bounded attempt to continue with a materially different strategy.

**Inputs:** task goal, call history, loop family, evidence targets, remaining budget.

### Stages
1. Freeze the repeated family counter.
2. Build recovery packet: observed facts, outputs, failures, unresolved targets, reason for stop.
3. Choose one alternative: synthesize, narrow search, switch source/tool, proceed to implementation, run verification, or escalate.
4. Record a strategy-change marker.
5. Start recovery budget at configured maximum.
6. Verify next candidate differs materially.
7. If a second loop occurs in recovery, stop/escalate.

**Checkpoints:** recovery packet before continuation; strategy-change verification before next call.

**Metrics:** recovery success rate, recurrence rate, calls after recovery.

**Retry policy:** Maximum one recovery cycle by default.

**Stop conditions:** task completes, human input required, recovery budget exhausted, or second loop detected.

**Failure path:** return preserved evidence and blocking reason rather than discarding state.

**Definition of Done:** recovery either advances to new evidence/phase or terminates with explicit evidence-backed reason.

---

## Workflow D — Safe Retry After Ambiguous Tool Failure

**Trigger:** Timeout/transport error after dispatch where a side effect may have occurred.

**Goal:** Avoid duplicate external actions.

**Inputs:** tool class, idempotency key if any, requested effect, postcondition query capability.

### Stages
1. Mark result `ambiguous` rather than `failed`.
2. Do not replay.
3. Query postcondition using a read-only verification method when available.
4. If effect exists, record success/partial state without retry.
5. If effect definitely does not exist and retry is safe/idempotent, permit one retry.
6. Otherwise require human approval or stop.

**Metrics:** ambiguous failures, duplicate actions prevented, verified-before-retry count.

**Retry policy:** At most one verified-safe retry unless tool-specific policy is stricter.

**Definition of Done:** outcome is externally verified or explicitly escalated.