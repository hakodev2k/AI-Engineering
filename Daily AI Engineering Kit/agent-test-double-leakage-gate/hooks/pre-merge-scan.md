# Hook: Pre-Merge Leakage Scan

## Trigger
Before accepting changes touching deployable code/configuration.

## Action
```bash
git diff --name-only --diff-filter=ACMR origin/main...HEAD > .test-double-changed-files.txt
python scripts/scan_test_double_leakage.py --root . --policy config/leakage-policy.json --changed-files .test-double-changed-files.txt --output test-double-leakage-report.json
```

## Expected result
Exit `0`, status `clean`, zero blocking findings.

## Failure behavior
Exit `2`, `4`, or `5` blocks merge. Do not automatically add exceptions.

## Blocking
Yes for deployable changes.