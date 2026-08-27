# DNS Security and Abuse Defense

## Purpose
Protect DNS infrastructure from amplification, cache poisoning, unauthorized changes, tunneling, and denial-of-service.

## When to use
Security review, resolver exposure, DDoS events, suspicious DNS traffic, or hardening.

## Inputs
Topology, ACLs, query/response telemetry, change paths, authentication, provider controls, threat model.

## Context to inspect
Open recursion, source validation, RRL, DNSSEC validation, dynamic updates, admin access, logs, RPZ/policy controls, and DDoS protection.

## Core knowledge
Authoritative and recursive servers have different threat surfaces. DNS security requires control-plane protection, data integrity, least privilege, and abuse-aware telemetry.

## Procedure
1. Inventory DNS roles and exposure.
2. Close recursion to unauthorized clients.
3. Restrict transfers and dynamic updates.
4. Harden administrative authentication and secrets.
5. Enable DNSSEC validation/signing where policy requires.
6. Configure response-rate limiting carefully on authorities.
7. Establish DDoS capacity/provider mitigation.
8. Monitor unusual QPS, labels, NXDOMAIN, entropy, and destinations.
9. Use RPZ/blocking only with governance and false-positive controls.
10. Test abuse scenarios without disrupting production.

## Decision points
Use DNS filtering when security value and governance justify interception. Prefer provider-scale DDoS absorption for public authoritative services when attack volume can exceed local links.

## Common failure patterns
Open resolvers, unrestricted AXFR, shared admin credentials, excessive RRL blocking legitimate bursts, blind domain blocking, and logs containing sensitive query data without controls.

## Verification
Confirm unauthorized recursion/transfer/update fails, authorized service works, alerts trigger, DNSSEC behavior is valid, and mitigation preserves legitimate traffic.

## Expected output
Threat/control assessment, hardened configuration, monitoring, and tested incident controls.

## Stop conditions
Escalate suspected compromise, active large-scale attack, privacy-policy conflicts, or changes requiring security approval.