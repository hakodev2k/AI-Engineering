# Production Change Safety

## Purpose
Control operational risk when changing vector database infrastructure, indexes, configuration, data, or public retrieval behavior.

## Scope
Applies to deployments, configuration, index replacement, destructive operations, dependency upgrades, access changes, and emergency actions.

## MUST
- Production changes MUST define scope, expected impact, verification, rollback/recovery, and responsible owner.
- High-risk changes MUST use staged or canary rollout when the platform supports meaningful progressive validation.
- Destructive data operations, irreversible migrations, infrastructure destruction, secret rotation, breaking contracts, and weakened security controls MUST require explicit human approval before execution.
- Agents MUST distinguish analysis, recommendation, preparation, and execution and MUST NOT silently exceed granted authority.
- Change verification MUST inspect user-impact signals, retrieval quality where relevant, and system health.

## MUST NOT
- MUST NOT force-push or rewrite shared Git history as part of routine remediation.
- MUST NOT bypass change controls merely because automation can execute the operation.
- MUST NOT continue rollout after predefined stop conditions are met.

## SHOULD
- Changes SHOULD be reversible by design.
- Maintenance windows SHOULD be used when progressive deployment cannot bound risk.
- Large dependency upgrades SHOULD be isolated from unrelated functional changes.

## Exceptions
Emergency changes require documented authorization, bounded blast radius, evidence, recovery plan, and retrospective review.

## Verification
Review approvals, deployment records, diffs, canary metrics, rollback tests, audit logs, and post-change validation.