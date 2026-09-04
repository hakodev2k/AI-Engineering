# Rollback and Fallback Design

## Purpose
Design realistic recovery paths for migration failures before production cutover begins.

## When to use
Use for every migration with material business impact, especially data, DNS, identity, or irreversible platform changes.

## Inputs
Cutover sequence, source/target state model, data synchronization method, RTO/RPO, rollback window, traffic routing, backups, and business tolerances.

## Preconditions
The team must know which migration steps are reversible and which create divergence or destructive state changes.

## Context to inspect
Inspect write paths, replication direction, schema compatibility, DNS TTL, queued events, user sessions, source retention, backups, feature flags, and rollback authority.

## Core knowledge
Rollback is not synonymous with redeploying the old version. Once writes occur on the target, returning to source may require reverse synchronization or a forward-fix. Fallback can mean reduced service rather than full restoration.

## Procedure
1. Model state transitions for every cutover phase.
2. Mark reversible and irreversible steps.
3. Define rollback objectives and maximum decision time.
4. Determine how target writes will be preserved or reconciled.
5. Keep source infrastructure and data recoverable for an approved period.
6. Define routing/DNS reversal procedures.
7. Define application/version compatibility across both sides.
8. Prepare fallback modes for failures that cannot safely roll back.
9. Establish objective rollback triggers.
10. Assign decision authority.
11. Rehearse rollback from representative failure points.
12. Measure recovery time and data reconciliation effort.
13. Incorporate results into the cutover gate.

## Decision points
Choose rollback when returning to source is safer and state can be reconciled within RPO. Choose forward-fix when reverse migration creates greater data or operational risk. Use degraded fallback when neither path can meet recovery objectives.

## Common failure patterns
Rollback documented but never tested; source decommissioned too soon; bidirectional data conflicts ignored; DNS reversal slower than assumed; no decision deadline; rollback depends on unavailable specialists.

## Verification
Execute a rehearsal that introduces failure after target activation. Demonstrate traffic reversal, state reconciliation, application recovery, and monitoring within agreed objectives.

## Expected output
A tested rollback/fallback plan with state-handling rules, triggers, authority, deadlines, and measured recovery characteristics.

## Stop conditions
Do not proceed to production when critical rollback assumptions are untested, state cannot be reconciled, recovery exceeds business tolerance, or decision authority is absent.