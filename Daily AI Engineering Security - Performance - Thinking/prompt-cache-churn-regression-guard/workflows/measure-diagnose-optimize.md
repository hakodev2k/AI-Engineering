# Workflow: Measure → Diagnose → Optimize

**Trigger:** token-cost or cache-reuse regression.  
**Goal:** reduce redundant cache writes while preserving task quality.

## Inputs
Baseline trace, candidate trace, usage settings, quality tests.

## Baseline
Capture token counters, cache ratios, p50/p95 latency, and quality result.

## Stages
1. Observe anomalous spend or latency.
2. Measure baseline with `scripts/cache_churn_guard.py`.
3. Diagnose first churn boundary and prefix-fingerprint changes.
4. Form one explicit hypothesis.
5. Implement one reversible change.
6. Measure again.
7. If not improved, revert and repeat once with a new hypothesis.
8. Run independent verification.

## Responsible agent
Performance/token investigator implements; Cache Verifier verifies.

## Tools
Usage export, deterministic guard, project tests.

## Outputs
Baseline report, hypothesis, change record, candidate report, verification result.

## Checkpoints
Baseline captured; hypothesis recorded; candidate trace captured; quality verified.

## Metrics
Cache creation/read tokens, churn events, latency p50/p95, task quality, regression rate.

## Retry policy
Maximum 2 optimization hypotheses.

## Stop conditions
Quality regression, missing telemetry, secret-bearing logs, or two failed hypotheses.

## Failure path
Revert candidate change and preserve baseline behavior.

## Verification
Cache Verifier independently reproduces the analyzer result and quality checks.

## Definition of Done
Lower cache churn/token cost is measured, quality is equal or better, and independent verification passes.
