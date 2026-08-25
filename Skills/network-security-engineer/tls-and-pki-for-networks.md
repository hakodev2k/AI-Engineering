# TLS and PKI for Networks

## Purpose
Apply TLS and PKI correctly to network services, inspection points, device management, and service-to-service communication.

## When to use
Use for TLS deployment, certificate failures, cipher hardening, mTLS, inspection design, or PKI migrations.

## Inputs
Service endpoints, certificate chains, trust stores, protocol versions, client compatibility, key-management requirements.

## Context to inspect
Termination points, proxies, load balancers, appliances, certificate automation, HSM/KMS use, revocation and renewal paths.

## Core knowledge
Handshake, chain validation, hostname verification, protocol/cipher negotiation, forward secrecy, mTLS, OCSP/CRL, private key protection.

## Procedure
1. Map TLS termination and re-encryption points.
2. Establish trust requirements and identities.
3. Select supported protocol versions and cryptography.
4. Automate issuance and renewal where feasible.
5. Protect private keys and administrative access.
6. Validate complete certificate chains and names.
7. Test client compatibility and failure behavior.
8. Monitor expiry and handshake errors.

## Decision points
Use mTLS when strong workload identity is needed. Use inspection only with explicit risk, privacy, legal, and operational review.

## Common failure patterns
Expired certificates, missing intermediates, disabled hostname verification, shared private keys, obsolete protocols, brittle manual renewal.

## Verification
Run protocol and chain tests, verify hostname checks, test renewal, inspect telemetry, and confirm deprecated protocols are rejected.

## Expected output
TLS/PKI configuration, trust model, renewal process, compatibility evidence, monitoring.

## Stop conditions
Stop if private-key handling is unsafe, trust ownership is unclear, or inspection would violate policy or legal constraints.