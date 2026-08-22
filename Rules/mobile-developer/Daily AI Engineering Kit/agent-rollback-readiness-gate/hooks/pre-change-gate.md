# Hook: Pre-Change Rollback Gate

## Trigger

Run before a deployment/release handoff, migration execution, production configuration change, infrastructure apply, or other high-risk execution stage.

## Preconditions

- Git repository is clean enough to identify intended changes.
- `BASE_REF` and `HEAD_REF` resolve locally.
- Python 3.9+ is available.
- Package config exists at `config/rollback-readiness.json`.

## Action

Run:

```bash
python scripts/assess-changes.py \
  --base "$BASE_REF" \
  --head "$HEAD_REF" \
  --config config/rollback-readiness.json \
  --output .ai/rollback-assessment.json
```

Then inspect the exit code and generated assessment.

## Expected result

- Exit `0`: deterministic scan found no configured approval category; continue to human/agent review.
- Exit `2`: approval-required risk detected; block execution and route to the rollback-readiness workflow.
- Exit `3`: tool/config/Git failure; block execution and preserve stderr.

## Failure behavior

A nonzero exit blocks the dangerous execution stage. Retry only transient failures and no more than two times. Permission or configuration failures are not bypassed by broadening privileges.

## Blocking

Yes. This hook is intentionally conservative because it runs before actions that may be difficult to reverse.
