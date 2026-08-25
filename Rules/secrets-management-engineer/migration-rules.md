# Secrets Migration Rules

## Purpose
Move credentials or secrets platforms without loss, exposure, unintended privilege changes, or service outage.

## Scope
Provider migrations, namespace redesign, key-store moves, credential-type replacement, and application onboarding to centralized management.

## MUST
- Migration plans MUST inventory affected consumers, credential semantics, access policies, dependencies, rollback boundaries, and validation criteria.
- Secret values MUST use protected migration mechanisms and MUST NOT transit through unmanaged intermediate storage.
- Access equivalence MUST be reviewed; migration MUST NOT silently broaden privileges.
- Cutover MUST verify consumer health and old-system decommissioning or revocation state.

## MUST NOT
- Destructive removal of the source system MUST NOT occur before recovery and rollback requirements are satisfied and approved.
- Migration success MUST NOT be inferred solely from copied object counts.
- Bulk export MUST NOT be used when safer non-export or reissuance methods are practical.

## SHOULD
- Prefer reissuing credentials in the target platform over copying long-lived values.
- Stage migrations by bounded blast radius.

## Exceptions
Bulk or irreversible migrations require explicit security/operations approval, additional evidence, and recovery planning.

## Verification
Compare inventories and policies, inspect migration logs, validate application authentication, test rollback where feasible, confirm old credential disposition, and review audit trails.