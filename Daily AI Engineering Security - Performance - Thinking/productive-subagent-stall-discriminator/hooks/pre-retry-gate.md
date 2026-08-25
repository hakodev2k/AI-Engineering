# Hook: Pre-Retry Stall Gate

## Trigger
Immediately before retrying a watchdog-terminated subagent.

## Preconditions
Normalized termination reason, predecessor trace/progress digest, retry count and policy are available.

## Action
Run the discriminator on the predecessor trace. Retry only for `confirmed_stall` or `provider_timeout`, only below `max_retries`, and only when side-effect replay is safe.

## Script/command
`python3 scripts/stall_discriminator.py <trace.jsonl> --now <epoch-seconds>`

## Expected result
Exit 1 = confirmed stall; exit 0 = not a confirmed stall; exit 2 = invalid evidence.

## Failure behavior
Exit 2 blocks automatic retry. Non-idempotent side-effect uncertainty also blocks retry and escalates.

## Blocking
Yes for automatic retries.
