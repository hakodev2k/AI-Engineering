# TLS and Certificate Handling

## Purpose
Diagnose and implement secure browser TLS and certificate behavior without weakening transport guarantees.

## When to use
Use for HTTPS failures, certificate UI, trust-chain problems, protocol negotiation, mixed-content interactions, or enterprise trust behavior.

## Inputs
Connection logs, certificate chain, hostname, trust-store context, TLS configuration, error code.

## Context to inspect
Handshake, certificate verification, hostname validation, revocation/status mechanisms, protocol/cipher negotiation, exception policy.

## Core knowledge
Certificate validation combines chain building, trust anchors, hostname, validity, constraints, and policy. User-visible overrides can create durable security risk. Platform trust stores may differ.

## Procedure
1. Capture the exact TLS error and chain.
2. Verify hostname and time assumptions.
3. Inspect chain building and trust anchor selection.
4. Compare platform and browser trust behavior.
5. Check protocol negotiation and policy restrictions.
6. Distinguish network interception from server misconfiguration.
7. Preserve hard-fail rules for non-overridable errors.
8. Test valid, expired, wrong-host, untrusted, malformed, and intercepted chains.

## Decision points
Do not relax verification to improve compatibility. Allow exceptions only where product/security policy explicitly permits them.

## Common failure patterns
Treating all certificate errors alike; bypassing hostname checks; caching exceptions too broadly; leaking certificate details across origins; platform-specific assumptions.

## Verification
TLS test suites and negative certificate cases pass across supported platforms.

## Expected output
A secure diagnosis or implementation preserving transport-authentication guarantees.

## Stop conditions
Escalate requests to weaken certificate validation or alter root trust policy without security ownership approval.