# Hook: Pre-Resume Budget Check

## Trigger
Before shipping a hydration/resume change or enabling eager background hydration for large threads.

## Preconditions
Candidate telemetry and `config/policy.json` exist.

## Action
Run:

```bash
python scripts/hydration_profiler.py --telemetry <candidate.jsonl> --policy config/policy.json --json
python -m unittest tests/test_hydration_profiler.py
```

## Expected result
Both commands exit 0. Candidate telemetry remains within RSS, resume latency, loaded-item, and concurrency budgets.

## Failure behavior
Block completion. Preserve the failing telemetry and return to diagnosis. Do not increase limits solely to obtain a pass.

## Blocking
Yes.
