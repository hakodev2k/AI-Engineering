# Session Management and Revocation

## Purpose
Control authenticated sessions so access can be bounded, re-evaluated, and revoked promptly after risk events, lifecycle changes, or credential compromise.

## When to use
Use when tuning session lifetime, adding step-up controls, investigating account compromise, or reducing termination exposure.

## Inputs
Session types, token lifetimes, refresh mechanisms, application capabilities, revocation events, risk requirements.

## Context to inspect
IdP sessions, application cookies, refresh tokens, API tokens, logout flows, device sessions, revocation endpoints, cache behavior.

## Core knowledge
Authentication does not end at login. Long-lived sessions can outlive password changes, MFA resets, or employment termination unless applications and authorization servers support revocation or revalidation.

## Procedure
1. Inventory session and token types.
2. Map issuance, renewal, expiry, and revocation paths.
3. Define maximum and idle lifetimes by risk.
4. Require reauthentication for sensitive actions.
5. Revoke sessions on termination, credential reset, or confirmed compromise.
6. Bound refresh-token lifetime and rotate where supported.
7. Propagate revocation to relying applications.
8. Avoid caching authorization longer than acceptable risk windows.
9. Test logout, global sign-out, and forced-revocation behavior.
10. Monitor anomalous session reuse and stale sessions.

## Decision points
Use shorter sessions for privileged/high-risk access; allow longer sessions only with strong device binding and step-up controls.

## Common failure patterns
Password reset without session revocation, applications ignoring global logout, perpetual refresh tokens, and authorization cached after role removal.

## Verification
Measure actual revocation latency across representative applications and APIs.

## Expected output
Session policy, revocation triggers, integration requirements, and test evidence.

## Stop conditions
Escalate when a critical application cannot terminate compromised access within the required risk window.