# Hook: Pre-change Ordering Gate

## Trigger
Immediately before editing order-sensitive producer, consumer, retry, partitioning, or persistence code.

## Preconditions
An evidence JSON and policy exist.

## Action
Run `python scripts/message_order_gate.py --evidence <captured-evidence.json> --policy config/policy.json --output <pre-change-result.json>`.

## Expected result
The result deterministically records whether the captured observation contains inversions/gaps/duplicates and preserves findings for comparison.

## Failure behavior
Exit code 2 indicates invalid/unreadable input and blocks editing until evidence is corrected. Exit code 1 is an expected blocking finding and permits investigation/repair but must be preserved as before-state evidence. Tool failures may be retried twice.

## Blocking
Invalid evidence blocks execution. A detected ordering violation blocks completion but not a bounded repair attempt.
