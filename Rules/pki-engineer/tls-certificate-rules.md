# TLS Certificates

## Purpose
Ensure TLS certificates provide correct endpoint identity, cryptographic strength, and operational continuity.

## Scope
Applies to server and mutual-TLS certificates, names, key usage, deployment, and validation.

## MUST
- TLS certificates MUST contain validated names actually used by clients and MUST use profiles appropriate to server or client authentication.
- Private keys MUST be protected according to service impact and deployment environment.
- TLS deployments MUST present the intended certificate chain and be tested from representative clients.
- mTLS identities MUST map to authorization policy separately from certificate validity.

## MUST NOT
- MUST NOT disable hostname or chain validation to accommodate certificate errors.
- MUST NOT use expired, self-signed, or untrusted certificates in production unless explicitly required by a documented trust model.
- MUST NOT issue unnecessarily broad SAN sets that expand compromise impact.

## SHOULD
- Prefer short-lived automated certificates where ecosystem support is mature.
- Monitor endpoint certificate expiry and chain health externally.

## Exceptions
Require compatibility evidence, risk, compensating controls, expiration, and approval.

## Verification
Use TLS scanners, chain validation, endpoint probes, configuration inspection, certificate linting, and client interoperability tests.