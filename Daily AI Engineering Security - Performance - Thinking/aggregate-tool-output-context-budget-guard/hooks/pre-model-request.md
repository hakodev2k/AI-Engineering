# Hook: Pre Model Request Context Budget

## Trigger
Immediately before tool results are committed to the next model request.

## Preconditions
Current context estimate, all pending tool results, retry count, and `config/budget.json` are available.

## Action
Serialize pending context data and run:
`python scripts/context_budget_guard.py --event <event.json> --config config/budget.json`

## Expected result
Exit 0 only when individual result, aggregate turn, projected input, reserved-output, and safety-margin budgets all pass.

## Failure behavior
Exit 3 blocks the model request and routes oversized content to externalization/chunking/summarization. Exit 2 blocks on malformed inputs/configuration. Repeating the same overflow request beyond the configured retry bound is prohibited.

## Blocking
Yes.
