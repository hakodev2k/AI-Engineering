# Deployment and Release Safety

## Purpose
Reduce production risk from API platform changes.

## Scope
Deployments, progressive delivery, configuration rollout, rollback, and release verification.

## MUST
- Production changes MUST have explicit scope, health criteria, rollback path, and accountable approval.
- High-risk changes MUST use staged or progressive rollout where technically feasible.
- Release verification MUST check consumer-visible health, not deployment status alone.
- Configuration and binary versions MUST be traceable.

## MUST NOT
- MUST NOT execute production deployment or security-control weakening without required human approval.
- MUST NOT continue rollout after defined stop conditions are met.

## SHOULD
- Prefer reversible, backward-compatible releases and automated rollback signals.

## Exceptions
Emergency changes require incident linkage, approver, verification, and retrospective follow-up.

## Verification
Inspect deployment records, approvals, canary metrics, rollback tests, version inventory, and post-release checks.