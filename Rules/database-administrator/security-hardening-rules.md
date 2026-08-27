# Security Hardening

## Purpose
Reduce exploitable database attack surface while preserving operability.

## Scope
Database engines, listeners, extensions, protocols, operating settings, and administrative interfaces.

## MUST
- Supported security updates MUST be assessed against exposure and operational risk on a defined cadence.
- Unneeded services, extensions, protocols, and remote administrative surfaces MUST be disabled or restricted.
- Network exposure MUST be limited to required sources and destinations.
- Security-relevant configuration changes MUST be reviewed and auditable.

## MUST NOT
- MUST NOT disable encryption, authentication, auditing, or validation controls merely to simplify troubleshooting.
- MUST NOT expose database listeners directly to untrusted networks without an approved architecture and controls.
- MUST NOT rely on default credentials or insecure vendor defaults.

## SHOULD
- Hardening baselines SHOULD be codified and drift-detected.
- Configuration SHOULD follow secure defaults while documenting compatibility exceptions.

## Exceptions
Exceptions require threat context, compensating controls, expiry, owner, verification, and security approval for material risk.

## Verification
Use configuration inspection, vulnerability scanning, network tests, baseline comparison, patch inventory, and security review evidence.