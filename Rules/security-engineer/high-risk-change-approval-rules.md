# High-Risk Change Approval Rules

## Purpose
Prevent security-sensitive production changes from exceeding authorized risk and operational authority.

## Scope
Applies to production access changes, secret rotation, security-control changes, public exposure, identity policy changes, destructive operations, and major security tooling changes.

## MUST
- High-risk changes MUST identify scope, expected effect, security impact, verification plan, and rollback or recovery strategy.
- Production security changes with material blast radius MUST require explicit human approval from an authorized owner.
- Emergency changes MUST preserve an audit trail and receive post-change review.
- Breaking security-policy changes MUST document affected systems and migration requirements.
- Approval authority MUST be independent enough to challenge unsafe changes.

## MUST NOT
- MUST NOT weaken a security control solely to unblock deployment without explicit risk approval.
- MUST NOT perform destructive or irreversible security changes without a recovery plan where recovery is feasible.
- MUST NOT treat prior approval for a different scope as authorization for a broader action.

## SHOULD
- Prefer staged, reversible changes and narrow rollout scope.
- Use peer review for policy-as-code and privileged configuration changes.

## Exceptions
Urgent containment may precede normal approval only when delay creates greater immediate risk; reason and post-action approval MUST be recorded.

## Verification
Use change records, pull requests, approval logs, configuration diffs, deployment evidence, rollback tests, and post-change validation.