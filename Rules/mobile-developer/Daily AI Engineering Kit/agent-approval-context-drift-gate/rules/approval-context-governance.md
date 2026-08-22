# Approval Context Governance

## MUST
- Bind every approval-required action to an exact context fingerprint covering task, risk, action type, environment, revision, plan, resources, commands, permissions, actor, and dangerous-action flag.
- Reconstruct and fingerprint the current execution context immediately before the side effect.
- Treat any fingerprint mismatch as invalidation of the old approval.
- Obtain a new approval after any material context change; approvals are immutable evidence.
- Require independent review for high/critical risk; reviewer must differ from executor.
- Require explicit human approval before production deployment, destructive SQL, schema/data deletion, force push/history rewrite, infrastructure/secret/production-config changes, breaking APIs, weakened security, irreversible migrations, or large dependency upgrades.
- Preserve approval, review, drift report, and final-gate output as evidence.
- Distinguish `approved`, `executed`, and `verified` states.

## MUST NOT
- Treat approval as permission for a broader resource set, command set, environment, or permission scope.
- Reuse an approval after repository revision, plan, resources, commands, permissions, actor, risk, or environment changes.
- Infer approval from silence, previous similar work, chat sentiment, or role seniority.
- Edit an approval record to match changed context.
- Allow executor self-review for high/critical risk.
- Increase permissions to make a previously approved action executable.
- Retry deterministic fingerprint mismatches.
- Claim an external side effect occurred because the gate returned `verified`.

## SHOULD
- Keep resource and command sets minimal and deterministic.
- Use canonical JSON or sorted text before hashing variable-size sets.
- Request approval as late as practical, after plan stabilization and verification.
- Include human-readable summaries beside fingerprints so approvers understand what they approve.
