# Post-Cutover Validation

## Purpose
Prove the migrated system is correct, performant, secure, and operationally stable after production traffic moves.

## When to use
Immediately after cutover and throughout the defined stabilization window.

## Inputs
Pre-cutover baselines, reconciliation suite, application SLOs, error telemetry, database metrics, security events, backup status, and business checks.

## Core knowledge
Successful smoke tests do not establish migration success. Some defects emerge only under production concurrency, scheduled jobs, cache expiry, reporting workloads, or backup cycles.

## Procedure
1. Execute critical application transactions and negative tests.
2. Reconcile final data against the authoritative source position.
3. Compare latency, throughput, errors, waits, locks, and resource headroom with baseline.
4. Verify jobs, reports, integrations, and CDC shutdown state.
5. Confirm backups and monitoring on target.
6. Review authentication and authorization failures.
7. Watch for residual source traffic.
8. Validate business KPIs that reveal semantic defects.
9. Track anomalies through a stabilization log.
10. Declare migration accepted only after explicit exit criteria pass.

## Decision points
Extend stabilization when anomalies are unexplained; do not decommission source merely because core traffic appears healthy.

## Common failure patterns
Stopping monitoring after smoke tests, ignoring batch cycles, missing backup verification, and decommissioning source immediately.

## Verification
All technical and business exit criteria pass for the required observation period.

## Expected output
Post-cutover evidence, anomaly disposition, and acceptance decision.

## Stop conditions
Trigger incident or fallback procedures when correctness, security, or SLO thresholds breach defined limits.