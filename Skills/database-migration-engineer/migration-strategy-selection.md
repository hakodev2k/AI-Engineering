# Migration Strategy Selection

## Purpose
Select a migration pattern that meets correctness, downtime, complexity, cost, and rollback constraints.

## When to use
Use after discovery and compatibility analysis, before building migration pipelines.

## Inputs
Data volume and change rate, RPO/RTO, downtime allowance, network capacity, source/target capabilities, operational maturity, rollback requirements, and business windows.

## Core knowledge
Common patterns include offline copy, backup/restore, bulk load plus delta sync, logical replication, CDC, dual-write, and phased domain migration. Lower downtime generally increases synchronization and verification complexity.

## Procedure
1. Quantify downtime and data-loss tolerances.
2. Measure data size, churn, and transfer capacity.
3. Identify source/target replication capabilities.
4. Define consistency point and cutover semantics.
5. Evaluate candidate strategies against failure and rollback scenarios.
6. Estimate duration and operational load.
7. Prototype the highest-risk mechanism.
8. Select the simplest strategy that meets requirements.
9. Document assumptions and fallback.
10. Obtain business and operations acceptance.

## Decision points
Use offline migration when downtime is affordable; use CDC or replication when downtime must be minimized; avoid dual-write unless application-level consistency complexity is justified.

## Common failure patterns
Choosing zero-downtime by default, ignoring catch-up time, underestimating write churn, and designing rollback after implementation.

## Verification
Run timed rehearsals and prove consistency, cutover, and rollback mechanics.

## Expected output
A migration strategy decision with evidence, trade-offs, timing model, and fallback.

## Stop conditions
Stop when the selected strategy cannot meet measured RPO/RTO or has no credible rollback.