# Skill: Prefix Cache Baseline
## Purpose
Measure whether a local inference stack reuses long prompt prefixes correctly and efficiently.
## Trigger
Engine/model upgrade, rising TTFT, agent history growth, cache implementation change, or new hybrid architecture.
## Inputs
Cold/repeat/growing-prefix traces with input, reusable-prefix, cached-token, TTFT and equivalence fields.
## Preconditions
Same model, sampling parameters, hardware and concurrency for comparisons.
## Required context
Serving configuration and observable metrics only.
## Allowed tools
Profiler, server logs/metrics, deterministic output comparator, benchmark harness.
## Constraints
MUST establish baseline before optimization. MUST NOT accept speedup when equivalence fails.
## Procedure
1. Capture cold baseline.
2. Repeat identical prompt.
3. Run 3+ append-only growing turns.
4. Record reusable and cached tokens plus TTFT.
5. Run profiler.
6. Diagnose miss/correctness path.
7. Form one measurable hypothesis.
8. Implement and repeat identical workload.
9. Independently verify equivalence and metrics.
## Decision points
Fail on output mismatch, excessive refill, poor cache coverage, or TTFT slope regression.
## Expected output
Baseline, diagnosis, hypothesis, before/after metrics, verification status.
## Metrics
Cache-read ratio, full-refill rate, TTFT p50/p95 and slope, equivalence failures.
## Verification
Independent benchmark verifier repeats the workload.
## Failure handling
Maximum two hypotheses; fallback to safe recomputation.
## Stop conditions
No baseline, output mismatch, cache corruption, or retry exhaustion.
