# Skill: Quarantine Decision
## Purpose
Create the smallest bounded quarantine when fixing immediately is impractical.
## Process
1. Confirm flaky evidence from investigator.
2. Prefer fixing root cause instead of quarantine when change is small and safe.
3. Quarantine only the exact failing test or narrowest parameterized case.
4. Assign a responsible owner.
5. Link evidence and repair context.
6. Choose expiry within `max_quarantine_days`.
7. Run deterministic quarantine gate.
8. Ensure active quarantine count stays within policy.
9. Require approval for renewal or broader scope.
10. Hand final registry and CI evidence to Verification Agent.
## Output
Registry change, rationale, owner, expiry, evidence, residual risk.
## Stop conditions
Blanket suite disablement, missing owner/evidence, policy violation, or approval-required change without approval.
