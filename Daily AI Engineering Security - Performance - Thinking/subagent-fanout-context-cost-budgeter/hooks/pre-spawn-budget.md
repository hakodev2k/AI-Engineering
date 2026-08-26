# Hook — Pre-Spawn Token Budget

## Trigger
Immediately before creating a batch of subagents.

## Preconditions
Number of children, measured/estimated child fixed tokens, inherited context, unique work estimate, serial baseline, and configured budget thresholds are available.

## Action
Write the metrics envelope and run `python scripts/fanout_budgeter.py <metrics.json>`.

## Expected result
Exit 0 with `allow_fanout` only when predicted total tokens and fanout-to-serial ratio are within policy.

## Failure behavior
Exit 3 blocks the proposed fan-out. The coordinator must regroup tasks, narrow nonessential inherited context/tool surfaces, reduce polling, or choose serial execution.

## Blocks completion
It blocks spawning, not task completion. The task must continue through a budget-compliant alternative when one is available.
