# Authentication Architecture

## Purpose
Design and review API authentication so callers are strongly identified, credentials are appropriately scoped, and identity signals can be trusted across service boundaries.

## When to use
Use when introducing or changing OAuth 2.0/OIDC, API keys, workload identity, mutual TLS, signed requests, session-to-API flows, or service-to-service authentication.

## Inputs
- Consumer types and trust levels
- Identity provider capabilities
- Token and credential formats
- API topology and gateway configuration
- Required assurance levels
- Rotation and revocation requirements

## Preconditions
Know whether callers are humans, first-party applications, third-party clients, workloads, devices, or automation.

## Context to inspect
Inspect token issuers, audiences, scopes, claims, signing algorithms, key rotation, clock handling, gateway validation, downstream propagation, secrets storage, and revocation behavior.

## Core knowledge
Authentication establishes caller identity; authorization decides permitted actions. Prefer standards-based short-lived credentials. Validate issuer, audience, signature, expiry, not-before, and algorithm. Minimize bearer-token exposure and avoid translating weak credentials into stronger internal trust without explicit controls.

## Procedure
1. Classify caller types and required identity assurance.
2. Select an authentication mechanism suited to each caller.
3. Define issuer, audience, subject, scopes, and credential lifetime.
4. Define key management, rotation, revocation, and compromise response.
5. Specify validation rules at every trust boundary.
6. Decide whether identity is propagated or exchanged downstream.
7. Protect credentials in transit, at rest, logs, traces, and diagnostics.
8. Define failure responses without leaking validation details.
9. Add negative tests for malformed, expired, forged, replayed, and wrong-audience credentials.
10. Instrument authentication failures and anomaly signals.

## Decision points
Use OAuth/OIDC for delegated or user-centric authorization, workload identity or mTLS for service identity, and API keys only when risk and operational simplicity justify weaker semantics. Prefer token exchange over blindly forwarding powerful external tokens into internal services.

## Common failure patterns
- Accepting tokens without validating audience
- Trusting unsigned or weakly signed tokens
- Long-lived bearer credentials
- Secrets embedded in code or client applications
- Mixing authentication and authorization logic
- Logging raw tokens
- Failing open when identity providers are unavailable

## Verification
Validate happy and negative paths, credential rotation, revocation behavior, downstream identity propagation, audit logs, and rejection of tokens from wrong issuers or audiences.

## Expected output
A documented authentication design with credential flows, validation rules, lifecycle controls, negative tests, and operational monitoring.

## Stop conditions
Escalate when identity assurance requirements are unknown, a legacy credential cannot be safely rotated, or proposed trust assumptions exceed available controls.