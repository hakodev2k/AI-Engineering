# Hook — Pre-Model Context Integrity Check

## Trigger
Immediately before sending a trimmed, compacted, resumed, or memory-windowed history to a model/provider.

## Preconditions
Structured history contains explicit roles and tool-call identifiers. A reviewed budget configuration exists.

## Action
Run:

`python3 scripts/context_pruner.py context.json --config config/budget.json --output pruned.json`

Use the `messages` array from `pruned.json` only when the command exits `0`.

## Expected result
Exit `0`: output is structurally valid and fits the configured input budget. Exit `2`: invalid history/configuration. Exit `4`: budget cannot be met without dropping protected context.

## Failure behavior
Any nonzero exit blocks the model invocation on the pruned history. Preserve the last valid context/checkpoint. Do not resubmit unchanged malformed history and do not bypass validation to avoid an error.

## Blocks completion
Yes. A context optimization is not complete until structural integrity and the budget/quality gates pass.
