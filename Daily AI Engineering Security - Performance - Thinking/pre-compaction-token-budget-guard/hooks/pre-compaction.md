# Hook: Pre-Compaction Budget Check

## Trigger
Immediately before an agent compacts/summarizes context.

## Preconditions
Validated budget config and current measured input-token count.

## Action
Run the canonical budget calculator and persist its JSON result with the compaction event.

## Script / command
`python scripts/context_budget_guard.py <budget.json> <used_tokens>`

## Expected result
Exit 3 only when the configured utilization threshold has been reached. Exit 0 means compaction is not yet due.

## Failure behavior
Exit 1 blocks automatic compaction because accounting/configuration is invalid. Do not guess a larger context capacity.

## Blocks completion
Yes for automatic compaction decisions. Operators may fall back to a known-safe provider limit rather than silently expanding capacity.