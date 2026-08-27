# TLS Termination and mTLS

## Purpose
Design secure, operable TLS termination and backend encryption across load-balancing tiers.

## When to use
Use for HTTPS/TLS services, certificate rotation, mTLS, proxy insertion, or trust-boundary changes.

## Inputs
Security policy, certificate authorities, hostname/SNI requirements, protocols, trust zones, cipher policy, and rotation process.

## Context to inspect
Inspect certificate stores, listeners, backend protocols, SNI, ALPN, client-auth requirements, key permissions, and current rotation automation.

## Core knowledge
Termination changes the trust boundary. TLS passthrough preserves end-to-end encryption but limits L7 inspection. Re-encryption protects backend hops. mTLS authenticates both peers but requires lifecycle discipline. SNI and ALPN affect virtual hosting and HTTP/2 or gRPC negotiation.

## Procedure
1. Map every encrypted hop and trust boundary.
2. Identify where plaintext is permitted.
3. Decide passthrough, termination, or re-encryption.
4. Define certificate identity and CA trust.
5. Configure protocol and cipher policy.
6. Validate SNI and ALPN behavior.
7. Design automated issuance and rotation.
8. Test overlapping certificate rotations.
9. Monitor expiry, handshake failures, and protocol negotiation.
10. Document emergency rotation and revocation.

## Decision points
Prefer termination where L7 policy is required and the zone is trusted; use passthrough when end-to-end cryptographic ownership dominates. Use mTLS where workload identity materially reduces trust risk.

## Common failure patterns
Expired certificates; missing intermediate CA; SNI mismatch; breaking gRPC ALPN; storing private keys broadly; rotating without overlap.

## Verification
Run handshake tests from representative clients and backends, verify chain and hostname validation, and exercise rotation without traffic loss.

## Expected output
A documented TLS topology, identity model, rotation procedure, and validated configuration.

## Stop conditions
Stop when cryptographic requirements conflict, private-key handling is unapproved, or certificate authority ownership is unclear.