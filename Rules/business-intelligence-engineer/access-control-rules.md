# Access Control Rules

## Purpose
Ensure BI access follows least privilege and business authorization boundaries.

## Scope
Applies to warehouses, semantic models, reports, dashboards, extracts, and embedded analytics.

## MUST
- Access to production BI assets MUST be granted through identifiable principals or governed groups.
- Row-level, object-level, or tenant-level restrictions MUST be tested using representative identities before release.
- Privileged access changes MUST be auditable.
- Access reviews MUST consider downstream exports and cached copies where applicable.

## MUST NOT
- MUST NOT bypass authorization controls to simplify report development.
- MUST NOT rely on hidden UI elements as an access-control mechanism.

## SHOULD
- Access SHOULD be role-based and time-bounded for elevated troubleshooting privileges.

## Exceptions
Exceptions require business owner approval, security risk assessment, compensating controls, and review date.

## Verification
Inspect permission assignments, identity groups, authorization tests, audit logs, and export settings.