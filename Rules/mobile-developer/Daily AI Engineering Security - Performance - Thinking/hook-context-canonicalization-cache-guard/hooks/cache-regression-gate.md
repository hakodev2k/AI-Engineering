# Hook — Cache Regression Gate

## Trigger
CI or pre-release validation after hook/runtime/history-serialization changes.

## Preconditions
A chronological JSONL trace exists and `config/cache-policy.json` is present.

## Action
Run:

`python scripts/cache_trace_analyzer.py trace.jsonl --policy config/cache-policy.json`

## Expected result
Exit code 0 and a report with no blocking rewrite-ratio or absolute cache-creation violations.

## Failure behavior
Exit code 4 blocks completion/release. Exit code 2 indicates malformed evidence and also blocks verification. Investigate before retrying.

## Blocks completion
Yes. The gate may be bypassed only by an explicit human decision that records why the workload intentionally changed; bypassing MUST NOT be described as a verified cache optimization.
