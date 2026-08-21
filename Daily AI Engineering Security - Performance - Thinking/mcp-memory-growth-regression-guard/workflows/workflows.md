# Workflows

## Workflow A — Detect and Classify Memory Growth

**Trigger:** SDK upgrade, memory alert, OOM restart, or lifecycle/validator change.

**Goal:** Decide whether the MCP process reaches a safe memory plateau under a representative workload.

**Inputs:** command/service endpoint, policy, operation workload.

**Baseline:** warm-up first, then collect at least `minimum_samples` post-GC measurements.

**Context:** runtime/SDK versions, tool/schema counts, concurrency and memory limit.

**Stages:**
1. Preflight metadata validation — Performance Investigator.
2. Warm-up — benchmark harness.
3. Measure fixed-interval samples — benchmark harness.
4. Calculate heap slope and total growth — `memory-slope-check.mjs`.
5. Gate against policy.
6. If failed, split workload into catalog-refresh and request-lifecycle paths.
7. Form at most two diagnosis hypotheses.

**Tools:** scripts, Node process metrics, optional heap snapshots.

**Outputs:** baseline JSON and pass/fail classification.

**Checkpoints:** after warm-up; after minimum sample count; after first threshold breach.

**Metrics:** MB/1k ops, total growth MB, p95 latency, throughput, OOM/crash.

**Retry policy:** maximum two reruns for environmental noise; a reproducible failure is not retried away.

**Stop conditions:** pass, reproducible fail with narrowed path, or invalid measurement environment.

**Failure path:** if GC is mandatory and unavailable, stop with invalid-baseline status.

**Verification:** second run agrees with classification within reasonable measurement variance.

**Definition of Done:** baseline artifact exists and the memory behavior is classified using explicit thresholds.

---

## Workflow B — Diagnose → Hypothesize → Optimize → Measure Again

**Trigger:** Workflow A fails.

**Goal:** Identify and mitigate the retaining path without creating protocol or latency regressions.

**Stages:**
1. **Observe:** choose the smallest failing path.
2. **Cause:** inspect schema fingerprints, validator compilation behavior, server construction/reuse, callbacks/listeners and active handles.
3. **Hypothesis:** write one falsifiable change prediction.
4. **Implement:** Implementation Agent applies one bounded change.
5. **Measure:** exact baseline workload is repeated.
6. **Better?** If no, revert/re-evaluate. Maximum two hypotheses.
7. **Verify:** Verification Agent runs correctness + performance gates independently.

**Outputs:** hypothesis log, candidate delta, comparison report.

**Checkpoints:** before code change; after correctness tests; after post-GC slope calculation.

**Metrics:** same as baseline plus listener/handle/schema compilation signals.

**Retry policy:** two hypotheses maximum per run.

**Stop conditions:** verified improvement, correctness regression, or hypothesis budget exhausted.

**Failure path:** retain evidence, revert unsafe candidate, escalate with heap snapshots/source analysis.

**Definition of Done:** memory gate passes, validation/session correctness passes, p95 and throughput remain inside policy.

---

## Workflow C — CI Regression Gate

**Trigger:** MCP SDK upgrade or change touching handlers, transports, validators, tool-list refresh, reconnect/session cleanup.

**Goal:** prevent a memory-growth regression from merging.

**Stages:** install dependencies → launch representative workload with `node --expose-gc` → produce sample JSON → run slope checker → run correctness suite → archive report.

**Retry policy:** one automatic retry only for infrastructure failure; threshold failure is final.

**Stop conditions:** all gates pass or any memory/correctness/service-level gate fails.

**Definition of Done:** report is attached to CI and exit code reflects policy verdict.
