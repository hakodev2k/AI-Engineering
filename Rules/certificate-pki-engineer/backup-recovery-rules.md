# PKI Backup and Recovery Rules

## Purpose
Recover PKI capability without weakening key security or trust integrity.

## Scope
CA databases, configurations, HSM state, key backups, status services, and recovery environments.

## MUST
- Recovery objectives MUST identify which PKI components and cryptographic material are required to restore service.
- Backups MUST preserve confidentiality, integrity, access control, and version compatibility.
- Recovery procedures MUST be tested periodically in an isolated environment.
- Restored CA state MUST be checked for issuance sequence, revocation state, configuration, and audit continuity before service resumes.

## MUST NOT
- MUST NOT keep plaintext CA-key backups in general-purpose storage.
- MUST NOT assume backup success without restore evidence.
- MUST NOT reconnect a recovered issuer to production before integrity checks and authorization.

## SHOULD
- Recovery tests SHOULD include loss of a primary HSM or CA node.

## Exceptions
Unmet recovery objectives require documented risk and remediation ownership.

## Verification
Inspect backup policy, restore test evidence, cryptographic protection, access logs, and recovery sign-off.