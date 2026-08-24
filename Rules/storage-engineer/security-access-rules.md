# Storage Security and Access Rules

## Purpose
Protect storage control planes and data paths using least privilege and secure defaults.

## Scope
Administrative access, service identities, ACLs, exports, buckets, shares, and storage APIs.

## MUST
- Administrative and data access MUST follow least privilege and separation of duties appropriate to impact.
- Privileged operations MUST be attributable to authenticated identities.
- Public or cross-boundary access MUST be explicitly justified and reviewed.
- Access policy changes affecting sensitive or production data MUST be reviewed and auditable.

## MUST NOT
- MUST NOT use shared privileged credentials where individual or workload identities are available.
- MUST NOT expose storage endpoints publicly by default.
- MUST NOT weaken authentication or authorization merely to resolve connectivity problems.

## SHOULD
- Use short-lived credentials, centralized identity, and automated policy checks where supported.

## Exceptions
Emergency access requires controlled break-glass procedures, logging, expiry, and retrospective review.

## Verification
Inspect IAM policies, ACLs, endpoint exposure, authentication settings, audit logs, and privileged-access records.