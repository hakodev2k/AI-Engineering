# Data Access Rules

## Purpose
Apply Zero Trust principles directly to data so access is governed by identity, purpose, sensitivity, and context rather than network location.

## Scope
Applies to databases, object stores, analytics platforms, files, backups, data APIs, and sensitive exports.

## MUST
- Data access MUST be authorized at the narrowest practical resource and action scope.
- Sensitive datasets MUST have explicit ownership, classification, and access policy.
- Bulk export and destructive data operations MUST require stronger controls than routine reads.
- Access to sensitive data MUST be auditable to an attributable identity.

## MUST NOT
- MUST NOT grant broad data access solely because an application runs in a trusted environment.
- MUST NOT expose sensitive fields when the requester needs only a subset.
- MUST NOT bypass row-, column-, object-, or tenant-level controls during troubleshooting without approval.

## SHOULD
- Prefer purpose-limited and time-bounded access for exceptional analysis.
- Data policies SHOULD minimize copies and uncontrolled downstream propagation.

## Exceptions
Exceptional access requires reason, dataset owner approval, bounded duration, compensating monitoring, and post-use review where risk is high.

## Verification
Review data entitlements, query/audit logs, export controls, tenant-isolation tests, masking policies, and negative tests proving unauthorized identities cannot access protected records or fields.