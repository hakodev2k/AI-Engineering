# Credential and Secret Rules

## Purpose
Prevent compromise of registry credentials, API keys, tokens, and trust material.

## Scope
Service credentials, client secrets, TLS keys, tokens, local development configuration, and rotation.

## MUST
- Registry credentials MUST be stored in approved secret-management systems rather than source code.
- Production clients MUST use distinct service identities where accountability or isolation requires it.
- Credential rotation MUST preserve service continuity and include rollback or overlap strategy.
- Secrets MUST be redacted from logs, diagnostics, CI output, and support artifacts.
- Compromised credentials MUST be revoked or rotated promptly under incident procedures.

## MUST NOT
- MUST NOT commit secrets to repositories or schema metadata.
- MUST NOT embed long-lived production credentials in client applications or container images.
- MUST NOT rotate critical production credentials without explicit authorization and validation plan.

## SHOULD
- Prefer short-lived credentials and workload identity.
- Automate expiration monitoring for certificates and tokens.

## Exceptions
Temporary static credentials require documented need, bounded lifetime, storage controls, and approval.

## Verification
Run secret scanning, inspect credential sources, review rotation records, and verify log redaction.