# Post-edit Hook

## Trigger
After any adapter, schema, fixture, or package change.

## Action
Run `python scripts/run-contract-tests.py` followed by `python scripts/inspect-changes.py`.

## Expected result
All fixtures behave as declared and changed files are visible for review.

## Failure behavior
Block completion. The implementation agent may correct and retry once more; after two failed implementation/test attempts, escalate.

## Blocking
Yes.