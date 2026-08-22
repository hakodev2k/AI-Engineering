# Hook: Pre-Model Context Budget

## Trigger
Immediately before invoking the model, after every prompt/context middleware has completed.

## Preconditions
The host can provide measured token counts for each final context component and knows the configured model context window.

## Action
Write a secret-free component-count manifest and run:

```bash
python scripts/context_budget.py <context.json> --policy config/budget.json
```

## Expected result
Exit `0`: send request. Exit `3`: invoke bounded reduction workflow or block. Exit `2`: invalid/unknown measurement; block automatic send.

## Failure behavior
Do not bypass on analyzer failure. Preserve the budget report and choose a correctness-preserving fallback.

## Blocking
Yes for requests that are over/invalid. This hook prevents context-window failures and unsafe emergency truncation.