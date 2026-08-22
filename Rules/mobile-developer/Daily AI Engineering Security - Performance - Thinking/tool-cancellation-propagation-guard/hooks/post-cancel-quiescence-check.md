# Hook — Post-Cancel Quiescence Check

## Trigger
Immediately after a run enters cancelled/aborted state and again at the configured grace-period deadline.

## Preconditions
Run ID exists; active resources emit structured lifecycle events; ownership mapping is available.

## Action
Collect lifecycle events and run:

`python scripts/cancellation_audit.py <events.jsonl> --run-id <run-id> --grace-ms 5000`

## Expected result
Exit `0`: cancellation was observed and no owned resource remained active or performed a prohibited late action after the grace period.

## Failure behavior
- Exit `2`: invalid/incomplete input; block verification.
- Exit `3`: cancellation event missing; block verification.
- Exit `4`: resource leak or prohibited post-cancel activity detected; block completion and preserve evidence.

## Blocking
Yes. A cancelled run cannot be marked cleanly completed when this hook fails.
