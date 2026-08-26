# Disaster Recovery and Resilience

## Purpose
Design and validate recovery from regional, storage, metadata and pipeline failures while preserving feature correctness.

## When to use
Use for resilience planning, architecture reviews and recovery exercises.

## Inputs
RTO/RPO, topology, backups, source replay capability, state stores, online/offline data and dependency SLAs.

## Context to inspect
Failure domains, replication, backup policies, checkpoint locations, infrastructure-as-code and restoration runbooks.

## Core knowledge
Not all feature data needs backup if it is reproducible from durable sources, but metadata, transformation versions and irreproducible state may be critical. Recovery order matters.

## Procedure
1. Classify components by recoverability and business criticality.
2. Define RTO/RPO per component.
3. Identify single failure domains and control-plane dependencies.
4. Ensure durable copies of critical metadata and configuration.
5. Define rebuild/replay strategy for derived data.
6. Define online failover and stale-feature behavior.
7. Automate infrastructure restoration where practical.
8. Run tabletop and technical recovery exercises.
9. Measure actual recovery time and data loss.
10. Correct gaps and repeat periodically.

## Decision points
Recompute derived features when cheaper and safer than backup restore. Multi-region active-active is justified only when SLO/value warrants complexity.

## Common failure patterns
Untested backups, checkpoints in same failure domain, undocumented restore order, assuming source replay is infinite and failover with stale schema.

## Verification
Perform a controlled restore/failover and prove consumer-visible correctness within RTO/RPO.

## Expected output
A tested recovery design and runbook with measured objectives.

## Stop conditions
Stop claiming DR readiness when restoration has not been exercised end to end.