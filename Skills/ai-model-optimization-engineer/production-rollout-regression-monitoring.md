# Production Rollout and Regression Monitoring

## Purpose
Deploy optimized model paths safely and detect quality, performance, cost, or reliability regressions in real traffic.

## When to use
After an optimization passes offline verification and is ready for production exposure.

## Inputs
Candidate artifact, baseline, deployment topology, SLOs, quality proxies/evaluations, dashboards, rollback mechanism.

## Preconditions
Artifact is versioned; rollback is tested; telemetry can distinguish candidate from control.

## Context to inspect
Inspect routing, canary controls, model/runtime versions, tail latency, errors, memory, utilization, cost, output-quality signals, and alert thresholds.

## Core knowledge
Offline benchmarks cannot represent all production shapes and interactions. Safe rollout uses progressive exposure, control comparison, guardrails, and rapid rollback.

## Procedure
1. Define release gates and rollback triggers.
2. Deploy to isolated/shadow traffic when useful.
3. Compare candidate and control telemetry.
4. Begin low-percentage canary exposure.
5. Monitor latency distributions, throughput, errors, resource use, cost, and quality guardrails.
6. Inspect critical request slices.
7. Increase exposure only after a stable observation window.
8. Halt or rollback on predefined regressions.
9. Complete rollout gradually.
10. Preserve before/after evidence and update capacity assumptions.

## Decision points
Use shadowing when outputs can be compared without side effects; use canaries when true serving interactions must be measured. Prefer rollback over live debugging when hard gates fail.

## Common failure patterns
Big-bang deployment, candidate/control telemetry mixed together, no quality monitoring, alerts based only on averages, untested rollback.

## Verification
Full rollout remains within quality/SLO/cost gates across representative production periods and rollback has been proven operationally.

## Expected output
Release record, canary evidence, final configuration, observed gains, regressions, and rollback criteria.

## Stop conditions
Stop rollout immediately on hard quality/safety/SLO breach, unexplained error increase, or inability to distinguish candidate telemetry.