# Network Security Segmentation

## Purpose
Design network segmentation and enforcement that reduce blast radius while preserving required application flows.

## When to use
Use for trust-zone design, firewall policy redesign, zero-trust network controls, regulatory segmentation, or lateral-movement reduction.

## Inputs
Asset inventory, identities, application flows, data classification, threat model, compliance requirements, existing ACL/firewall policy, and topology.

## Context to inspect
Actual flow telemetry, NAT, routing symmetry, shared services, management networks, cloud security controls, remote access, and exception history.

## Core knowledge
Segmentation is effective only when boundaries correspond to trust and enforce least privilege. Network location alone is weak identity. Controls require observability, lifecycle ownership, and exception governance.

## Procedure
1. Classify assets and trust levels.
2. Map required flows using observed traffic plus application-owner validation.
3. Define zones and enforcement points.
4. Establish default-deny posture where operationally feasible.
5. Express rules by stable identities/groups where platforms support them.
6. Separate management, user, server, guest, production, and sensitive workloads as justified.
7. Account for DNS, NTP, identity, logging, update, and backup dependencies.
8. Review routing and NAT for bypass paths.
9. Stage policy in monitor/log mode when available.
10. Implement narrowly scoped rules with expiration for exceptions.
11. Validate both allowed and denied paths.
12. Monitor denied traffic and tune false positives.

## Decision points
Choose macro-segmentation for broad trust boundaries and microsegmentation when workload-level lateral movement materially matters. Prefer host/workload identity controls when IP mobility makes address rules fragile.

## Common failure patterns
Any-any rules, forgotten shared services, asymmetric firewall paths, unmanaged exceptions, segmentation only at ingress, stale object groups, and blocking health/monitoring traffic.

## Verification
Prove required flows succeed, prohibited flows fail, logs identify policy decisions, bypass routes do not exist, and rollback is tested.

## Expected output
Zone model, approved flow matrix, enforcement policy, exception register, test evidence, and monitoring requirements.

## Stop conditions
Escalate when application dependencies are unknown, a security control would cause unapproved outage, policy ownership is absent, or privileged access changes require security approval.