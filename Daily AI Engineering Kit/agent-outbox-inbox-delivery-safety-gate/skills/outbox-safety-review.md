# Outbox Safety Review

## Purpose
Verify that domain state changes and outbound integration events cannot diverge because of partial commits, retries, crashes, or duplicate publishing.

## When to use
Use when adding or changing event publishing, message relays, background dispatchers, integration events, or recovery logic around a transactional outbox.

## Inputs
- Repository path and relevant modules.
- Database transaction boundaries.
- Outbox entity/table and dispatcher implementation.
- Broker/API publishing code.
- Tests and failure logs when available.

## Preconditions
- Read-only repository inspection is available.
- Relevant build/test commands are known or discoverable.

## Allowed tools
Repository search, file reads, local build/tests, database migration inspection, logs, and non-destructive scripts.

## Constraints
- Do not alter production data.
- Do not replay production messages without explicit approval.
- Do not claim exactly-once transport; verify exactly-once business effect instead.

## Procedure
1. Locate the write transaction that changes business state.
2. Verify outbox insertion occurs in the same transaction and commit boundary.
3. Identify the dispatcher claim/lease strategy and concurrent-worker behavior.
4. Trace message identity from creation through publish acknowledgement.
5. Verify failed publishes leave the message retryable without losing evidence.
6. Verify successful publishes are marked only after the external operation reports success.
7. Inspect retry limits, backoff, dead-letter/escalation behavior, and crash recovery.
8. Confirm consumers receive a stable event ID/idempotency key.
9. Run deterministic inspection with `scripts/outbox_inbox_gate.py` against a generated snapshot.
10. Run repository tests focused on transaction rollback, publish failure, crash-after-publish, and concurrent dispatch.
11. Inspect the diff and document any unverified assumptions.

## Expected output
A structured result containing finding, evidence, risk, recommended action, and verification status.

## Verification
Pass only when transactional enqueue is proven, publish failure is recoverable, and duplicate transport cannot create duplicate business effects in the paired inbox flow.

## Failure handling
Transient test/tool failures may be retried twice. Validation failures are not retried without a code/config change. Preserve logs and stop after the retry budget.

## Stop conditions
Stop and escalate if transaction boundaries cannot be established, production replay is required, or a schema/data change is necessary without approval.
