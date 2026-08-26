# Gateway Security Hardening

## Purpose
Reduce attack surface at the externally exposed gateway boundary.

## Scope
Input handling, protocol controls, headers, administrative surfaces, dependencies, and secure defaults.

## MUST
- Gateway configuration MUST default to the minimum exposed routes, methods, protocols, and administrative capabilities required.
- Request size, header size, parsing, and protocol limits MUST be bounded against resource abuse.
- Administrative interfaces MUST be isolated and strongly authenticated.
- Security-relevant dependency and configuration changes MUST be reviewed and validated.

## MUST NOT
- MUST NOT expose management endpoints publicly without an explicit secured design.
- MUST NOT weaken validation or protocol controls merely to accept malformed clients.
- MUST NOT store secrets directly in source-controlled gateway configuration.

## SHOULD
- Secure headers and protocol normalization SHOULD be applied where appropriate and contract-safe.
- Threat modeling SHOULD be revisited for material exposure changes.

## Exceptions
Weakening a security control requires documented threat impact, compensating controls, expiry where temporary, and explicit human security approval.

## Verification
Use configuration review, security scanners, dependency scans, malformed-request tests, port/exposure inspection, and administrative-access tests.