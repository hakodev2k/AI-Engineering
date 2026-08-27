# Authentication Enforcement

## Purpose
Enforce identity verification consistently at the gateway while preserving backend ownership of business authorization.

## When to use
Use for JWT/OIDC/API-key/mTLS authentication, identity propagation, or authentication incident review.

## Inputs
Identity provider metadata, token format, client types, trust model, backend identity needs.

## Context to inspect
Issuer/audience rules, key rotation, clock tolerance, token forwarding, anonymous routes, service-to-service identities.

## Core knowledge
Understand OAuth 2.0/OIDC concepts, JWT validation, opaque-token introspection, key caching, replay risk, API keys, mTLS identities, and fail-open vs fail-closed behavior.

## Procedure
1. Classify client and credential types.
2. Define trusted issuers, audiences, algorithms, and claims.
3. Configure signature and lifetime validation.
4. Bound JWKS/introspection caching and failure behavior.
5. Strip untrusted identity headers before injecting trusted context.
6. Define anonymous-route exceptions explicitly.
7. Ensure credentials are never logged.
8. Test rotation, expiration, malformed tokens, and provider outage behavior.

## Decision points
Use local JWT validation for low latency and independent verification; introspection when revocation immediacy is required. Prefer mTLS for strong workload identity when operationally supportable.

## Common failure patterns
Skipping audience checks, trusting client-supplied identity headers, permissive algorithms, leaking tokens, excessive clock skew, fail-open authentication.

## Verification
Exercise valid and invalid credentials, issuer/audience mismatch, key rotation, expiry, and identity propagation tests.

## Expected output
A verified authentication policy with documented identity propagation and outage behavior.

## Stop conditions
Escalate when identity-provider trust or credential ownership is ambiguous.