# Skill — Permission-Path Baseline

## Purpose
Measure where tool-call wall time is spent before attempting optimization.

## Trigger
Slow or stalled tool execution, permission/classifier incidents, permission-mode changes, or performance regression investigation.

## Inputs
JSONL events containing timestamp, operation/tool identifier, and phase event names documented in this package.

## Preconditions
Use a representative workload and preserve existing security configuration during baseline measurement.

## Required context
Trace data, runtime version, permission mode, configured timeout/budget, workload identifier, and whether manual approval is expected.

## Allowed tools
Read-only trace collection and `scripts/analyze_permission_trace.py`.

## Constraints
Never disable sandbox/approval/classification to obtain a faster baseline. Do not include secrets in trace payloads.

## Procedure
1. Capture at least 20 tool operations or all operations from a representative failing session if fewer.
2. Record runtime/model/permission configuration and workload.
3. Run the analyzer with the configured classifier and dispatch-gap budgets.
4. Separate classifier wait, post-classifier dispatch gap, manual approval wait, and actual execution.
5. Calculate p50/p95/p99 for classifier and tool execution where sample size permits.
6. Identify timeout violations and identical error retries.
7. Form one evidence-backed hypothesis about the largest avoidable latency component.
8. Make one bounded change: instrumentation fix, timeout enforcement, retry ownership, deterministic policy routing, or manual-fallback path.
9. Re-run the same workload and analyzer.
10. Accept improvement only if security controls are unchanged/stronger and task success does not regress.

## Decision points
- Classifier slow, tool fast: optimize classifier path, not tool implementation.
- Classifier ends quickly but dispatch stalls: inspect state/channel/dispatcher handoff.
- Deterministic request construction failure: stop retrying; fix request generation.
- Capacity/unavailability: bounded retry, then safe fallback.
- Manual approval expected: report approval wait separately; do not call it classifier regression.

## Expected output
Baseline metrics, dominant latency component, hypothesis, post-change comparison, security-preservation statement.

## Metrics
Classifier p50/p95/p99, dispatch-gap p95, execution p95, permission-path share, retries/action, SLO violation rate, task success.

## Verification
A second reviewer or benchmark agent compares before/after traces and confirms no permission bypass was introduced.

## Failure handling
Malformed traces block measurement claims. Insufficient samples may support incident diagnosis but not broad percentile claims.

## Stop conditions
Improvement is measured and independently verified; two optimization attempts fail; evidence points to an external dependency with no safe local change; or any proposed change would weaken security.