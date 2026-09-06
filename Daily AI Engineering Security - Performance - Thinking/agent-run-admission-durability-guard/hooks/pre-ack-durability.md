# Hook: Pre-Ack Durability

## Trigger
Immediately before an asynchronous/background run-creation endpoint emits an external accepted/success acknowledgement, and during CI validation of that path.

## Preconditions
The host has assigned a stable run ID and idempotency key and has access to the durable admission store.

## Action
Require evidence that the admission record commit succeeded before acknowledgement. In CI/regression verification, run `python scripts/admission_guard.py <ledger.json>` and `python -m unittest tests/test_admission_guard.py`.

## Script/command
`python scripts/admission_guard.py ledger.json`

## Expected result
The candidate run is durably admitted, the validator exits 0, and the unit suite passes.

## Failure behavior
Do not emit an acceptance acknowledgement. Return/record an explicit admission failure and preserve diagnostic evidence. Never fall back to an in-memory-only acceptance.

## Blocks completion
Yes. Failure blocks the fire-and-forget acceptance path because acknowledging unpersisted work recreates the failure mode this package is designed to prevent.