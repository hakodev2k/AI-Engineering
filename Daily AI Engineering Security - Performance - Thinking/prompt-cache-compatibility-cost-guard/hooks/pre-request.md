# Hook: Pre Request Cache Validation

## Trigger
Immediately before serializing or sending a model request that contains non-default prompt-cache controls.

## Preconditions
Model identifier, cache option object, recent usage telemetry, and policy file are available.

## Action
Run:
```bash
python scripts/cache_guard.py --request <request.json> --usage <usage.json> --policy config/cache-policy.json
```

## Expected result
Exit `0` for `pass` or `warn`; exit `3` for a blocking compatibility decision; exit `2` for invalid input/read failure.

## Failure behavior
Exit `3` MUST block network execution. Exit `2` MUST fail closed for explicit cache controls. Warning results SHOULD be recorded with metrics before continuing.

## Blocking
Yes for compatibility or invalid-input failure. Economic warnings are policy-configurable.
