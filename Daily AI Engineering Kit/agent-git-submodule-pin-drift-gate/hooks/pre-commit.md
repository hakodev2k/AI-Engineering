# Hook: Pre-Commit Submodule Gate

## Trigger
Before an agent creates a commit or reports a code change complete.

## Command

```bash
python scripts/scan_submodules.py --repo . --policy config/policy.json --baseline HEAD --output .artifacts/submodule-report.json
```

## Expected result
Exit `0` when no policy-sensitive drift exists. Exit `3` blocks until approval evidence exists. Exit `2`, `4`, or `5` blocks unconditionally until resolved.

## Failure behavior
Fail closed. Preserve `.artifacts/submodule-report.json` when produced. Never discard submodule changes automatically.

## Blocking
Yes.