# Hook: Pre-Retry Episode Check

## Trigger
Before every automatic retry or continuation action.

## Preconditions
Current failure event, prior episode ledger, retry policy, and operation identity are available.

## Action
Run `python scripts/retry_episode_guard.py event.json --ledger ledger.json --policy config/retry-policy.json`. Use the returned episode ID, count, and decision before retrying.

## Script/command
`python scripts/retry_episode_guard.py event.json --ledger ledger.json --policy config/retry-policy.json`

## Expected result
Exit 0 permits retry/new episode; exit 3 requires a changed recovery strategy; exit 4 stops automatic retry; exit 2 indicates invalid input.

## Failure behavior
Invalid/missing episode evidence blocks automatic retry. Surface a controlled failure rather than silently granting fresh budget.

## Blocks completion
Yes. Verification cannot pass while automatic retries bypass episode accounting.
