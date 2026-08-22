# Hook: Pre-dispatch Budget Gate

## Trigger
Immediately before every model/API dispatch after one or more tool results were added.

## Preconditions
A serialized request snapshot or equivalent list of retained tool payloads is available.

## Action
Run the payload profiler and compare projected serialized bytes/context use with configured thresholds. Confirm every above-soft-limit payload has lifecycle metadata.

## Command
`python3 scripts/payload_profiler.py session-tool-results.json --soft-bytes 500000 --hard-bytes 20000000`

Provider-specific limits MUST replace the example values in production.

## Expected result
Exit 0 and projected hard-limit utilization below 90%; no unclassified oversized payload.

## Failure behavior
Exit 2 means invalid input/configuration and blocks dispatch. Exit 3 means unsafe projected size and blocks dispatch. Invoke `workflows/profile-evict-verify.md` before one retry.

## Blocking
Yes. This hook blocks completion/dispatch rather than allowing a provider-side overflow.