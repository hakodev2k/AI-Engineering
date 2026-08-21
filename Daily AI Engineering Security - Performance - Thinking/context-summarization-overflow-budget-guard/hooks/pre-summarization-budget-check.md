# Hook: Pre-Summarization Budget Check

## Trigger
Immediately before any summarization or context-compaction model call.

## Preconditions
Envelope JSON, required IDs, and `config/token-policy.json` exist.

## Action
Run `python scripts/context_budget_guard.py envelope.json --policy config/token-policy.json`.

## Expected result
Exit 0 = envelope fits; exit 3 = trimming required; exit 4 = block because required context/budget cannot fit; exit 2 = invalid input.

## Failure behavior
Invalid input or blocked required context prevents the model call. Trimming is allowed only within configured attempts and must produce a changed payload.

## Blocks completion
Yes when required context cannot fit or the envelope remains oversized after bounded trimming.
