# Batch Inference Reliability

## Purpose
Design batch prediction workflows that produce complete, correct, reproducible outputs despite retries, partial failures, late inputs, and large-scale processing constraints.

## When to use
Use for scheduled scoring, offline recommendations, risk batches, periodic forecasts, or any ML workflow where predictions are materialized asynchronously.

## Inputs
- Batch input specification
- Partitioning and scheduling rules
- Model/version requirements
- Output sink and consumers
- Completion and freshness SLOs

## Context to inspect
Inspect input snapshot semantics, late-arriving data, partition keys, retry behavior, checkpointing, duplicate writes, output completeness, downstream consumption, and model/version consistency.

## Core knowledge
Reliable batch inference requires deterministic inputs, idempotent outputs, explicit completeness criteria, bounded retries, and versioned lineage. A job exit code alone does not prove every expected entity was scored exactly as intended.

## Procedure
1. Define the scoring population and immutable input cutoff.
2. Record model, preprocessing, and data versions for the run.
3. Partition work so retries can be isolated without duplicating successful output.
4. Make writes idempotent using run and entity identifiers.
5. Define expected record counts and completeness checks.
6. Detect missing, duplicated, and malformed partitions.
7. Handle late data according to an explicit recomputation policy.
8. Use bounded retries for transient failures and quarantine deterministic bad records when appropriate.
9. Publish outputs atomically or expose a completion marker so consumers never read partial results as final.
10. Monitor duration, freshness, completeness, failure rates, and resource saturation.
11. Test restart from representative partial-failure states.

## Decision points
Recompute a full batch when cross-partition dependencies make partial repair unsafe; otherwise rerun only failed partitions. Use atomic dataset swaps when consumers require a coherent snapshot.

## Common failure patterns
- Consumers read partially written output.
- Retried partitions duplicate predictions.
- Different partitions use different model versions.
- Late inputs silently change historical results.
- Success is declared without completeness reconciliation.

## Verification
Interrupt a run, retry failed work, and verify exact output completeness, uniqueness, model-version consistency, lineage, and consumer-safe publication.

## Expected output
A batch-inference reliability design with idempotency, completeness checks, retry rules, publication semantics, monitoring, and recovery procedures.

## Stop conditions
Stop publication if expected population cannot be reconciled, model versions differ within the run, or output atomicity requirements cannot be satisfied.