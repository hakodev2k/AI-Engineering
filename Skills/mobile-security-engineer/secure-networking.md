# Secure Mobile Networking

## Purpose
Protect mobile network traffic and ensure the app authenticates intended services while handling hostile networks safely.

## When to use
Use for API integrations, networking-stack changes, certificate policy, proxies, WebSockets, or sensitive data transport.

## Inputs
Endpoint inventory, TLS policy, API contracts, certificate strategy, platform network configuration.

## Preconditions
Know production and non-production endpoints and data sensitivity.

## Context to inspect
TLS settings, cleartext exceptions, hostname validation, trust stores, proxy behavior, certificate pinning if used, retries, redirects, and logging.

## Core knowledge
Use modern TLS and correct hostname validation. Pinning can reduce some interception risks but adds operational failure modes and is not universally appropriate. Transport security does not replace application authorization or payload validation.

## Procedure
1. Inventory outbound endpoints and protocols.
2. Remove unintended cleartext traffic.
3. Validate TLS and hostname behavior.
4. Review redirect and proxy handling.
5. Assess whether pinning is justified and design rotation safely.
6. Prevent sensitive request/response logging.
7. Set bounded timeouts and safe retry semantics.
8. Test hostile-network and certificate-failure scenarios.

## Decision points
Use pinning only when threat reduction outweighs rotation and outage risk. Prefer platform TLS defaults unless stricter requirements are evidence-based.

## Common failure patterns
Trust-all certificate handlers, disabled hostname checks, accidental HTTP endpoints, brittle pins, leaking tokens in URLs/logs, and retries of non-idempotent operations.

## Verification
Use controlled interception and invalid-certificate tests to prove intended failures while confirming legitimate certificate rotation remains operable.

## Expected output
A documented network-security posture with validated TLS, safe failure behavior, and operationally viable certificate policy.

## Stop conditions
Escalate when certificate ownership, endpoint inventory, or required legacy protocol support is unclear.