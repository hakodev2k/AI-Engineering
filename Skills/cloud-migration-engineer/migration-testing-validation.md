# Migration Testing and Validation

## Purpose
Prove that migrated workloads preserve required behavior, data, performance, security, and operability rather than merely starting successfully.

## When to use
Use during pilots, rehearsals, cutovers, and stabilization for every migration unit.

## Inputs
Acceptance criteria, application tests, production baselines, data invariants, SLOs, security requirements, dependency map, and operational runbooks.

## Preconditions
Expected behavior and critical business journeys must be defined. Test data handling must comply with policy.

## Context to inspect
Inspect functional flows, integrations, data, latency, throughput, error rates, authentication/authorization, backup, monitoring, alerts, failover, batch jobs, and deployment behavior.

## Core knowledge
Migration validation spans functional, non-functional, operational, and security dimensions. Passing synthetic smoke tests does not establish production equivalence.

## Procedure
1. Translate requirements into measurable acceptance criteria.
2. Capture source baseline for critical journeys and system signals.
3. Define smoke, regression, integration, performance, resilience, security, and operational tests.
4. Prepare production-like data volumes and distributions where allowed.
5. Validate dependency connectivity and contracts.
6. Run functional regression on target.
7. Reconcile migrated data using technical and business invariants.
8. Compare performance with source baseline and target SLOs.
9. Exercise failover, backup/restore, scaling, and alerting.
10. Validate IAM and network boundaries.
11. Record defects by severity and migration impact.
12. Re-test remediations.
13. Produce an evidence-based go/no-go recommendation.

## Decision points
Require parity when behavior must remain unchanged; allow intentional differences only when documented and accepted. Use production traffic shadowing or canaries when architecture permits and privacy constraints are satisfied.

## Common failure patterns
Only testing HTTP 200; tiny datasets; no batch testing; no restore test; comparing averages instead of percentiles; ignoring operational alarms; acceptance criteria invented after defects appear.

## Verification
Every critical criterion has objective evidence and owner sign-off. High-severity defects are closed or explicitly accepted. Baseline comparisons are retained.

## Expected output
A migration validation report with test evidence, defects, deviations, residual risks, and go/no-go status.

## Stop conditions
Stop migration progression when critical correctness, security, data-integrity, recoverability, or SLO criteria fail without approved risk acceptance.