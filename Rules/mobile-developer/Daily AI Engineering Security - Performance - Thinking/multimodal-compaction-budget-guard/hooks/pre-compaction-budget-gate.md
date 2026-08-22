# Hook: Pre/Post Compaction Budget Gate

## Trigger
Before compaction, immediately after compaction, and before fork/resume materialization of multimodal history.

## Preconditions
Normalized history JSON and budget configuration are available; protected evidence has not been removed.

## Action
Run:

`python scripts/multimodal_budget.py --input <history.json> --context-window <n> --trigger <n> --required-headroom <n> --max-images <n> --max-inline-bytes <n>`

## Expected result
Exit `0` with `decision=PASS`. The report includes image count, inline bytes, duplicate bytes, estimated text tokens, projected utilization, and headroom.

## Failure behavior
Exit `2` means a configured budget or hysteresis threshold failed. Exit `1` means invalid input. Both block compaction completion/fork materialization.

## Blocking
Yes for post-compaction and pre-fork/resume validation. A pre-compaction failure is an optimization trigger, not permission to drop required evidence.

## Verification
After optimization rerun the hook and compare against baseline. A reviewer must also confirm task acceptance/quality has not regressed.