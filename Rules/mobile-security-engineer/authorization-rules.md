# Authorization Rules

## Purpose
Prevent privilege escalation and unauthorized access originating from manipulated mobile clients.

## Scope
Object access, roles, entitlements, subscriptions, administrative operations, and feature authorization.

## MUST
- Enforce authorization at the authoritative service for every protected operation and object.
- Derive permissions from trusted identity and policy data rather than client assertions.
- Test horizontal and vertical privilege boundaries, including cross-account object identifiers.
- Reevaluate authorization after identity, role, tenant, or entitlement changes.

## MUST NOT
- Use hidden UI controls as an authorization mechanism.
- Trust locally cached roles or entitlements for irreversible or privileged server actions.
- Allow identifiers supplied by the client to bypass ownership checks.

## SHOULD
- Centralize authorization policy where doing so reduces inconsistent enforcement.
- Default to denial when policy context is missing or invalid.

## Exceptions
Any offline authorization capability requires explicit scope, expiry, integrity protection, reconciliation behavior, risk analysis, and approval.

## Verification
Run negative authorization tests using modified requests, stale entitlements, cross-user identifiers, downgraded accounts, and direct API calls.