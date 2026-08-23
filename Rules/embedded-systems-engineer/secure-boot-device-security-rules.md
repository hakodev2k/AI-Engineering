# Secure Boot and Device Security Rules

## Purpose
Protect device trust, credentials, debug access, and executable integrity.

## Scope
Secure boot, key storage, debug ports, device identity, cryptography, provisioning, and anti-rollback.

## MUST
- Establish a documented root of trust appropriate to the threat model.
- Protect private keys and credentials using target-supported secure storage and least privilege.
- Restrict production debug/test interfaces according to the security model.

## MUST NOT
- Embed shared production secrets in source code or publicly readable firmware artifacts.
- Disable signature or integrity checks merely to unblock deployment.

## SHOULD
- Use anti-rollback controls when vulnerable firmware reinstallation creates material risk.

## Exceptions
Security-control changes require threat analysis, evidence, and authorized approval.

## Verification
Inspect configuration/fuses, provisioning flow, key handling, debug access, boot-chain validation, and negative security tests.