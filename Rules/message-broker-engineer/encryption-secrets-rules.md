# Encryption and Secrets

## Purpose
Protect broker credentials and message confidentiality.

## Scope
TLS, encryption at rest, certificates, credentials, keys, and secret rotation.

## MUST
- Production broker traffic MUST use authenticated encryption where supported.
- Secrets MUST be stored in approved secret-management mechanisms and scoped to minimum access.
- Certificate and credential expiry MUST be monitored before service impact.

## MUST NOT
- MUST NOT commit broker credentials, private keys, or tokens to source control.
- MUST NOT log authentication material or sensitive connection strings.

## SHOULD
- Automate rotation with tested overlap and rollback procedures.

## Exceptions
Any weakened cryptographic control requires documented risk and explicit security approval.

## Verification
Inspect TLS configuration, secret references, scanners, expiry alerts, and rotation tests.