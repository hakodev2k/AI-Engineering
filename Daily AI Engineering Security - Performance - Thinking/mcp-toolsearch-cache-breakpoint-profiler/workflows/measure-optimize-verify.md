# Workflow: Measure, Optimize, Verify
**Trigger:** MCP/tool-discovery latency or token regression.  
**Goal:** find a measured cache breakpoint and verify a bounded optimization.

## Inputs
Baseline workload, JSONL telemetry, tool-coverage requirements.

## Baseline
Run the representative workload without changes and record cache-read/cache-creation tokens, input tokens, p50/p95 latency and discovery batch sizes.

## Stages
1. Observe discovery events and request boundaries.
2. Measure baseline with `cache_breakpoint_profiler.py`.
3. Diagnose suspicious batch sizes and serialization changes.
4. Form one hypothesis: bounded batch size or stable ordering will reduce cache rebuild cost.
5. Implement one change.
6. Run equivalent workload again.
7. Compare metrics and tool correctness.
8. If not improved, revise once; otherwise verify independently.

## Responsible agent
Performance investigator implements; benchmark reviewer verifies.

## Tools
Trace collector, profiler script, workload tests.

## Outputs
Baseline, hypothesis, before/after metrics, decision, verification status.

## Checkpoints
After baseline; before change; after candidate run; before final acceptance.

## Metrics
Cache-read ratio, cache-creation/input ratio, p50/p95 latency, input tokens/request, discovery batch size, tool-coverage pass rate.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Stop on correctness regression, insufficient telemetry, verified improvement, or exhausted attempts.

## Failure path
Revert optimization and preserve baseline behavior.

## Verification
Independent rerun with equivalent workload; no improvement claim without measured evidence.

## Definition of Done
Before/after comparison complete, required tools remain available, metrics improve materially, regression tests pass.
