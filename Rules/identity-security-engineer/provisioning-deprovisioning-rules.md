# Provisioning and Deprovisioning Rules

## Purpose
Ensure access is granted from authoritative need and removed reliably when that need changes.

## Scope
Applies to automated and manual account provisioning, group membership, entitlement assignment, and revocation.

## MUST
- Provisioning MUST derive from an approved request, authoritative attribute, or controlled policy.
- Deprovisioning MUST remove direct and inherited access paths within the defined service objective.
- Provisioning failures MUST be observable and reconciled; silent partial success is unacceptable.
- Entitlement changes MUST preserve requester, approver, target, reason, and timestamp evidence where applicable.
- Bulk provisioning changes MUST be previewed and impact-assessed before production execution.

## MUST NOT
- Default onboarding MUST NOT grant privileged access unrelated to the user's role.
- Manual emergency grants MUST NOT bypass later reconciliation.
- Deprovisioning MUST NOT rely solely on users remembering to surrender access.

## SHOULD
- Prefer idempotent provisioning and reconciliation against desired state.
- Use expiration for temporary access whenever technically practical.

## Exceptions
Exceptions require documented owner, reason, scope, duration, risk, and compensating controls.

## Verification
Inspect provisioning workflows, failed-job queues, reconciliation reports, entitlement diffs, termination samples, and bulk-change audit logs.