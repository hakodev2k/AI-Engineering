# Security and Sharing Rules

## Purpose
Ensure application behavior respects Salesforce identity, sharing, and object/field access controls.

## Scope
Applies to Apex, Lightning components, integrations, batch jobs, and privileged operations.

## MUST
- Code MUST deliberately choose and document sharing behavior for privileged classes.
- Object- and field-level access MUST be enforced where user-context access is required.
- Elevated operations MUST apply least privilege and expose only the minimum required data.
- Security-sensitive changes MUST include tests for authorized and unauthorized users.

## MUST NOT
- MUST NOT bypass sharing or field security merely to simplify implementation.
- MUST NOT expose sensitive fields through Apex or UI APIs without authorization checks.
- MUST NOT treat successful execution as evidence of correct access control.

## SHOULD
- User-mode operations SHOULD be preferred when compatible with the required behavior.
- Permission sets SHOULD be favored over broad profile changes for incremental access.

## Exceptions
Exceptions require documented business need, threat analysis, compensating controls, and approval.

## Verification
Review sharing declarations, CRUD/FLS enforcement, permission configuration, negative tests, and security scanner findings.