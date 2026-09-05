# Hook: Pre Merge

## Trigger
Before merging changes that touch tests, quarantine registry, retry settings, or test-selection configuration.

## Action
```bash
python scripts/quarantine_gate.py --registry quarantine.json --policy config/quarantine-policy.json --report quarantine-report.json
python scripts/verify_package.py
```
Then run the host repository's relevant build/test/static checks.

## Expected result
No blocking quarantine finding and no unintended coverage reduction.

## Failure behavior
Any gate/test failure blocks completion. Do not auto-renew expired entries.

## Blocking
Yes.
