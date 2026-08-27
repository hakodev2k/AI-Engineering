# Hook: Pre-Spawn Token Budget Gate

## Trigger
Immediately before creating any subagent batch and before retrying a child after meaningful token consumption.

## Preconditions
Current cumulative session usage, proposed child list, budget policy, and recent bootstrap history are available.

## Action
Run:
`python scripts/fanout_budget_guard.py --history history.json --request spawn-request.json --policy config/budget.json`

## Expected result
Exit 0 with one of `fanout`, `group`, or `serial`. The orchestrator MUST honor the topology recommendation unless a documented human override preserves the cumulative budget and required verification.

## Failure behavior
Exit 3 blocks additional spawning because the conservative projection exceeds budget or another hard policy limit. Exit 2 indicates invalid telemetry/config and also blocks spawning.

## Blocking
Yes. A failure MUST NOT be bypassed by dropping required correctness/security context.
