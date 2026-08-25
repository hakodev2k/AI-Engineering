# Hook: Checkpoint Contention Regression Gate

## Trigger
After checkpoint saver/iterator changes and before merge or release.

## Preconditions
A representative candidate trace exists and uses the documented event schema. Thresholds come from the baseline/service budget, not from the candidate result.

## Action
Profile the candidate trace and fail on malformed lifecycle events, excessive writer wait, excessive lock hold, or reader yields while the guarded lock is held.

## Command
```bash
python scripts/async_lock_profiler.py \
  --input candidate.jsonl \
  --max-writer-wait-ms 100 \
  --max-lock-hold-ms 100 \
  --max-yields-while-locked 0
```

Replace numeric budgets with workload-specific values established before optimization.

## Expected result
Exit 0 and JSON `status: pass`. Exit 2 means one or more performance/locking budgets failed. Exit 1 means malformed input or execution error.

## Failure behavior
Block completion. Preserve profiler JSON and the raw trace as evidence; do not automatically relax thresholds.

## Blocks completion
Yes. Correctness tests/history equivalence must also pass; this hook alone is not sufficient for verification.
