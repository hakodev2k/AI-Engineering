# Replication and Synchronization Validation

## Purpose
Prove that ongoing source-to-target synchronization is complete, ordered, and convergent before cutover.

## When to use
Use with logical replication, CDC, custom sync, or staged migration pipelines.

## Inputs
Replication positions, lag metrics, error queues, source/target aggregates, transaction metadata, and reconciliation rules.

## Core knowledge
A low lag metric does not prove correctness. Replication may be current while specific rows are skipped, transformed incorrectly, or stuck in dead-letter handling.

## Procedure
1. Define authoritative replication positions.
2. Monitor capture, transport, and apply lag separately.
3. Inspect retry and dead-letter queues.
4. Reconcile counts and aggregates by stable partitions.
5. Sample high-risk records and recent updates.
6. Verify deletes and key changes.
7. Inject controlled test changes where safe.
8. Observe convergence under peak write rate.
9. Confirm no unsupported schema changes occurred.
10. Establish a cutover readiness threshold.

## Decision points
Use full reconciliation when feasible; otherwise use partitioned checksums plus targeted row comparisons based on risk.

## Common failure patterns
Trusting a single lag gauge, ignoring apply errors, sampling only old rows, and failing to test deletes.

## Verification
Target must reach the agreed source position with zero unexplained errors and reconciliation within defined tolerances.

## Expected output
Synchronization readiness evidence and an explicit list of exceptions.

## Stop conditions
Stop when unexplained divergence exists or replication positions cannot be mapped reliably.