# Certificate and PKI Rules

## Purpose
Ensure certificate-based trust is cryptographically sound, scoped, revocable, and operationally maintainable.

## Scope
Applies to TLS, mTLS, internal PKI, service certificates, client certificates, and certificate authorities.

## MUST
- Certificates MUST validate the intended identity, issuer chain, usage, and validity period.
- Private keys MUST be protected according to the sensitivity of the identity they represent.
- Certificate issuance and renewal MUST be automated where feasible and monitored for failure.
- Compromised certificates and issuing authorities MUST have tested revocation and replacement procedures.

## MUST NOT
- MUST NOT disable certificate validation to resolve connectivity failures.
- MUST NOT use expired, self-signed, or untrusted certificates in protected production paths without explicit approved design.
- MUST NOT share private keys across unrelated trust boundaries.

## SHOULD
- Certificate lifetimes SHOULD be short enough to limit compromise duration while preserving operational reliability.
- CA hierarchy SHOULD minimize blast radius.

## Exceptions
Non-standard trust chains require documented threat analysis, compensating verification, owner, approval, and expiry.

## Verification
Inspect trust stores, issuance policy, key protection, certificate inventory, expiry monitoring, revocation behavior, and negative tests for wrong host, wrong issuer, expired, and revoked certificates.