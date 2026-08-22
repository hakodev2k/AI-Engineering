# Hook: Pre-watcher Budget

## Trigger
Before creating or materially expanding a Linux repository watcher.

## Preconditions
Target PID and `/proc` are available.

## Action
Run the inotify profiler for the target process and compare measured headroom with configured ceilings.

## Command
`python3 scripts/inotify_budget.py --pid "$PID" --warn 0.80 --block 0.90`

## Expected result
Exit 0 with utilization below warning threshold, or exit 1 for warning where a scoped fallback is selected.

## Failure behavior
Exit 2 indicates measurement/configuration failure; exit 3 blocks broad watcher creation. Invoke the bounded performance workflow once before retry.

## Blocking
Yes at exit 2 or 3. The hook never raises sysctl values automatically.