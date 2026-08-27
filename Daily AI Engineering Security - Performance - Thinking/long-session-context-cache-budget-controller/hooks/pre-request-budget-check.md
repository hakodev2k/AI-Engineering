# Hook: Pre-Request Context Budget Check

## Trigger
Immediately before a model request after any user message, tool output, retrieval result, or idle resume.

## Preconditions
Current context estimate and pending additions are available.

## Action
Write a `state.json` containing the required token/cache metrics, then run `python scripts/context_budget_guard.py --state state.json --policy config/policy.json`.

## Expected result
A deterministic recommendation: `continue`, `checkpoint_or_compact`, or `new_session_with_checkpoint`.

## Failure behavior
Malformed or incomplete telemetry prevents an optimization claim and defaults to conservative checkpoint/compact behavior.

## Blocks completion
It blocks sending a request only when projected usage would exceed the configured hard budget; other recommendations are handed to the orchestrator policy.
