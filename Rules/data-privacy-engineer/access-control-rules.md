# Privacy Access Control Rules

## Purpose
Restrict access to personal data according to legitimate need, context, and least privilege.

## Scope
Applies to applications, services, support tools, analytics platforms, databases, data lakes, exports, and administrative interfaces.

## MUST
- Access to personal data MUST be explicitly authorized by role, purpose, or policy and limited to the minimum required scope.
- Privileged access MUST be auditable and periodically reviewed.
- Service identities MUST receive only the permissions needed for their processing function.
- High-risk bulk access and export capabilities MUST have additional controls and review.
- Authorization changes affecting sensitive data MUST be tested before production use.

## MUST NOT
- Shared credentials MUST NOT be used for accountable access to sensitive personal data.
- Production data access MUST NOT be granted solely because an engineer can technically reach the system.
- Authorization checks MUST NOT rely only on hidden UI elements.

## SHOULD
- Time-bound and just-in-time privilege SHOULD be used for exceptional access.
- Field- or row-level controls SHOULD be used where dataset-level access is unnecessarily broad.

## Exceptions
Emergency access requires documented reason, limited duration, audit trail, and post-event review.

## Verification
Inspect IAM policies, database grants, application authorization tests, support-tool permissions, access logs, review records, and export controls.