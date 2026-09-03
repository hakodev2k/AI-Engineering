# Workflow: Measure, Diagnose, Verify

## Trigger
Latency complaint, host upgrade, new tool integration, or observability change.

## Goal
Identify and improve the actual slow lifecycle phase with reproducible evidence.

## Inputs
Representative workload, lifecycle trace, policy, environment metadata.

## Baseline
Run the unchanged workload at least once and validate the trace before interpreting latency.

## Context
Record model, agent host/version, approval mode, machine/runtime and tool versions.

## Stages
1. **Observe** — capture lifecycle events and user-visible elapsed time.
2. **Measure baseline** — run the profiler; block if required events are absent.
3. **Diagnose** — rank model, approval, tool and residual host phases.
4. **Form hypothesis** — define one causal hypothesis and expected metric change.
5. **Implement improvement** — make the smallest change consistent with security/correctness.
6. **Measure again** — repeat equivalent workload and capture a new trace.
7. **Decision** — if target phase improves without prohibited regressions, continue; otherwise revert/re-evaluate.
8. **Verify** — Performance Verifier independently checks evidence.

## Responsible agent
Investigator owns stages 1–6. `subagents/performance-verifier.md` owns stage 8.

## Tools
`python scripts/lifecycle_profiler.py`, unit tests, host-native tracing/logging.

## Outputs
Baseline report, hypothesis, candidate report, before/after comparison, verifier verdict.

## Checkpoints
After baseline validation, after hypothesis selection, after candidate measurement, after independent verification.

## Metrics
Completeness, invalid-order events, model TTFT/duration, approval wait, tool duration, turn duration, residual.

## Retry policy
Maximum two optimization hypotheses per diagnosed phase. Each retry requires new evidence or a materially different hypothesis.

## Stop conditions
Stop on verified improvement, invalid/incomplete telemetry after two repair attempts, security regression, or two failed hypotheses.

## Failure path
Preserve baseline and failed evidence; revert unsafe/regressive changes; escalate unresolved attribution to a human/platform owner.

## Verification
Run `python -m unittest tests/test_lifecycle_profiler.py` and require an independent phase-metric comparison.

## Definition of Done
Baseline valid; bottleneck attributable; candidate measured; no blocking regression; independent verdict `verified`; evidence retained.
