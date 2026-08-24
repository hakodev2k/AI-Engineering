# Hook: Post-Job Memory Check

## Trigger
A background-agent batch or long-running worker job reaches terminal state.

## Preconditions
Baseline snapshot exists; no new job starts during cooldown; process match expression is reviewed.

## Action
Wait the configured cooldown, then invoke the comparison command against the baseline.

## Command
`python3 scripts/process_memory_guard.py compare --baseline baseline.json --match 'claude|codex' --cooldown-seconds 120 --max-growth-mb 512 --max-stale 2`

## Expected result
Exit 0 and a report showing post-job tree RSS/worker count within policy.

## Failure behavior
Exit 2 blocks performance completion and stores process evidence. Exit 1 blocks verification because collection failed. Do not kill processes automatically.

## Blocks completion
Yes. A failing or indeterminate memory check blocks a claim that the workload is performance-safe.