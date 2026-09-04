# Pre-task Validation Hook

## Trigger
Before repository investigation or edits.

## Preconditions
Run from this package directory with Python 3.10+ available.

## Action
1. Confirm the target repository path exists.
2. Load `config/outbox-gate.json` as valid JSON.
3. Run the deterministic scanner in read-only mode.
4. Preserve scanner JSON as investigation evidence.

## Command

```bash
python3 scripts/scan-outbox-risk.py --repo /path/to/repository --config config/outbox-gate.json --output /tmp/outbox-scan.json
```

## Expected result
Exit 0 when scanning succeeds. Findings prioritize investigation and are not proof by themselves.

## Failure behavior
Invalid config, unreadable repository, or scanner execution failure blocks edits until resolved. Do not bypass by increasing permissions.

## Blocking
Yes for execution failure; no for ordinary scanner findings until investigated.
