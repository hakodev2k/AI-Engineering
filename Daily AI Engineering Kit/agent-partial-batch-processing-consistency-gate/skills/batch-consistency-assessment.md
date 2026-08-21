# Batch Consistency Assessment Skill

## Purpose
Prove that partial failures, retries, and restarts cannot silently lose, duplicate, or misreport item-level work in a batch.

## When to use
Use for scheduled imports, queue batches, backfills, file processing, pagination loops, fan-out workers, ETL steps, or any job that processes multiple items per execution.

## Inputs
Batch entry point, item identity, source ordering/paging semantics, checkpoint storage, commit boundaries, retry behavior, failure policy, tests/logs, and `config/batch-consistency-policy.json`.

## Preconditions
Target batch is identifiable and repository inspection is permitted.

## Allowed tools
Repository read/search, bundled scanner/validator, non-destructive tests/build, read-only logs/metrics, disposable test data.

## Constraints
Scanner findings are hypotheses. Separate batch completion from item completion. Never use production replay or deletion as a test without approval.

## Procedure
1. Identify batch trigger, item source, stable item identity, batch identity, and completion signal.
2. Trace pagination/cursor/checkpoint behavior and determine whether checkpoint state is durable.
3. Enumerate per-item durable/external side effects and commit boundaries.
4. Determine failure semantics for one item: fail-fast, continue-and-record, quarantine, retry item, or retry whole batch.
5. Map crash windows before item effect, after item effect/before checkpoint, and after checkpoint/before batch completion.
6. Run `python3 scripts/scan-batch-consistency.py <repo> --output scan.json`; validate every hit in code context.
7. Design a partial-failure test where one middle item fails while preceding and following items are observable.
8. Design a restart/retry test using the same batch/items; verify successful items are not duplicated and failed items are neither lost nor falsely completed.
9. Verify final counts: discovered, attempted, succeeded, failed, skipped, retried, and unresolved must reconcile with the source set according to business rules.
10. Recommend the smallest safe fix: durable per-item result, deterministic item key, atomic checkpoint, bounded concurrency, or scoped retry.
11. Re-run focused tests/build and inspect the diff.
12. Produce and validate an assessment matching `schemas/assessment.schema.json`.

## Expected output
Evidence-backed findings, risk, remediation, verification flags, and remaining risks.

## Verification
`pass` requires partial failure tested, retry scope tested, completion counts reconciled, and checkpoint behavior verified.

## Failure handling
Retry transient tool/test-environment failures at most twice. Preserve command output, failing item identity, checkpoint state, and attempt number. Deterministic failures require diagnosis/change before rerun.

## Stop conditions
Stop before approval-required actions, after two repeated transient failures, when source/item identity cannot be established, or when verification would require unsafe production mutation.
