# TLS and Secure Channel Review

## Purpose
Review TLS and similar standardized secure-channel deployments for identity, confidentiality, integrity, and downgrade resistance.

## When to use
Use for service-to-service, public API, proxy, load balancer, mTLS, certificate, or protocol-hardening reviews.

## Inputs
Network architecture, endpoints, TLS configuration, certificate policy, client behavior, trust stores, and compatibility requirements.

## Context to inspect
Protocol versions, cipher configuration, certificate names/chains, revocation strategy, termination points, proxy hops, mTLS mapping, session resumption, and plaintext fallback.

## Core knowledge
TLS security depends on endpoint authentication and every termination boundary, not merely enabling HTTPS. Certificate validation must include trust, identity, validity, and policy. mTLS authenticates certificates; applications must still map identities to authorization.

## Procedure
1. Map every transport hop and TLS termination point.
2. Remove unintended plaintext or downgrade paths.
3. Require supported modern protocol versions and safe library defaults.
4. Validate server identity and hostname behavior.
5. Review certificate issuance, renewal, trust roots, and key custody.
6. For mTLS, define client identity mapping and authorization.
7. Review session resumption and forward-secrecy requirements.
8. Check proxy/header trust boundaries.
9. Test expired, wrong-name, untrusted, revoked-policy, and malformed certificates.
10. Monitor expiry, handshake failures, and configuration drift.

## Decision points
Use mTLS where strong workload identity and managed certificates justify complexity. Certificate pinning can reduce trust scope but increases rotation and outage risk and is unsuitable by default.

## Common failure patterns
Disabling validation; trusting all internal certificates; TLS only to the load balancer; wildcard overuse; manual renewal; confusing authentication with authorization; silent HTTP fallback.

## Verification
Run configuration scanners where authorized, negative certificate tests, end-to-end hop inspection, renewal drills, and identity/authorization tests.

## Expected output
A secure-channel review with topology, trust model, findings, hardening actions, and verification evidence.

## Stop conditions
Stop if termination topology, certificate ownership, or required legacy compatibility cannot be established safely.