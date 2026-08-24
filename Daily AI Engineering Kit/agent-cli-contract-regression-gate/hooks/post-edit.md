# Hook: Post Edit

## Trigger

After edits to CLI registration, parser definitions, command handlers that define exit semantics, or public CLI docs/tests.

## Preconditions

A baseline contract exists and a candidate contract can be generated.

## Action

Run the repository-specific candidate extractor, then:

```bash
python scripts/compare_cli_contract.py \
  --baseline "$CLI_BASELINE" \
  --candidate "$CLI_CANDIDATE" \
  --policy config/policy.json \
  --output "$CLI_REPORT"
```

## Expected result

Exit `0` for compatible changes.

## Failure behavior

Exit `2` blocks the change until findings are resolved or explicitly approved. Exit `4` or `5` blocks execution until the deterministic issue is corrected.

## Blocking

Yes for merge readiness.