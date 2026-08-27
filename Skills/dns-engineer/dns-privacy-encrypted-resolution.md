# DNS Privacy and Encrypted Resolution

## Purpose
Design DoT/DoH and DNS privacy controls without breaking enterprise policy, observability, or availability.

## When to use
Encrypted DNS rollout, browser/client DoH policy, privacy review, resolver modernization, or bypass incidents.

## Inputs
Client platforms, resolver endpoints, identity/policy needs, certificates, network controls, privacy requirements, logs.

## Context to inspect
DoH/DoT support, bootstrap resolution, certificate trust, proxy/firewall paths, split DNS, filtering requirements, telemetry retention, and fallback behavior.

## Core knowledge
Encrypted DNS protects queries in transit between client and resolver; it does not hide queries from the resolver. Application-controlled DoH can bypass enterprise resolver policy unless governed.

## Procedure
1. Define threat/privacy model and policy requirements.
2. Inventory client and application resolver behavior.
3. Select trusted encrypted resolver endpoints.
4. Validate certificate and bootstrap dependencies.
5. Preserve private/split namespace resolution.
6. Define policy for unmanaged third-party DoH.
7. Configure clients through supported management controls.
8. Test captive portal/VPN/proxy and failure cases.
9. Establish privacy-minimized telemetry.
10. Monitor adoption, errors, and fallback.

## Decision points
Use DoT for OS/network-managed resolver transport where appropriate; DoH integrates well with HTTPS infrastructure but may complicate policy visibility. Permit third-party DoH only when policy accepts bypass implications.

## Common failure patterns
Breaking split DNS, circular bootstrap, silent plaintext fallback, blocking DoH by fragile IP lists, overlogging query data, and certificate expiry.

## Verification
Confirm encrypted transport, intended resolver identity, private/public resolution, failure behavior, and policy enforcement across managed clients.

## Expected output
Encrypted-DNS architecture, client policy, privacy/telemetry controls, and compatibility evidence.

## Stop conditions
Stop when privacy/legal requirements conflict, client behavior cannot be governed, or encrypted resolution breaks critical private namespaces without safe remediation.