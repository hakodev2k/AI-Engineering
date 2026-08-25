# Hook — Pre-Abort Liveness Check

## Trigger
Immediately before a runtime converts model/subagent silence into a destructive abort.

## Preconditions
Current observation JSON includes calibrated p99, transport state, progress age, retry count, and hard ceiling.

## Action
Run `python3 scripts/watchdog_decision.py observation.json`.

## Expected result
Exit 0: continue/defer. Exit 3: abort supported. Exit 4: escalate because retry budget is exhausted. Exit 2: invalid observation.

## Failure behavior
Invalid observations MUST NOT trigger an automatic destructive restart; preserve existing safe runtime cancellation policy and surface telemetry. `defer` MUST schedule only the bounded deadline returned by the decision engine.

## Blocking
This hook blocks automatic retry-after-abort unless an `abort` decision is supported or the host's stricter safety cancellation boundary requires termination.