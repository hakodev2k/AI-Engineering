# Hook: Pre-Hook Liveness Gate

## Trigger
Immediately before a blocking hook command is admitted to the host's critical path.

## Preconditions
A finite policy timeout exists; command argv and working directory are resolved; security disposition for timeout is known.

## Action
Run the hook through `scripts/hook_watchdog.py`, not directly. Record the returned terminal JSON alongside the host lifecycle id.

## Command
`python scripts/hook_watchdog.py --timeout <seconds> --hook-id <id> --cwd <workspace> -- <program> <args...>`

## Expected result
Exit 0 with `status=success`, exit 1 with `status=failure`, exit 124 with `status=timeout`, or exit 64/70 for invalid input/spawn failure.

## Failure behavior
Timeout terminates the process tree and produces a terminal record. The host then applies its explicit security policy; it MUST NOT reinterpret timeout as successful enforcement.

## Blocking
Yes. The gate blocks completion until a terminal state exists, but the gate itself is bounded by the configured deadline plus a short cleanup interval.