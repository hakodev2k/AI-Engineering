# Example Retirement Plan: `checkout-v2`

## Current state
`checkout-v2` is a temporary release flag. Assume rollout evidence has established the enabled branch as the permanent behavior and the rollback window has ended.

## Evidence required before cleanup
- 100% rollout sustained for the repository-defined stability window.
- No material regression in error rate, latency, conversion, or support incidents.
- No active rollback procedure still depends on the disabled branch.
- Reference scan is complete.
- Billing/public API compatibility risks are reviewed.

## Permanent behavior
Keep the enabled `checkout-v2` implementation.

## Planned code changes
1. Replace flag-guarded branching with the enabled branch implementation.
2. Preserve tests for the permanent checkout behavior.
3. Remove tests that exist only to exercise the obsolete disabled branch after equivalent regression coverage is retained.
4. Remove flag registration/configuration from repository-controlled configuration.
5. Remove telemetry used only to compare enabled vs disabled branches if no longer operationally useful.

## Approval
If cleanup changes billing contracts, public API compatibility, production rollout configuration, or destructive data behavior, stop for explicit human approval before applying those actions.

## Verification
Run:
```bash
python scripts/validate-feature-flags.py --records .feature-flags/flags.json --policy config/feature-flag-policy.json
python scripts/scan-flag-references.py --root . --records .feature-flags/flags.json --policy config/feature-flag-policy.json --output .feature-flags/reference-report.json
```
Then run the repository's affected unit/integration/E2E tests and build. The independent Flag Retirement Reviewer must return `pass` before the lifecycle record is considered verified as `retired`.

## Recovery
If post-cleanup tests fail, revise at most twice. If the same failure persists, restore or preserve the flag branch and escalate with the scanner/test evidence rather than continuing autonomous edits.