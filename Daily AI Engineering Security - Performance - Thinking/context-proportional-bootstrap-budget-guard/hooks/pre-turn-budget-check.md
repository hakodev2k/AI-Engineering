# Hook: Pre-Turn Budget Check

## Trigger
Immediately before the first model call, and after any model or capability-manifest change.

## Preconditions
Context window and manifest are available.

## Action
Run the deterministic budget analyzer.

## Command
```bash
python scripts/bootstrap_budget.py --context-window "$CONTEXT_WINDOW" --manifest "$BOOTSTRAP_MANIFEST" --policy config/budget-policy.json
```

## Expected result
Exit 0 with `status=pass` and explicit remaining task/output capacity.

## Failure behavior
Exit 2 blocks first-turn execution when a known context window violates policy or required kinds are absent. Exit 1 indicates invalid input/configuration and also blocks enforcement claims.

## Blocking
Yes for production enforcement. Advisory-only mode is permitted only when the context window is genuinely unknown and must be explicitly labeled.