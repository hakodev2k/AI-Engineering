# Recovery Verification

## Purpose
Prove that an incident is actually recovered across user experience, system health, data correctness, and dependencies before declaring resolution.

## When to use
Use after rollback, failover, scaling, containment, repair, configuration changes, or apparent spontaneous recovery.

## Inputs
Baseline metrics, SLOs, synthetic checks, business transactions, dependency health, data reconciliation, and mitigation details.

## Context to inspect
Inspect leading and lagging indicators, queues, caches, replication, autoscaling, error budgets, customer reports, and delayed asynchronous work.

## Core knowledge
A successful change is not equivalent to verified recovery. Recovery should be demonstrated by independent signals over a sufficient observation window and include hidden backlog or integrity risks.

## Procedure
1. Define explicit recovery criteria before or immediately after mitigation.
2. Verify critical user journeys end to end.
3. Compare latency, errors, throughput, and saturation to baseline.
4. Check dependency health and regional/tenant segments.
5. Inspect queues, retries, dead letters, and deferred work.
6. Reconcile data when integrity may have been affected.
7. Confirm containment controls are not masking failures.
8. Observe stability for a risk-appropriate window.
9. Remove temporary controls gradually where safe.
10. Record evidence supporting recovery declaration.

## Decision points
Extend observation when failures are intermittent, traffic is below normal, or asynchronous effects are delayed. Keep containment until healthy behavior is proven without it.

## Common failure patterns
Declaring recovery from one green dashboard, ignoring low traffic, leaving queues backlogged, missing regional failures, and removing all mitigations simultaneously.

## Verification
Recovery is verified only when defined user, system, dependency, and data criteria are met with sustained evidence.

## Expected output
A recovery checklist with measured evidence, remaining risks, temporary controls, and resolution decision.

## Stop conditions
Do not close when critical telemetry is unavailable, integrity remains uncertain, or recovery depends on an unexplained temporary condition.