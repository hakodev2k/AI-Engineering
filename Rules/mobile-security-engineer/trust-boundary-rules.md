# Trust Boundary Rules

## Purpose
Ensure security decisions remain enforceable when mobile software executes on untrusted devices.

## Scope
Client/server boundaries, local state, IPC, deep links, platform APIs, device integrity signals, and privileged operations.

## MUST
- Enforce authorization and business-critical integrity constraints on trusted server-side or hardware-backed boundaries where applicable.
- Validate every client-supplied identifier, state transition, entitlement, price, role, and security-relevant claim at the authoritative boundary.
- Define which decisions may safely occur on-device and which require authoritative verification.

## MUST NOT
- Trust rooted/jailbroken-device detection as a complete security boundary.
- Rely on UI visibility, disabled controls, local flags, or bundled secrets to enforce authorization.
- Assume application binaries or local storage cannot be inspected or modified.

## SHOULD
- Minimize privileged decisions made exclusively by the client.
- Design controls to fail safely when device-attestation signals are unavailable or inconclusive.

## Exceptions
Any client-enforced security decision requires documented risk, rationale, compensating controls, abuse analysis, and accountable approval.

## Verification
Inspect architecture and request flows; tamper with client state and requests; verify privileged operations reject forged or replayed client assertions.