# API Authentication and Authorization

## Purpose
Establish consistent identity verification and access-control enforcement across an API platform.

## When to use
Use when onboarding APIs, changing identity providers, exposing new trust boundaries, or reviewing access controls.

## Inputs
Identity architecture, token formats, actor types, permission model, API inventory, compliance requirements.

## Context to inspect
Inspect token issuance, validation, audience/scope conventions, service identities, tenant boundaries, gateway policies, and application authorization.

## Core knowledge
Authentication proves identity; authorization decides allowed actions. Gateway checks can enforce coarse policy, but resource-level authorization normally belongs near domain context. Tokens require issuer, audience, signature, lifetime, and claim validation.

## Procedure
1. Classify callers and trust zones.
2. Select supported authentication mechanisms.
3. Define token validation requirements.
4. Establish scopes/roles/permissions with least privilege.
5. Separate platform-level and resource-level authorization.
6. Define service-to-service identity and credential rotation.
7. Protect tenant and object boundaries.
8. Standardize authentication and authorization errors without leaking sensitive detail.
9. Add negative and privilege-escalation tests.
10. Instrument denied requests and anomalous patterns.

## Decision points
Use centralized policy for universal controls; retain contextual authorization in services. Prefer short-lived workload identity over static secrets.

## Common failure patterns
Trusting unsigned claims, audience confusion, role explosion, authorization only at UI/gateway, insecure service credentials, and cross-tenant access.

## Verification
Test valid, expired, malformed, wrong-audience, insufficient-scope, cross-tenant, and privilege-escalation scenarios.

## Expected output
A least-privilege API access model with enforceable and testable boundaries.

## Stop conditions
Escalate unresolved identity ownership, regulatory requirements, or high-impact privilege changes.