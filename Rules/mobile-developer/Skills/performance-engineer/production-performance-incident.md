# Production Performance Incident Investigation

## Purpose
Investigate live performance degradation safely, prioritize user impact, preserve evidence, and identify causal bottlenecks without making speculative changes.

## When to use
Use for latency spikes, throughput collapse, resource saturation, backlog growth, timeout storms, or performance regressions in production.

## Inputs
Incident timeline, SLO/user impact, metrics, traces, logs, profiles where safe, recent changes, topology, and operational runbooks.

## Preconditions
Follow incident command and production-access policies. Stabilization takes priority over deep optimization.

## Context to inspect
Inspect traffic changes, deployments, feature flags, dependency health, saturation, queues, autoscaling, database behavior, retries, runtime pauses, and regional differences.

## Core knowledge
Correlation is not causation. During incidents, compare healthy and unhealthy periods, constrain hypotheses, and prefer reversible mitigations. Preserve timestamps and evidence for later analysis.

## Procedure
1. Define impact, affected scope, and start time.
2. Stabilize with approved rollback, shedding, scaling, or feature controls when necessary.
3. Compare current telemetry with a healthy baseline.
4. Correlate onset with deployments, traffic, dependencies, and resource saturation.
5. Decompose latency using traces and queue/pool metrics.
6. Identify the strongest causal hypothesis.
7. Apply the lowest-risk reversible mitigation.
8. Verify recovery against user-facing metrics.
9. Preserve evidence and document rejected hypotheses.
10. Reproduce safely after the incident and implement durable remediation.

## Decision points
Rollback when a recent change strongly correlates and rollback risk is lower than continued impact. Scale only when evidence indicates capacity, not downstream saturation, is the constraint.

## Common failure patterns
Changing many variables, restarting away evidence, scaling a saturated dependency, focusing on one alarming metric, and declaring recovery before backlog drains.

## Verification
User-facing SLOs recover, backlog/resource state normalizes, and the mitigation's causal effect is supported by telemetry.

## Expected output
A timeline, root-cause hypothesis, mitigation evidence, and follow-up actions.

## Stop conditions
Escalate when production access, risky remediation, or cross-team dependency ownership exceeds authority.