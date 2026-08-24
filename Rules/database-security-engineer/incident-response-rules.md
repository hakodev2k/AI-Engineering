# Database Security Incident Response Rules

## Purpose
Contain database security incidents while preserving evidence, integrity, and recoverability.

## Scope
Covers suspected credential compromise, unauthorized access, exfiltration, destructive activity, malicious SQL, and control failure.

## MUST
- Response MUST distinguish containment, eradication, recovery, and evidence preservation.
- Potentially compromised credentials and sessions MUST be scoped and revoked or isolated according to incident authority.
- Investigators MUST preserve relevant audit, database, identity, network, and change evidence with reliable time context.
- Recovery decisions MUST validate data integrity and security controls, not only service availability.
- High-impact production actions MUST follow incident command authority and be recorded.

## MUST NOT
- Evidence MUST NOT be destroyed through unnecessary cleanup before preservation requirements are considered.
- Broad destructive actions MUST NOT be executed merely because compromise is suspected when safer containment exists.
- Root-cause claims MUST NOT exceed available evidence.

## SHOULD
- Maintain tested playbooks for common database compromise scenarios.
- Use isolated copies for forensic analysis when feasible.

## Exceptions
Emergency deviations require contemporaneous rationale, authority, action record, and retrospective review.

## Verification
Run tabletop or controlled exercises, inspect playbooks and access, validate evidence collection, test credential revocation, and confirm recovery checks include authorization, configuration, and integrity.