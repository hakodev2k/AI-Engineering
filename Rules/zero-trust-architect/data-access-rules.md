# Data Access Rules

## Purpose
Protect sensitive data by applying identity, context, classification, and least-privilege controls at the point of access.

## Scope
Applies to databases, object stores, files, analytics platforms, SaaS data, APIs, exports, backups, and administrative data access.

## MUST
- Sensitive data MUST have an assigned classification that informs authorization, logging, retention, and handling controls.
- Access to sensitive data MUST require explicit authorization tied to identity, purpose, and permitted action.
- Bulk export, administrative access, and destructive operations MUST receive stronger controls than routine read access where risk differs.
- Data-layer enforcement MUST exist for critical datasets when application-layer controls alone cannot reliably prevent bypass.
- Privileged data access MUST be attributable and auditable.
- Data access from unmanaged or high-risk contexts MUST be restricted according to documented policy.

## MUST NOT
- Network location alone MUST NOT authorize access to sensitive data.
- Broad standing access to sensitive datasets MUST NOT be granted when just-in-time or scoped access is practical.
- Sensitive data MUST NOT be copied into lower-trust environments without approved protection and handling controls.
- Logging MUST NOT expose secrets or unnecessary sensitive payloads.

## SHOULD
- Row-, column-, object-, or field-level controls SHOULD be used where coarse resource permissions are insufficient.
- Tokenization, masking, or redaction SHOULD reduce exposure where full-value data is unnecessary.
- Access reviews SHOULD prioritize high-value and high-volume datasets.

## Exceptions
Exceptions require business purpose, exact scope, data classification, risk, compensating controls, owner, expiry, and approval from the accountable data or security owner.

## Verification
Inspect classification records, policies, grants, audit logs, export controls, service identities, query paths, and negative tests. Confirm alternate interfaces cannot bypass required authorization.