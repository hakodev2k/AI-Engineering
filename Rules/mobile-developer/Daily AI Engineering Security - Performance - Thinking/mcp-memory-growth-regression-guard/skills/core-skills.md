# Core Skills

## Skill 1 — Establish a Heap-Growth Baseline

**Purpose:** Determine whether the target MCP workload reaches a stable post-GC heap plateau before changing code.

**Trigger:** Memory alerts, OOM restarts, SDK upgrades, MCP handler/validator changes, or a new long-running deployment.

**Inputs:** workload command, operation count, warm-up count, sampling interval, policy thresholds.

**Preconditions:** representative test environment; same Node version and SDK version for before/after comparisons; `--expose-gc` when policy requires it.

**Required context:** target process lifecycle, expected concurrency, tool count, catalog refresh frequency, container memory limit.

**Tools:** `scripts/memory-slope-check.mjs`, process metrics, optional heap snapshots.

**Procedure:**
1. Record Node, SDK, OS, workload, concurrency, tool count, and schema count.
2. Warm up without scoring until configured warm-up operations complete.
3. Force GC at each sample point when available.
4. Capture `heapUsed`, RSS, external memory, operation count, elapsed time, and latency.
5. Calculate post-warm-up linear slope in bytes/operation and MB/1k operations.
6. Compare total growth and slope with `config/policy.json`.
7. Repeat the run at least once if the first run fails, up to `max_retries`; do not average away a reproducible failure.

**Decisions:** A positive slope alone is not proof of a leak. Fail only when configured thresholds are exceeded or the process crashes/OOMs. Treat RSS-only growth separately from post-GC heap growth.

**Constraints:** Do not compare cold-start samples with warmed samples. Do not claim improvement from task-manager screenshots alone.

**Expected output:** JSON report containing samples, slope, total growth, pass/fail, workload metadata, throughput, and p95 latency.

**Metrics:** MB/1k ops, total post-GC MB growth, p95 latency, ops/s.

**Verification:** Same workload and thresholds reproduce the classification.

**Failure handling:** If GC is required but unavailable, fail the measurement rather than silently using noisy heap samples.

**Stop conditions:** Threshold failure is reproducible, stable plateau is demonstrated, or environment invalidates the experiment.

---

## Skill 2 — Diagnose Retention Path

**Purpose:** Convert a measured growth regression into an evidence-backed root-cause hypothesis.

**Trigger:** Baseline exceeds the configured memory-growth threshold.

**Inputs:** baseline report, target code path, SDK version, tool schemas, server/session construction pattern.

**Preconditions:** Reproducible workload exists.

**Required context:** whether workload is dominated by `tools/list`, `callTool`, stateless HTTP requests, reconnects, or mixed traffic.

**Tools:** `scripts/schema-cache-probe.mjs`, Node active-handle inspection, heap snapshots, source inspection.

**Procedure:**
1. Split workload into the smallest independently repeatable path: catalog refresh versus request lifecycle.
2. If catalog refresh grows, fingerprint output schemas and count unchanged schema generations.
3. Test whether stable `$id` values or a controlled validator provider change the slope; treat this as diagnosis, not automatically as production fix.
4. If request handling grows, compare fresh-server and reused-server variants while preserving transport correctness.
5. Inspect listener/callback/active-handle counts at fixed operation intervals.
6. Capture heap snapshots only after the workload proves growth; compare dominant retaining paths.
7. Record Facts, Hypotheses, Experiment, Result, and Confidence. Reject hypotheses contradicted by measurement.

**Decisions:** Prefer the smallest change that removes the measured retaining path without violating concurrency or protocol correctness.

**Constraints:** Never reuse mutable protocol/server state across concurrent transports merely to lower allocations unless correctness is verified.

**Expected output:** ranked retention hypotheses with evidence and a selected mitigation experiment.

**Metrics:** schema fingerprints/compilations, callback/listener growth, active handles, retained-object classes, heap slope.

**Verification:** Selected hypothesis predicts a measurable change under an isolated experiment.

**Failure handling:** If no hypothesis changes the slope after two bounded experiments, escalate to heap-snapshot/source-level investigation.

**Stop conditions:** A root cause is supported by before/after evidence or bounded experiments are exhausted.

---

## Skill 3 — Verify a Memory Fix Without Hiding Regressions

**Purpose:** Prove that a mitigation removes memory growth while preserving throughput, latency, validation, and transport correctness.

**Trigger:** Any SDK patch, cache, server lifecycle change, restart/recycle policy, or validator substitution intended to reduce memory.

**Inputs:** baseline workload/report, candidate change, policy.

**Preconditions:** Baseline is archived and reproducible.

**Procedure:**
1. Run correctness tests first.
2. Run the exact baseline workload with identical operation count and concurrency.
3. Compare heap slope and total post-GC growth.
4. Compare p95 latency and throughput against allowed regression percentages.
5. Exercise schema mutation/catalog replacement if validator caching changed.
6. Exercise concurrent requests if server lifecycle changed.
7. Run a longer soak when the short gate passes.
8. Mark status separately as Implemented, Measured, and Verified.

**Expected output:** comparison report with memory and service-level deltas plus verdict.

**Verification:** Pass requires memory thresholds and non-memory regression thresholds to pass.

**Failure handling:** Revert or redesign if memory improves by weakening validation, corrupting sessions, or causing excessive latency.

**Stop conditions:** All Definition-of-Done gates pass or a blocking correctness/performance regression remains.
