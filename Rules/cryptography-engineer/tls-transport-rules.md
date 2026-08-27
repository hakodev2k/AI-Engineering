# TLS and Transport Rules

## Purpose
Maintain authenticated, confidential transport with safe protocol negotiation.

## Scope
TLS configuration, service identity, cipher policy, mutual TLS, and termination boundaries.

## MUST
- Use supported protocol versions and approved cipher suites.
- Validate peer identity according to the connection's security context.
- Document every TLS termination point and protection required on subsequent hops.
- Protect private keys and automate certificate lifecycle where practical.

## MUST NOT
- Disable peer verification, permit known-insecure protocol versions, or accept arbitrary certificates in production.
- Assume internal networks eliminate transport threats.

## SHOULD
- Test downgrade resistance, expiry handling, and mutual-authentication failure paths.

## Exceptions
Legacy endpoints require explicit risk acceptance, isolation, monitoring, compensating controls, and sunset date.

## Verification
Run configuration scanners, handshake tests, certificate checks, topology review, and negative identity tests.