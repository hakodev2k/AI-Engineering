# Performance Risk and Release Gates

## Purpose
Assess release performance risk and define evidence-based gates for changes that could materially affect latency, throughput, capacity, or resource consumption.

## When to use
Use for high-traffic releases, framework/runtime upgrades, database changes, infrastructure migrations, major query changes, and performance-sensitive feature launches.

## Inputs
Change scope, SLOs, benchmark/load results, historical regressions, architecture, rollback plan, production telemetry, and release strategy.

## Context to inspect
Inspect hot paths touched, workload growth, database/schema changes, dependency changes, caching, concurrency, resource limits, startup behavior, and observability readiness.

## Core knowledge
Not every release needs a full load test. Gate depth should be proportional to impact and uncertainty. A performance gate is useful only when its environment and threshold are trustworthy.

## Procedure
1. Classify the change by performance blast radius and uncertainty.
2. Identify affected SLOs and capacity constraints.
3. Determine required evidence: code review, microbenchmark, system benchmark, load test, or canary.
4. Verify test environment comparability.
5. Define pass/fail thresholds and guardrails before running tests.
6. Confirm rollback and production monitoring readiness.
7. Review results and unresolved variance.
8. For residual uncertainty, use staged rollout/canary with explicit abort criteria.
9. Compare post-release production metrics with baseline.
10. Record exceptions and accepted risks.

## Decision points
Use lightweight gates for low-risk changes; dedicated load tests for high-impact changes; canaries when production workload realism cannot be reproduced safely.

## Common failure patterns
Requiring expensive tests for every change, bypassing gates without recorded risk, noisy thresholds, no rollback, and approving based on averages while tail SLOs regress.

## Verification
The selected evidence covers the plausible failure modes and post-release metrics remain within agreed guardrails.

## Expected output
A proportionate release performance assessment with explicit evidence and go/no-go criteria.

## Stop conditions
Escalate when high-risk changes lack rollback, observability, or sufficient performance evidence.