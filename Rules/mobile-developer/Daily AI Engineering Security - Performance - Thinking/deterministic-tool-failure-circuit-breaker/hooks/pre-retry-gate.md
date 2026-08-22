# Hook: Pre-retry Gate

## Trigger
Immediately before the orchestrator repeats a failed tool call.

## Preconditions
Previous call, arguments, error, attempt count, and incident ledger are available.

## Action
Run `scripts/retry_guard.py` with normalized call/error data. Require an allowed decision before retry.

## Command
`python3 scripts/retry_guard.py incident.json`

## Expected result
Exit 0 only when the next retry is policy-allowed. Exit 3 means circuit open / retry blocked. Exit 2 means invalid evidence/configuration.

## Failure behavior
BLOCK retry, preserve incident evidence, and invoke fallback/recovery workflow. Do not convert a blocked retry into an equivalent repeated tool invocation through another agent.

## Blocking
Yes.