# Shadow Traffic Validation

## Purpose
Evaluate a candidate on production-shaped traffic without serving its outputs to users, enabling realistic compatibility, performance, and quality analysis with reduced user risk.

## When to use
Use before canarying a materially changed model or serving stack when traffic replay is permitted.

## Inputs
Candidate endpoint, production request stream or sanitized replay, baseline outputs, privacy constraints, metrics, and capacity budget.

## Preconditions
Shadow processing is authorized and cannot trigger real side effects.

## Context to inspect
Inspect request sensitivity, tool calls, external side effects, rate limits, sampling, deduplication, and candidate telemetry isolation.

## Core knowledge
Shadow traffic is observational. It can reveal workload mismatch and serving regressions, but cannot directly measure user feedback or interactive downstream behavior unless safely simulated.

## Procedure
1. Define questions shadowing must answer.
2. Select a representative, privacy-compliant sample.
3. Disable or mock side-effecting tools and writes.
4. Route duplicated requests asynchronously so production latency is unaffected.
5. Label candidate telemetry separately.
6. Compare latency, errors, resource use, outputs, and structured behavior.
7. Analyze critical slices and long-tail requests.
8. Quantify sample bias and missing interactive effects.
9. Use findings to fix issues or define canary gates.

## Decision points
Use live mirroring when freshness matters and privacy controls permit; use sanitized replay when deterministic repeatability or stronger isolation is required.

## Common failure patterns
Accidental duplicate side effects, copying sensitive data without authorization, overloading shared infrastructure, unrepresentative sampling, and treating shadow success as proof of user outcome quality.

## Verification
Confirm zero user-visible candidate responses and zero external side effects; reproduce candidate metrics from sampled traffic.

## Expected output
A shadow validation report with workload coverage, deltas, defects, and residual unknowns.

## Stop conditions
Stop on privacy-policy conflict, side-effect risk, production performance impact, or inability to distinguish candidate telemetry.
