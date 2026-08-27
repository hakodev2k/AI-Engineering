# Hook: Post Validation

## Trigger
Immediately after any structured-output validation failure.

## Preconditions
Validation error, schema id, attempted payload, worker/stage id and retry history are available.

## Action
Write an event JSON and run:
`python scripts/retry_watchdog.py --event <event.json> --policy config/policy.json`

## Expected result
A deterministic `retry`, `recover`, `fail-partial`, or `stop` decision with reason and canonical failure signature.

## Failure behavior
If the watchdog itself fails, block automatic retry and surface the validator evidence.

## Blocking
Yes. Automatic retry MUST NOT proceed without a watchdog decision.
