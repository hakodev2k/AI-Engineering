# Provisioning and Reconciliation Rules

## Purpose
Ensure requested access is provisioned accurately and system state converges to approved identity policy.

## Scope
SCIM, directory synchronization, connector-based provisioning, entitlement assignment, deprovisioning, and reconciliation.

## MUST
- Provisioning flows MUST be idempotent or otherwise safe under retry.
- Requested access MUST be translated deterministically into target-system permissions.
- Failures MUST be observable and routed for remediation within defined SLAs.
- Reconciliation MUST detect drift between approved state and effective target-system state.
- Deprovisioning MUST be verified on downstream systems, not assumed from upstream success.

## MUST NOT
- MUST NOT silently drop failed provisioning operations.
- MUST NOT repeatedly retry destructive or non-idempotent operations without safeguards.
- MUST NOT treat connector success as proof that effective access matches policy.

## SHOULD
- Provisioning SHOULD use durable correlation identifiers and preserve traceability from request to effective access.
- High-risk drift SHOULD trigger prioritized remediation or automated containment where safe.

## Exceptions
Exceptions require owner, documented failure mode, compensating process, monitoring, and expiry.

## Verification
Inspect connector logs, retry behavior, reconciliation reports, access-drift samples, deprovisioning evidence, and SLA metrics.