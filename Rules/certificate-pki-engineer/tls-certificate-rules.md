# TLS Certificate Rules

## Purpose
Ensure TLS identities are valid, deployable, and safely operated.

## Scope
Server and mutual-TLS certificates, names, chains, deployment, and validation.

## MUST
- TLS certificates MUST contain validated identities appropriate to the endpoint and intended client validation behavior.
- Deployed chains MUST be tested from representative clients, including intermediate delivery and hostname validation.
- Private keys MUST be accessible only to the workload or termination layer that requires them.
- mTLS client certificates MUST have narrowly defined issuance and authorization semantics.

## MUST NOT
- MUST NOT disable hostname or chain validation to resolve certificate errors.
- MUST NOT share one private key broadly across unrelated trust domains without approved design justification.
- MUST NOT deploy expired, not-yet-valid, or unapproved certificates.

## SHOULD
- TLS certificates SHOULD use automated renewal and deployment with monitored expiry margins.

## Exceptions
Require interoperability evidence, bounded risk, expiry, and security approval.

## Verification
Run chain/hostname tests, inspect SAN/EKU, verify permissions, and monitor expiry and deployment fingerprints.