# VPN and Secure Remote Access

## Purpose
Design secure remote and site connectivity with strong identity, constrained access, resilient cryptography, and observable sessions.

## When to use
Use for workforce VPN, site-to-site tunnels, partner access, remote administration, or VPN troubleshooting.

## Inputs
Users/sites, resources, identity controls, routing, device posture, availability and performance requirements.

## Context to inspect
VPN gateways, authentication, MFA, split tunneling, route injection, DNS, endpoint posture, logging, HA.

## Core knowledge
IPsec/IKE, TLS VPNs, tunnel modes, authentication, key exchange, split-tunnel risk, route overlap, zero-trust alternatives.

## Procedure
1. Define who needs access to what.
2. Select tunnel/access model.
3. Require strong identity and MFA where applicable.
4. Restrict routes and authorization scope.
5. Harden cryptographic settings.
6. Define DNS and egress behavior.
7. Configure HA and session logging.
8. Test normal, failover, revoked-user, and prohibited-access cases.

## Decision points
Prefer application-level zero-trust access for narrow application needs; VPN for network-level requirements. Split tunnel when performance benefits justify policy complexity.

## Common failure patterns
Broad routes, weak authentication, shared credentials, stale partner tunnels, overlapping networks, missing revocation tests.

## Verification
Confirm identity enforcement, route scope, cryptography, failover, access revocation, and telemetry.

## Expected output
Remote-access design/configuration, access matrix, test evidence, operational runbook.

## Stop conditions
Escalate shared identities, unverifiable partner security, uncontrolled routing, or cryptographic downgrade requirements.