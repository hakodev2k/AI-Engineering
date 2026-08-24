# Production Debugging

## Purpose
Investigate production defects systematically while minimizing user impact and preserving evidence.

## When to use
Use for unexplained errors, latency spikes, incorrect data, resource exhaustion, or intermittent failures.

## Inputs
Incident symptoms, timeline, logs, metrics, traces, deploy history, configuration, affected identifiers.

## Context to inspect
Recent changes, health signals, dependency status, resource saturation, error clusters, request traces, feature flags, and data anomalies.

## Core knowledge
Hypothesis-driven debugging, correlation vs causation, binary isolation, runtime diagnostics, safe reproduction, change analysis, and evidence preservation.

## Procedure
1. Establish impact, start time, and affected scope.
2. Preserve evidence before changing state.
3. Correlate symptoms with deploy/config/dependency changes.
4. Form ranked hypotheses from telemetry.
5. Test the cheapest discriminating hypothesis first.
6. Mitigate impact independently from root-cause work when needed.
7. Reproduce safely outside production where possible.
8. Confirm root cause with evidence, not disappearance of symptoms.
9. Add regression protection and observability gaps discovered.

## Decision points
Rollback when a recent reversible change strongly correlates with severe impact; use feature disablement or traffic reduction when rollback carries greater risk.

## Common failure patterns
Random restarts, changing multiple variables, debugging only logs, deleting evidence, blaming the last deploy without proof, and declaring root cause after mitigation.

## Verification
Reproduce the failure or its causal mechanism, apply the fix, run regression tests, and confirm production signals recover without hidden side effects.

## Expected output
Evidence-backed root cause, safe mitigation/fix, and prevention actions.

## Stop conditions
Stop risky live experiments when blast radius is uncertain or access/change authority is insufficient.