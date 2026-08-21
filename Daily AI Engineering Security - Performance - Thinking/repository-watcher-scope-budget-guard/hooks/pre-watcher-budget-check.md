# Hook — Pre-Watcher Budget Check

## Trigger
Immediately before creating a new recursive repository watcher or expanding an existing watcher scope.

## Preconditions
The repository root is canonicalized and the current OS/user watch limit is known or measurable.

## Action
1. Collect current watcher count or the best available process-level approximation.
2. If a watched-path inventory exists, run:
   `python scripts/watcher_budget.py --paths <paths.txt> --limit <max_user_watches>`
3. Evaluate utilization against policy thresholds.
4. Check the active watcher registry for an existing watcher on the same canonical repository.
5. Return `allow`, `warn`, `reuse-existing`, or `block-new`.

## Expected result
New watcher creation is blocked above the configured capacity threshold unless an explicit reviewed exception exists; duplicate repo watchers are reused when safe.

## Failure behavior
If the limit cannot be measured, emit `warn` and require a recorded evidence gap. If utilization is already above the block threshold, fail closed for new broad watchers.

## Blocks completion
Yes when the hook returns `block-new` and the requested scope is non-essential. A correctness-critical watcher may proceed only with documented approval and a rollback/monitoring plan.
