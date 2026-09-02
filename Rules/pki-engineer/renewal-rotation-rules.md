# Renewal and Rotation

## Purpose
Replace certificates and keys before expiry or compromise without unsafe continuity gaps.

## Scope
Applies to certificate renewal, rekey, rollover, overlapping validity, and dependent deployments.

## MUST
- Renewal schedules MUST provide sufficient time for validation, issuance, deployment, propagation, and rollback.
- Rekey MUST be used when policy, key age, compromise suspicion, or cryptographic migration requires a new key pair.
- CA rollover MUST account for chain building, trust-store propagation, and the longest relevant leaf-certificate lifetime.
- Rotation completion MUST be verified on actual relying endpoints, not only in the issuing system.

## MUST NOT
- MUST NOT reuse compromised or suspect private keys during renewal.
- MUST NOT wait until certificate expiration to begin planned CA or trust-anchor rollover.
- MUST NOT remove an old trust path before required relying parties accept the replacement.

## SHOULD
- Exercise rollover procedures before critical deadlines.
- Prefer automated, observable rotations for short-lived certificates.

## Exceptions
Require documented dependency constraints, risk, monitoring, rollback, and owner approval.

## Verification
Review renewal schedules, certificate/key fingerprints, endpoint scans, trust-store telemetry, rollout evidence, and rollback tests.