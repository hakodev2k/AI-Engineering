# Hook: Pre-Wait Check

## Trigger
Immediately before an agent would issue a second status/wait call for the same long-running handle.

## Preconditions
Handle and provider are known; task deadline is available.

## Action
1. Confirm the prior response is non-terminal.
2. Confirm status lookup is read-only/idempotent.
3. If push completion exists, switch to it.
4. Otherwise route the handle to `scripts/wait_broker.py` with `config/policy.json`.
5. Record the handoff event without appending repeated pending states to model context.

## Script / command
`python scripts/wait_broker.py --policy config/policy.json --handle <handle> -- <provider-command>`

## Expected result
One terminal broker event rather than repeated model-driven polls.

## Failure behavior
If validation fails, do not offload; retain the existing bounded wait path and record the blocking reason.

## Blocking
Yes when the proposed provider is mutating, unscoped, or lacks a bounded deadline.
