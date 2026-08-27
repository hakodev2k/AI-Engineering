# Load Balancer Security Hardening

## Purpose
Reduce attack surface at load-balancing boundaries while preserving required protocol behavior and operability.

## When to use
Use for internet-facing ingress, security reviews, new listeners, or configuration baselines.

## Inputs
Threat model, exposure requirements, protocols, authentication architecture, network policy, TLS policy, and logging requirements.

## Context to inspect
Inspect listeners, public addresses, ACLs, security groups, WAF integration, TLS settings, admin interfaces, headers, limits, and management permissions.

## Core knowledge
The load balancer is a trust boundary. Minimize exposed ports and protocols, sanitize forwarded metadata, enforce modern TLS, protect management planes, limit abusive resource consumption, and log security-relevant events.

## Procedure
1. Enumerate exposed listeners and management endpoints.
2. Remove unnecessary protocols and ports.
3. Restrict source networks where possible.
4. Enforce approved TLS and certificate policy.
5. Sanitize forwarding and hop-by-hop headers.
6. Configure request, header, connection, and rate limits where appropriate.
7. Restrict administrative permissions and audit changes.
8. Integrate DDoS/WAF controls according to threat model.
9. Test malformed and oversized traffic safely.
10. Monitor rejected and anomalous traffic.

## Decision points
Apply controls at the earliest trustworthy edge, but avoid duplicating complex application authorization in the balancer. Rate limits should protect resources without blocking legitimate bursts.

## Common failure patterns
Open admin ports; trusting client forwarding headers; obsolete TLS; unlimited header/body sizes; broad management permissions; security rules with no observability.

## Verification
Run configuration review, external exposure checks, TLS tests, and controlled negative tests; verify unauthorized management access is denied.

## Expected output
A hardened configuration baseline, exceptions, evidence, and monitoring controls.

## Stop conditions
Stop when changes affect regulated trust boundaries without approval or testing could resemble hostile traffic against production.