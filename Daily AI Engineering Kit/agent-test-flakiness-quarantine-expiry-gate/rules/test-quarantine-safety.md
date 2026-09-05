# Test Quarantine Safety Rules

## MUST
- Prove nondeterminism before adding quarantine.
- Give every active quarantine a unique test id, owner, evidence reference, created date, and expiry date.
- Keep active lifetime within `max_quarantine_days`.
- Run `scripts/quarantine_gate.py` before merge.
- Preserve original failure evidence.
- Restore coverage as soon as stability is proven.
- Require independent verification for quarantine extensions and removals.

## MUST NOT
- Quarantine a deterministic product regression.
- Add broad test-folder exclusions when a single test can be isolated.
- Disable coverage thresholds to make quarantine acceptable.
- Extend an expired quarantine silently.
- Use unlimited retries or reruns-until-green.
- Delete evidence to clear a gate.
- Deploy production, alter infrastructure/secrets, force push, perform destructive operations, or weaken security without explicit approval.

## SHOULD
- Prefer fixing shared-state, clock, randomness, ordering, and network nondeterminism over quarantining.
- Keep quarantine duration shorter than the policy maximum when practical.
- Link quarantines to owned defect tracking.
