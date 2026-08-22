# Hook: Pre-Compaction Controller Check

## Trigger
Immediately before automatic compaction or retry-after-context-overflow.

## Preconditions
A JSON event ledger contains the current source fingerprint, timestamp, estimated/actual pre-compaction tokens, prior attempts for that fingerprint, and prior post-compaction measurements.

## Action
Run:

`python3 scripts/compaction_guard.py decide <events.jsonl> --policy config/policy.json --context-limit <tokens>`

## Expected result
Exit code `0` with decision `compact` or `allow`.

## Failure behavior
- Exit `2`: malformed ledger/config; block automatic compaction.
- Exit `3`: cooldown/circuit open; do not compact.
- Exit `4`: manual recovery required; stop automatic retries and surface recovery.

The hook MUST preserve current session state and diagnostic evidence on failure.

## Blocks completion
Yes. An automatic compaction controller is not verified if it can bypass this check on retry paths.
