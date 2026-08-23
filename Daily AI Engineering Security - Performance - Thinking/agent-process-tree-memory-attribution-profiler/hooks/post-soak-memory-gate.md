# Hook: Post-Soak Memory Gate

## Trigger
After a repeatable agent workload/soak captures process samples.

## Preconditions
JSONL trace is complete enough to include the configured root PID at every timestamp; policy exists.

## Action
Run `python scripts/process_tree_memory_profiler.py --input "$TRACE" --root-pid "$ROOT_PID" --policy "$POLICY"` and add `--baseline "$BASELINE"` for regression comparison.

## Expected result
Exit 0 with `status=pass` and root/tree/child metrics.

## Failure behavior
Exit 2 blocks performance sign-off. Exit 3 blocks due to invalid telemetry/configuration.

## Blocking
Yes for a claimed memory-performance improvement.
