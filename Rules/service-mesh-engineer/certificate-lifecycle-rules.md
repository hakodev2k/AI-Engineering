# Certificate Lifecycle
## Purpose
Prevent identity outages and trust compromise from certificate failures.
## Scope
Issuance, CA hierarchy, rotation, expiry, revocation, key protection, and trust bundles.
## MUST
- Certificate expiry MUST be monitored with lead time sufficient for remediation.
- CA and trust-bundle rotations MUST support overlap where required for uninterrupted trust.
- Private key access MUST follow least privilege.
## MUST NOT
- MUST NOT distribute private CA keys through ordinary configuration channels.
- MUST NOT rotate trust roots without verified compatibility and rollback.
- MUST NOT ignore clock-skew effects on certificate validity.
## SHOULD
- Automated workload certificate rotation SHOULD be preferred over manual issuance.
## Exceptions
Manual certificates require owner, expiry tracking, storage controls, and rotation procedure.
## Verification
Inspect certificate chains, expiry alerts, key permissions, rotation tests, trust bundles, and handshake results.