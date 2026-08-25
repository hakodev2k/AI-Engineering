# Secret Storage Rules

## Purpose
Ensure secret material is stored only in systems designed to protect confidentiality, integrity, and access accountability.

## Scope
Vaults, key stores, HSM-backed services, application configuration, CI/CD secret stores, and local development handling.

## MUST
- Secret values MUST be stored in an approved secrets-management or cryptographic-key service appropriate to their sensitivity.
- Stored secrets MUST be encrypted with access controlled independently from ordinary application data where feasible.
- Administrative access MUST be strongly authenticated, least-privileged, and audited.
- Backup and replication mechanisms MUST preserve equivalent confidentiality controls.

## MUST NOT
- Secrets MUST NOT be stored plaintext in source code, images, build artifacts, logs, environment templates, shared drives, wikis, or general-purpose databases.
- Encryption keys protecting a secret store MUST NOT be colocated in a way that defeats the protection boundary.
- Convenience MUST NOT justify exporting recoverable secrets to unmanaged storage.

## SHOULD
- Prefer non-exportable key material and hardware-backed protection for high-impact credentials.
- Development secrets SHOULD be isolated from production secrets.

## Exceptions
Any alternate storage requires documented threat analysis, compensating controls, time bound, validation, and security approval.

## Verification
Inspect configuration, access policies, encryption settings, backups, deployment manifests, source scans, artifact scans, and audit logs. Attempt controlled retrieval using unauthorized identities to validate denial.