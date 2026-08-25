# Hook — Streaming Parse Regression Benchmark

## Trigger
Before merging changes to streamed tool-argument parsing or provider stream adapters.

## Preconditions
Before/after JSONL traces and `config/budgets.json` are available.

## Action
Run:
`python3 scripts/regression_gate.py --before before.jsonl --after after.jsonl --budgets config/budgets.json`

Then run:
`python3 -m unittest tests/test_stream_parse_profiler.py`

## Expected result
Exit 0 and a JSON verdict with `pass: true`.

## Failure behavior
Block merge. Do not raise budgets in the same change unless independent benchmark evidence justifies the policy change.

## Blocks completion
Yes.
