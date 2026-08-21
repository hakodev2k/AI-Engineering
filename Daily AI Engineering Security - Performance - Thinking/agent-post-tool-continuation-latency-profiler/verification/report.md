# Verification Report

## Scope
This report verifies the package design and defines production verification criteria for the Agent Post-Tool Continuation Latency Profiler.

## Implemented
- Five-phase tool-cycle timing contract.
- Deterministic JSON/JSONL parser and latency profiler.
- Per-cycle metrics and p50/p95/p99 summaries.
- Per-tool grouping.
- Explicit incomplete/non-monotonic event rejection.
- Continuation/tool dominance ratio.
- Absolute latency budgets and before/after regression gate.
- Minimum sample requirement.
- Bounded diagnosis/optimization workflows.
- Security/correctness-preserving rules.
- Regression tests for phase calculations, missing phase handling, non-monotonic timestamps, duplicate phases, and percentile calculation.

## Measured
The included sample fixture contains two complete cycles and is intended only as a format demonstration, not as a production performance baseline. Production performance improvement is therefore **not claimed by this package itself**.

The profiler derives these measurable quantities from timestamps:
- `tool_runtime_ms = tool_end - tool_start`;
- `result_ingestion_ms = result_ingested - tool_end`;
- `continuation_gap_ms = next_model_start - tool_end`;
- `model_continuation_ms = next_agent_action - next_model_start`;
- `tool_cycle_ms = next_agent_action - tool_start`.

## Verified design properties
- Missing phases are failures/incomplete cycles rather than zero duration.
- Phase timestamps must be monotonic.
- Duplicate phase records are reported as errors.
- Regression gate can check both fixed budgets and baseline-relative change.
- Benchmark policy forbids disabling security controls or using destructive probes.
- Workflows cap diagnosis experiments and optimization attempts.
- High-impact implementation and verification roles are separated.

## Required runtime verification
An integration is Verified only when all of the following are true:
1. At least the configured minimum number of representative baseline cycles is captured.
2. Every gated cycle has all required timestamps.
3. The current workload is comparable to baseline.
4. `trace_latency_profiler.py` exits 0.
5. `latency_regression_gate.py` exits 0 against the intended policy/baseline.
6. The target phase improves or remains within declared budget.
7. Adjacent phases do not materially regress.
8. Product correctness tests pass.
9. Sandbox, permission, approval, validation, and security configuration remain equivalent to baseline.
10. Independent verification is complete for high-impact runtime changes.

## Recommended package self-test
From the package root:

```bash
python -m unittest tests/test_latency_profiler.py
python scripts/trace_latency_profiler.py examples/sample-events.jsonl --output sample-summary.json
```

For the sample, the second cycle should show continuation dominating actual tool runtime, demonstrating the classifier's intended diagnostic use.

## Failure handling
- Exit 2 from the profiler: repair missing/invalid instrumentation.
- Exit 3 from the profiler/gate: repair input or policy data.
- Regression failure: preserve baseline/current summaries and reject the performance claim.
- External/provider-owned dominant phase: escalate with trace IDs and exact timestamps.
- Retry budget exhausted: stop optimization attempts and return to diagnosis.

## Definition of Done
The package is ready for integration when every documented file exists, scripts are referenced consistently, policy/schema assumptions match the implementation, and the self-test commands are available. A target runtime is performance-verified only after the runtime verification criteria above pass.