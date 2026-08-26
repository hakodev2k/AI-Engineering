# Mobile Authentication

## Purpose
Design and review secure user authentication flows on mobile clients without treating device-side state as proof of identity.

## When to use
Use for sign-in, MFA, passkeys, biometrics, session restoration, account recovery, or reauthentication changes.

## Inputs
Identity-provider configuration, token model, session policy, platform capabilities, risk requirements, recovery flows.

## Preconditions
Separate authentication, authorization, device binding, and local convenience unlock requirements.

## Context to inspect
OAuth/OIDC flows, redirect URIs, browser sessions, token storage, biometric gates, backend validation, logout and recovery.

## Core knowledge
Use authorization code with PKCE for public mobile clients where applicable. Biometrics normally unlock local credentials; they do not independently authenticate to a remote service. Validate tokens and authorization server-side.

## Procedure
1. Map login and recovery flows.
2. Identify credentials and tokens handled by the app.
3. Validate protocol and redirect configuration.
4. Protect tokens with platform storage.
5. Define MFA and step-up triggers.
6. Implement safe cancellation and error handling.
7. Define token refresh, revocation, logout, and account switching.
8. Test replay, redirect manipulation, rooted/jailbroken states, and interrupted flows.
9. Verify backend validation.

## Decision points
Prefer system browser or trusted authentication sessions over embedded WebViews. Use biometrics for local gating only when the threat model supports it. Require step-up authentication for high-risk actions.

## Common failure patterns
Embedded credentials, custom OAuth, insecure redirect handlers, long-lived bearer tokens, local flags representing authentication, incomplete logout, and biometric checks disconnected from key usage.

## Verification
Exercise successful, failed, canceled, expired, revoked, replayed, and recovery scenarios and confirm backend identity enforcement.

## Expected output
A protocol-correct authentication flow with protected credentials, lifecycle controls, and negative-path tests.

## Stop conditions
Escalate when identity-provider behavior is undocumented, recovery weakens account security, or protocol requirements cannot be met.