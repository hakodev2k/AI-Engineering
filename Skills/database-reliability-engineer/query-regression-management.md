# Query Regression Management

## Purpose
Detect, diagnose, and safely remediate query-performance regressions before they become reliability incidents.

## When to use
Use after deployments, schema changes, statistics changes, engine upgrades, or unexplained latency increases.

## Inputs
Query fingerprints, execution plans, latency distributions, row counts, wait data, release history, and schema metadata.

## Context to inspect
Plan changes, indexes, statistics, parameter distributions, concurrency, resource pressure, and application call patterns.

## Core knowledge
A query can regress because of plan selection, cardinality estimates, data growth, contention, or changed access patterns. Optimize measured bottlenecks, not query text aesthetics.

## Procedure
1. Identify affected query fingerprints.
2. Compare current and previous latency and resource use.
3. Capture execution plans and waits.
4. Check data distribution, statistics, and index changes.
5. Reproduce with representative parameters.
6. Select the least risky remediation.
7. Benchmark alternatives.
8. Deploy with rollback and monitoring.
9. Verify tail latency and system-wide impact.

## Decision points
Choose query rewrite, index, statistics update, plan control, or schema change based on root cause and operational risk.

## Common failure patterns
Optimizing averages, forcing plans indefinitely, adding overlapping indexes, testing unrealistic parameters, and ignoring write amplification.

## Verification
Compare before/after plans, latency percentiles, CPU/IO, concurrency, and regression tests under representative load.

## Expected output
Root cause, validated remediation, benchmark evidence, and regression guardrails.

## Stop conditions
Escalate when production-only evidence is required, plan forcing could hide correctness issues, or remediation requires high-risk schema change.