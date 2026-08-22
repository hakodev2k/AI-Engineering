# Final Verification Hook

## Trigger
After edits and tests, before declaring the task verified.

## Preconditions
Targeted tests/build already executed; current diff is available.

## Action
1. Run `python scripts/scan-resilience.py --root . --policy config/gate-policy.json --output circuit-breaker-findings.after.json`.
2. Run `python scripts/verify-package.py --root .` when validating this kit itself.
3. Inspect changed files and test output.
4. Have the Verification Agent evaluate the workflow Definition of Done.

## Expected result
No unexplained blocking finding, tests pass, no unintended/approval-required changes, and verifier status is `pass`.

## Failure behavior
Do not convert execution into success. Preserve scanner/test/diff evidence. Tool/environment failures may retry twice; validation failures return to planning once, then stop.

## Blocking
Yes. Any unresolved high/critical finding, failed required test, missing approval, or verifier `fail/blocked` prevents completion.
