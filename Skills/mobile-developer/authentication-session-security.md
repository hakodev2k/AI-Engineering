# Authentication and Session Security

## Purpose
Implement secure mobile authentication and session lifecycle without exposing credentials.

## When to use
Login, OAuth/OIDC, token refresh, logout, biometric gates, privileged actions.

## Inputs
Identity-provider contract, threat model, token policy, app lifecycle.

## Context to inspect
Redirect handling, token storage, refresh logic, deep links, logs, WebView usage, device compromise assumptions.

## Core knowledge
Prefer system/browser-based standards flows with PKCE. Biometrics normally unlock local secrets; they are not server identity by themselves.

## Procedure
1. Confirm protocol and threat assumptions.
2. Use authorization code + PKCE where applicable.
3. Validate redirect/state/nonce requirements.
4. Store long-lived secrets in platform secure storage.
5. Serialize refresh operations and handle rotation.
6. Define expiration, revocation, logout, and device-change behavior.
7. Redact credentials from telemetry.
8. Test replay, expiry, cancellation, and concurrent refresh.

## Decision points
Choose session persistence based on risk and UX; require re-authentication for high-risk operations when warranted.

## Common failure patterns
Embedded credential collection, plaintext tokens, refresh storms, incomplete logout, logging authorization headers.

## Verification
Protocol tests, storage inspection, security review, expired/revoked token scenarios.

## Expected output
Explicit secure session lifecycle and failure behavior.

## Stop conditions
Escalate custom cryptography, nonstandard identity flows, or unclear risk acceptance.