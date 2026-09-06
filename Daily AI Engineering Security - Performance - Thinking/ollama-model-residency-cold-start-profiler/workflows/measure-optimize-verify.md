# Workflow: Measure → Optimize → Verify

## Trigger
Intermittent local-agent latency or suspected model reload churn.

## Goal
Reduce residency-related latency without creating unacceptable memory pressure.

## Inputs
Baseline telemetry, model/runtime metadata, current keep-alive, memory capacity.

## Baseline
Run `python scripts/residency_profiler.py baseline.jsonl --out baseline-report.json`. Baseline is valid only with at least 20 requests.

## Context
Capture runtime version, model, context length, concurrency, GPU/RAM capacity, and current residency settings.

## Stages
1. **Observe** — collect representative trace.
2. **Measure** — compute cold-start rate, load-duration share, p50/p95 latency and idle gaps.
3. **Diagnose** — Performance Investigator classifies insufficient keep-alive, early eviction/regression, concurrency behavior, or non-residency bottleneck.
4. **Hypothesize** — choose one bounded change.
5. **Implement** — human/operator applies change in non-destructive configuration.
6. **Measure again** — collect comparable candidate trace and run profiler.
7. **Compare** — use `scripts/residency_profiler.py baseline.jsonl --compare candidate.jsonl`.
8. **Verify** — independent reviewer checks latency gain, cold-start reduction, and memory impact.

## Responsible agent
Performance Investigator diagnoses; operator implements; independent verifier accepts/rejects.

## Tools
Package profiler, Ollama telemetry/status, GPU/RAM monitor.

## Outputs
Baseline report, candidate report, comparison report, verification decision.

## Checkpoints
Baseline validity before changes; single-variable hypothesis before implementation; memory review before acceptance.

## Metrics
Cold-start rate; p95 total latency; p95 load duration; load-duration share; peak resident memory.

## Retry policy
Maximum 3 optimization hypotheses. Each retry requires new evidence and a different hypothesis.

## Stop conditions
Verified improvement; residency ruled out; memory regression exceeds team budget; or three failed hypotheses.

## Failure path
Preserve baseline and failed candidate reports, revert the experimental setting when safe, escalate runtime regressions with reproducible evidence.

## Verification
A candidate passes only when p95 latency or cold-start rate improves materially and memory stays within the declared budget.

## Definition of Done
Evidence documented; baseline valid; one or more hypotheses tested; before/after metrics recorded; risks documented; independent verification complete; no blocking regression remains.
