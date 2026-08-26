# Rollback and Fallback Engineering

## Purpose
Provide a credible path to restore service and data authority if migration cutover fails.

## When to use
Design before cutover, not after a failure.

## Inputs
Cutover sequence, source retention plan, write-routing behavior, reverse-sync capability, backup state, RPO/RTO, and rollback decision thresholds.

## Core knowledge
Rollback becomes difficult once target accepts writes. A technical switch-back without reconciling target-only writes can lose data. Sometimes forward-fix is safer than rollback.

## Procedure
1. Define rollback window and authority.
2. Identify the point after which rollback requires data reconciliation.
3. Preserve source availability and backups for the agreed period.
4. Define how target-only writes will be handled.
5. Establish reversible configuration/routing steps.
6. Define health thresholds that trigger fallback.
7. Rehearse rollback from realistic failure points.
8. Time the procedure against RTO.
9. Document forward-fix criteria where rollback is unsafe.
10. Validate source consistency after any rollback.

## Decision points
Rollback when service or correctness risk exceeds forward-fix risk and data can be preserved; forward-fix when reverse synchronization would create greater uncertainty.

## Common failure patterns
Calling DNS reversal a rollback plan, shutting down source too early, ignoring target-only writes, and leaving decision authority ambiguous.

## Verification
Execute rollback rehearsal and prove application health plus data consistency after reversal.

## Expected output
A tested fallback runbook with decision thresholds and data-preservation mechanics.

## Stop conditions
Do not initiate rollback if it would knowingly discard committed data without explicit incident authority.