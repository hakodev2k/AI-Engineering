# Hook: Pre-Dispatch Dedup Gate

## Trigger
Immediately after tool-call parsing and before executor scheduling.

## Preconditions
Tool call array is valid JSON; policy file is readable; logical scope ID is known.

## Action
Serialize the pending calls into the gate input schema and execute:

`python scripts/dedup_gate.py pending-calls.json --policy config/policy.json`

## Expected result
Exit 0 with an ordered decision for every call. Only `execute` decisions may enter the parallel executor. `suppress` decisions reference a representative call. `block` decisions prevent dispatch.

## Failure behavior
Invalid input, unknown policy, or integrity anomaly blocks affected dispatch and records the reason. Do not bypass the hook to recover performance.

## Blocking
Yes for malformed input, conflicting call identity, or unsafe write replay. Suppression itself is not a failure.