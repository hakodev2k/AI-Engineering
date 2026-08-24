# Device Identity and Attestation
## Purpose
Establish trustworthy machine identity for distributed edge nodes.
## Scope
Provisioning, enrollment, authentication, and trust evaluation.
## MUST
- Each node MUST use unique, revocable identity material.
- Enrollment MUST authenticate the device or its authorized provisioning process.
- Trust-sensitive actions MUST validate identity and current authorization.
## MUST NOT
- MUST NOT share static credentials across a fleet.
- MUST NOT treat network location as device identity.
- MUST NOT accept unverifiable attestation claims as proof of integrity.
## SHOULD
- Hardware-backed keys and measured boot attestation SHOULD be used where threat models justify them.
## Exceptions
Legacy-device exceptions require compensating controls, bounded access, migration plan, and security approval.
## Verification
Inspect PKI/IAM configuration, enrollment logs, credential uniqueness, revocation tests, and attestation validation.