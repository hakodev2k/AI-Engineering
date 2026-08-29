# Secrets Handling Rules

## Purpose
Prevent credentials and cryptographic material from leaking through integration code, configuration, logs, or operational tooling.

## Scope
Applies to API keys, passwords, certificates, private keys, tokens, connection strings, and equivalent sensitive configuration.

## MUST
- Secrets MUST be stored in approved secret-management mechanisms and injected at runtime where practical.
- Secret access MUST follow least privilege and be auditable.
- Secret rotation procedures MUST be tested for critical integrations.
- Logs, traces, error payloads, and diagnostics MUST redact secrets.
- Suspected exposure MUST trigger revocation or rotation according to incident procedures.

## MUST NOT
- MUST NOT commit secrets to source control.
- MUST NOT place production secrets in example files, test fixtures, tickets, or documentation.
- MUST NOT copy secrets between environments merely for convenience.

## SHOULD
- Secret references SHOULD be separated from non-sensitive configuration.
- Automated secret scanning SHOULD run in CI and repository history where available.

## Exceptions
Any temporary secret-handling deviation MUST document duration, exposure risk, storage controls, cleanup steps, and security approval.

## Verification
Inspect source, configuration, deployment manifests, logs, secret-store policies, rotation evidence, and secret-scanner results.