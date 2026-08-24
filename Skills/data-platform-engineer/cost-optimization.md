# Data Platform Cost Optimization

## Purpose
Reduce platform spend without degrading reliability, performance, security, or developer productivity by connecting cost to workloads and business value.

## When to use
Use for budget pressure, unexplained spend growth, architecture reviews, or workload onboarding.

## Inputs
Billing data, workload telemetry, utilization, storage growth, query/job profiles, commitments, and SLOs.

## Context to inspect
Compute idle time, autoscaling, storage tiers, data scans, egress, replication, retention, licenses, reserved capacity, and ownership tags.

## Core knowledge
Cost is an architectural signal. Unit economics such as cost per processed TB, query, pipeline run, or tenant are more actionable than total spend. Savings that increase incidents or engineering toil can be false economies.

## Procedure
1. Allocate spend to capabilities, teams, and major workloads.
2. Establish useful unit-cost metrics.
3. Identify top cost drivers and anomalous growth.
4. Separate idle waste from legitimately expensive workloads.
5. Tune data layout and queries to reduce unnecessary scans/shuffles.
6. Right-size compute and autoscaling boundaries.
7. Apply storage lifecycle and retention policies.
8. Evaluate commitments only after demand stability is understood.
9. Quantify egress and cross-region replication costs.
10. Validate savings against SLO and operational impact.
11. Add budget and anomaly alerts with owners.

## Decision points
Use spot/preemptible capacity for retryable workloads, not critical stateful work without mitigation. Commit capacity for predictable baseline demand; retain elasticity for peaks. Archive cold data only when restore latency is acceptable.

## Common failure patterns
Optimizing tiny line items, deleting observability to save money, commitments based on peak demand, unowned shared spend, excessive retention, and ignoring engineering labor.

## Verification
Compare normalized unit costs before/after, run performance and recovery tests, verify lifecycle retrieval, and monitor savings over multiple billing periods.

## Expected output
Cost allocation model, prioritized optimizations, measured savings, unit-cost dashboard, and guardrails.

## Stop conditions
Escalate when savings would violate SLOs, retention obligations, security controls, or require contractual commitments beyond authority.