# Privacy Access Control Rules

## Purpose
Ensure access to personal data is limited to justified roles and purposes.

## Scope
Production data, analytics platforms, support tools, exports, data lakes, backups, and administrative interfaces.

## MUST
- Access to personal data MUST follow least privilege and purpose-based need.
- Sensitive datasets MUST have explicit owners and approvers.
- Privileged access MUST be attributable to individual actors or controlled service identities.
- Access changes MUST be logged and periodically reviewed.
- High-risk bulk export capability MUST be restricted and monitored.

## MUST NOT
- MUST NOT grant broad standing access solely for convenience.
- MUST NOT use shared credentials for access to sensitive personal data.
- MUST NOT allow test or support environments to bypass production-grade privacy controls without approved safeguards.

## SHOULD
- Prefer just-in-time access, scoped views, row/column controls, and masked data.

## Exceptions
Require documented purpose, owner, duration, compensating controls, and approval.

## Verification
Inspect IAM policies, role mappings, access logs, review records, export controls, and entitlement tests.