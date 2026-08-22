# Hook: Post-Run Latency Check

## Trigger
After an approval-gated tool call completes or after a benchmark batch is captured.

## Preconditions
A trace JSONL file and `config/latency-policy.json` exist.

## Action
Run:

`python scripts/latency_attribution.py TRACE.jsonl --policy config/latency-policy.json --strict`

## Expected result
Exit code 0 with all records valid and a JSON summary separating approval wait from execution latency.

## Failure behavior
- Exit 2: invalid input/config; block diagnosis.
- Exit 3: lifecycle/timing integrity failure; block diagnosis.
- Exit 4: valid trace but configured regression threshold exceeded; block performance-success claims.

## Blocking
Yes. A blocking failure prevents a performance conclusion from being marked Verified.
