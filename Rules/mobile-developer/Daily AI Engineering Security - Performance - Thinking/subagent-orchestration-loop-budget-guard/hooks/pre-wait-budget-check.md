# Hook: Pre-Wait Budget Check

## Trigger
Before every orchestration-only wait/status turn for a child agent.

## Preconditions
Current child status, intended operation, selected tool, lifecycle evidence, counters, and last wait interval are available.

## Action
Run:

`python scripts/orchestration_watchdog.py <input.json> --config config/budget.json`

## Expected result
- Exit `0`: continue with the returned wait/result-collection action.
- Exit `3`: reconcile against the authoritative subagent status source before any additional poll.
- Exit `4`: stop automatic orchestration and escalate; budget is exhausted.
- Exit `2`: invalid input/config; block automatic orchestration until corrected.

## Failure behavior
Do not silently retry. Preserve counters and trace evidence. Do not reset budget state without explicit operator action.

## Blocking
Yes for repeated orchestration-only cycles. The hook MUST NOT block direct result collection when a terminal child state has already been verified.