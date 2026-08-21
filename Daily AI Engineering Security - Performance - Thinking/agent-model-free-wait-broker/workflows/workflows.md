# Workflows

## Workflow A — Baseline → Diagnose → Broker → Re-measure

**Trigger:** repeated wait/status calls or long-running tasks.

**Goal:** remove inference from passive waiting without degrading responsiveness.

**Inputs:** representative traces, target provider API, policy.

**Baseline:** wait-only model turns/tokens, polls per target, detection lag, invalid target count.

**Stages:**
1. **Observe** — Performance Investigator captures representative traces.
2. **Baseline** — classify wait-only turns and quantify current cost.
3. **Cause** — identify whether fixed timeout, missing event integration, invalid target, or noisy progress drives re-entry.
4. **Hypothesis** — define broker behavior and expected reduction/SLA.
5. **Implement** — Runtime Implementer adds target validation, event subscription or host-side polling/backoff, wake rules, cancellation and metrics.
6. **Measure** — replay same fixture set.
7. **Better?** — require target reduction and SLA compliance.
8. **Verify** — Independent Verification Agent checks tests and traces.

**Checkpoints:** baseline stored; policy reviewed; tests pass; canary metrics collected.

**Metrics:** wait-only model turns/tokens, host polls, wake count, detection lag, broker errors.

**Retry policy:** at most 2 tuning iterations. Each iteration changes one policy dimension when practical.

**Stop conditions:** gates pass; two iterations fail; missed terminal event; cancellation regression; provider cannot expose stable state.

**Failure path:** rollback broker policy, retain metrics, escalate provider/state semantics.

**Definition of Done:** before/after evidence, zero missed terminal events in fixtures, ≥80% wait-only inference reduction for qualifying cases, SLA met, independent verification complete.

---

## Workflow B — Runtime Wait Lifecycle

**Trigger:** model/runtime launches a long-running target and reaches a dependency boundary.

**Goal:** resume reasoning only when new information exists.

**Stages:**
1. Validate target ID and provider.
2. Read initial state.
3. If terminal: emit wake immediately.
4. Register event subscription if supported; otherwise start adaptive host polling.
5. On unchanged state: record poll, back off, do not re-enter model.
6. On material progress: emit one progress wake according to threshold/coalescing policy.
7. On completed/failed/cancelled: emit terminal wake exactly once.
8. On user input: interrupt waiting and hand control back.
9. On deadline/provider error threshold: emit explicit broker/deadline wake.

**Responsible agent:** runtime, not LLM, during steps 2–7 unless a wake condition fires.

**Outputs:** compact wake event containing target, previous/current state, progress delta, elapsed time, wake reason.

**Retry policy:** provider read errors: maximum 3 retries with backoff. No LLM retry loop.

**Stop conditions:** wake event or maximum wait.

**Verification:** each logical target produces at most one terminal wake and no unchanged-state model turns.

---

## Workflow C — Release Regression Gate

**Trigger:** changes to wait handling, subagent lifecycle, process runner, or model orchestration.

**Goal:** prevent polling regressions.

**Stages:** run unit fixtures → replay representative traces → compare before/after → canary → independent review.

**Release blockers:** wait-only model turn ratio regresses above threshold; terminal event missed; invalid target loops; detection SLA exceeded; broker errors hidden.

**Retry policy:** one fix/retest cycle per release candidate; after that block release pending explicit owner review.