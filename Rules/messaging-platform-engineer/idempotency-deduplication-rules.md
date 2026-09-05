# Idempotency and Deduplication Rules

## Purpose
Prevent duplicate deliveries, retries, or replays from creating duplicate business effects.

## Scope
Producers, consumers, message identifiers, deduplication stores, and external side effects.

## MUST
- Side-effecting operations MUST define how duplicate messages are detected or rendered harmless.
- Idempotency keys MUST be stable across retries of the same logical operation.
- Deduplication state MUST survive the retry/replay window it is intended to protect.
- Duplicate handling MUST be tested under crash and retry scenarios.

## MUST NOT
- MUST NOT use random per-attempt identifiers as idempotency keys for the same logical operation.
- MUST NOT assume broker redelivery cannot occur.
- MUST NOT mark processing complete before protected side effects are durably committed.

## SHOULD
- Prefer natural business identifiers when they provide correct idempotency scope.

## Exceptions
Non-idempotent flows require documented duplicate impact, compensating controls, and approval.

## Verification
Review message IDs, persistence boundaries, duplicate tests, replay tests, and external side-effect records.