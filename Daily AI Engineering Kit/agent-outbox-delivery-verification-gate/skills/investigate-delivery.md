# Investigate Outbox Delivery

## Purpose
Prove whether a persisted outbox message progressed from transaction commit to dispatcher attempt and consumer observation.

## When to use
Use for missing, delayed, duplicated, or uncertain integration events implemented with a transactional outbox.

## Inputs
Message/correlation ID, expected event type, time window, repository, read-only database/log access, consumer telemetry when available.

## Preconditions
Identify environment and confirm all production access is read-only. Do not replay messages during investigation.

## Allowed tools
Repository search, read-only SQL, log/trace search, test runner, local scripts.

## Process
1. Locate outbox entity/table, transaction boundary, dispatcher, broker adapter, retry policy, and consumer idempotency logic.
2. Find the exact persisted row by message/correlation ID and record timestamps, payload hash, state, attempt count, and transaction evidence.
3. Trace dispatcher evidence using the same identifier. Separate no-attempt, failed-attempt, and acknowledged-send cases.
4. Trace broker/consumer evidence without assuming broker acknowledgement equals business processing.
5. Check duplicate handling, ordering assumptions, poison/dead-letter behavior, and retry exhaustion.
6. Record facts separately from hypotheses. Every conclusion must cite a row, log, trace, test, or code location.
7. Produce evidence JSON matching `schemas/evidence.schema.json`.
8. Run `python scripts/verify_outbox.py <evidence.json>` only after all three evidence classes exist.

## Verification
A message is verified only when persistence, dispatch, and consumer observation are independently evidenced and duplicate/ordering risk is assessed.

## Failure handling
Retry telemetry queries at most twice for transient tool failures. Never retry a business operation. Mark unavailable evidence as inconclusive and stop.

## Stop conditions
Stop before production replay, deletion, schema/config changes, permission elevation, or any action that can create another delivery.
