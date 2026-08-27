# Hook: Post Lifecycle Event
## Trigger
After MCP initialize/discovery/tool-call lifecycle errors and after readiness success.

## Preconditions
Event contains transport, phase, attempt, and relevant error/liveness evidence.

## Action
Run:
`python scripts/lifecycle_guard.py --event <event.json> --policy config/policy.json`

## Expected result
`continue`, bounded `retry`, or terminal `stop`.

## Failure behavior
Malformed or unclassified events fail closed to `stop`; they are not retried automatically.

## Blocking
Yes for automated retry decisions.
