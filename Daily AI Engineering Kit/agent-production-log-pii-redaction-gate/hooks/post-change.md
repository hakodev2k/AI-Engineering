# Hook: Post Change

## Trigger
After relevant edits.

## Action
1. Generate representative sanitized output.
2. Run `python scripts/log_redaction_gate.py --policy config/redaction-policy.json --input <sample> --output <report>`.
3. Run relevant host tests/build/static checks.
4. Run `python scripts/verify_package.py` when validating this kit itself.
5. Inspect changed logging call sites and structured properties.
6. Hand evidence to Verification Agent.

## Expected result
No blocking sensitive-data finding and complete validation evidence.

## Failure behavior
Scanner findings, test failures, policy errors, or unknown sink coverage block completion. Fix/retest is bounded to two cycles.

## Blocking
Yes.