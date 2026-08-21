# Workflows

## Workflow 1 — Observe → Baseline → Deduplicate → Verify

### Trigger
Unexpected context growth, frequent compaction, repeated rules/reminders/hooks, or rising tokens/task.

### Goal
Reduce repeated host-generated context without dropping current or correctness-critical information.

### Inputs
Representative event JSONL, policy, host source taxonomy, quality fixtures.

### Baseline
Capture tokens/task, tokens/turn, duplicate ratio, per-source contribution, context growth/turn, p50/p95 context-build latency, and compaction frequency.

### Stages
1. **Observe** — Context Profiler Agent captures a representative event stream.
2. **Baseline** — compute token and repeat metrics without suppression.
3. **Cause** — rank repeat producers by avoidable token volume.
4. **Hypothesis** — choose exact-dedup eligibility and stable logical keys for the largest safe producer.
5. **Implement** — Implementation Agent inserts admission guard before model-context serialization.
6. **Measure** — replay identical input through baseline and guarded paths.
7. **Better?** — require target token reduction or a documented source-specific target.
8. **Verify** — Independent Verification Agent confirms required context and changed versions remain present.
9. **Complete** — record Implemented, Measured, Verified separately.

### Responsible agents
Profiler → Policy → Implementation → Independent Verification.

### Tools
`context_injection_guard.py`, `context_metrics.py`, provider token counter where available, tests.

### Outputs
Baseline report, guarded decisions, comparison metrics, verification status.

### Checkpoints
- C1: source identity coverage = 100% for suppression candidates;
- C2: first occurrence and version changes are included;
- C3: required-context violations = 0;
- C4: token target reached or justified;
- C5: quality fixtures pass.

### Metrics
Tokens/task, suppressed tokens, duplicate ratio, changed-version inclusion rate, required-context retention, context-build latency, task-quality pass rate.

### Retry policy
Maximum 2 policy remediation loops. Each retry must change one documented hypothesis: source eligibility, logical key, freshness window, or normalization.

### Stop conditions
Stop successfully when C1–C5 pass. Stop unsuccessfully after two failed remediation attempts or immediately on safety/authz/user-context suppression.

### Failure path
Disable enforcement for the implicated source, preserve evidence, return to baseline behavior, and escalate with the exact failing fixture.

### Verification
Independent replay by an agent that did not implement the change.

### Definition of Done
Baseline captured; dominant repetition documented; guard implemented; required context retained; token comparison measured; quality tests pass; risks documented; no blocking issue remains.

---

## Workflow 2 — New Context Producer Onboarding

### Trigger
A host adds a new reminder, hook type, attachment, memory source, IDE event, or rule injector.

### Goal
Prevent new append-only producers from creating silent context amplification.

### Inputs
Producer schema, lifecycle semantics, replay requirements, sample events.

### Baseline
Measure first-occurrence size and expected update frequency.

### Stages
1. Define source name and stable logical key.
2. Decide whether content is state, event, user input, tool result, safety/authz data, or recovery information.
3. Default unknown/event-sensitive producers to `deduplicate=false`.
4. If state-like and replay-safe, create unchanged and changed-version fixtures.
5. Run observe-only admission decisions.
6. Measure duplicate ratio over a representative session.
7. Enable enforcement only if required-context tests pass.

### Checkpoints
Identity is stable; version changes are observable; ownership is documented; source has bounded token behavior.

### Retry policy
One classification revision is allowed before architecture review.

### Stop conditions
Stop if stable identity cannot be defined or if replay semantics are ambiguous; keep producer non-deduplicated.

### Failure path
Include all events and open an integration issue rather than guessing.

### Verification
A changed producer payload must be visible immediately on the next model turn.

### Definition of Done
Producer is explicitly classified, budgeted, tested, and observable.

---

## Workflow 3 — Production Regression Response

### Trigger
Quality regression, missing context, unexpected token spike, or duplicate ratio increase after rollout.

### Goal
Restore correctness first, then diagnose without unlimited experimentation.

### Inputs
Decision telemetry, failing session identifiers, policy version, reproducible fixture if available.

### Stages
1. Detect source/logical key implicated by the regression.
2. Switch that source to include-all behavior.
3. Reproduce on an offline fixture.
4. Determine whether root cause is key collision, unsafe normalization, stale-window semantics, or source misclassification.
5. Apply one fix and replay.
6. Independently verify.

### Retry policy
Maximum 2 fixes.

### Stop conditions
Stop immediately if user/safety/authz/current tool content was suppressed. Escalate after two failed fixes.

### Failure path
Keep the source non-deduplicated; do not weaken correctness criteria.

### Verification
Original failure fixture passes and the token metric remains acceptable after restoring correctness.

### Definition of Done
Correctness restored, root cause documented, regression test added, and enforcement decision explicitly re-approved.
