# Hook: Pre-task Validation

## Trigger
Before repository investigation or edits.

## Preconditions
Package copied intact; Python 3.10+ available.

## Action
Run:

```bash
python3 scripts/validate-config.py --config config/outbox-gate.json
```

Then confirm the target repository exists and is readable.

## Expected result
Exit code 0 and `configuration valid`.

## Failure behavior
Block execution. Preserve stderr/stdout. Do not edit code until configuration is valid.

## Blocking
Yes.
