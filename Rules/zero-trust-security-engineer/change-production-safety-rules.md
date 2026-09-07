# Change and Production Safety Rules

## Purpose
Control security-sensitive production changes so Zero Trust protections are not weakened unintentionally or without authority.

## Scope
Applies to identity, access, network, certificate, device, policy, logging, and security-control changes in production.

## MUST
- Production security changes MUST have documented intent, scope, expected effect, verification, and rollback or containment plan.
- Changes that weaken controls, expand privileged access, alter trust roots, rotate critical secrets, or modify destructive authority MUST require human approval.
- Deployment sequencing MUST preserve a safe access path for recovery without creating uncontrolled bypasses.
- Post-change verification MUST confirm intended enforcement rather than relying only on successful deployment status.

## MUST NOT
- MUST NOT disable controls merely to unblock deployment or troubleshooting without approved exception.
- MUST NOT perform irreversible high-risk changes without explicit risk acceptance and recovery planning.
- MUST NOT force push or rewrite shared history to conceal or simplify security changes.

## SHOULD
- High-risk changes SHOULD use staged rollout, canaries, or limited scope before broad enforcement.
- Policy and infrastructure diffs SHOULD be independently reviewed.

## Exceptions
Emergency changes require authorized approval path, bounded scope, enhanced monitoring, and retrospective review.

## Verification
Inspect change records, Git diffs, approvals, rollout evidence, active configuration, access tests, logs, rollback readiness, and post-deployment control checks.