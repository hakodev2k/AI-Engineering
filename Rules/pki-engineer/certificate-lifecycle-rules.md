# Certificate Lifecycle

## Purpose
Control certificates from request through expiration, replacement, revocation, and archival.

## Scope
Applies to all managed certificate classes and their operational lifecycle.

## MUST
- Every managed certificate MUST have an identifiable owner, purpose, issuer, expiration, renewal path, and revocation path.
- Lifecycle tooling MUST detect certificates approaching expiration with enough lead time for safe replacement.
- Replacement procedures MUST account for overlapping validity and dependent trust propagation.
- Retired certificates and obsolete bindings MUST be removed from active systems.

## MUST NOT
- MUST NOT depend on undocumented manual renewal for critical production certificates.
- MUST NOT leave expired or superseded certificates configured as active fallbacks without documented need.
- MUST NOT treat successful issuance as proof that deployment completed everywhere.

## SHOULD
- Maintain a continuously reconciled certificate inventory.
- Prefer automated renewal and deployment for recurring certificate classes.

## Exceptions
Require owner, justification, expiry, monitoring, and recovery plan.

## Verification
Compare CA issuance data, inventory, endpoint scans, deployment configuration, expiration alerts, and revocation records.