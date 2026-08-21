# Skill — MCP Lifecycle Benchmark and Diagnosis

## Purpose
Measure and diagnose server-factory allocation, retained lifecycle state, and teardown failures before making performance changes.

## Trigger
MCP SDK upgrade, memory/CPU regression, request-factory refactor, suspected server reuse, shutdown stack overflow, or optimization proposal for stateless serving.

## Inputs
Serving code, SDK version, representative request fixture, concurrency target, baseline metrics, heap samples, server-instance IDs, and teardown logs.

## Preconditions
A repeatable non-production benchmark environment and permission to instrument request factories.

## Required context
Identify stateless versus sessionful behavior, where server objects are constructed, which dependencies are safe to share, and the expected lifecycle documented by the SDK version.

## Allowed tools
Source inspection, Node/Python test harnesses, process memory metrics, request timing, heap snapshots where available, logs, and local/container load generation.

## Constraints
Do not reuse protocol-bearing objects solely to improve benchmarks. Do not change security/session isolation. Keep workload, hardware limits, Node flags, concurrency, and warmup consistent across comparisons.

## Procedure
1. Read current serving documentation and record required server/transport lifetime.
2. Instrument each request with a stable test-only `server_id` representing object identity.
3. Capture at least the configured warmup plus measured-request count.
4. Sample heap repeatedly, not only at process start/end.
5. Record latency and success/failure for each sample or interval.
6. Always execute handler/server teardown after load and capture async failures for a bounded observation window.
7. Analyze metrics with `scripts/analyze_lifecycle.py`.
8. If duplicate identities exist, integrate `scripts/fresh_factory_guard.mjs` or equivalent fail-fast logic.
9. If fresh construction is expensive, move only reusable dependencies outside the factory; keep the server/protocol instance fresh.
10. Rerun the exact benchmark, compare p95/heap/error/teardown results, and retain both evidence sets.
11. Hand off to the independent verifier.

## Decision points
- Duplicate server identity: fix lifecycle first; do not optimize around it.
- High construction cost with unique servers: profile factory internals and share safe pools/caches/configuration.
- Heap slope remains high after safe sharing: obtain heap snapshots and identify retained owners before another change.
- Failure appears only at teardown: treat it as a blocking lifecycle regression, not a benchmark artifact.

## Expected output
Baseline and after JSONL, analyzer reports, hypothesis, implementation delta, teardown evidence, and verification status.

## Metrics
Heap MB/1k requests, p95 latency, throughput/duration, error rate, duplicate instance count, teardown status.

## Verification
A separate agent reruns or inspects the benchmark, confirms comparable workload, validates lifecycle assumptions, and checks that performance work did not weaken isolation.

## Failure handling
Retain failing metrics and logs. Maximum two benchmark reruns for suspected noise; a rerun does not erase earlier failure evidence. Escalate persistent nondeterminism or production-only failures.

## Stop conditions
Success when thresholds pass with clean teardown and independent verification. Stop after two failed correction cycles or if the proposed optimization requires unsafe object reuse.