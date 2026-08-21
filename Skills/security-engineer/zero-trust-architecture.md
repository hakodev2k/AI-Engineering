# Zero Trust Architecture

## Purpose
Apply zero-trust principles to reduce implicit trust, continuously verify access, and limit blast radius across users, workloads, devices, and services.

## When to use
Use when redesigning enterprise access, segmenting sensitive systems, modernizing remote access, or reducing reliance on perimeter trust.

## Inputs
Identity model, device posture signals, network topology, application inventory, data classification, privileged workflows, telemetry sources.

## Context to inspect
Authentication strength, authorization policies, network segmentation, workload identities, device trust, session lifetime, resource sensitivity, and monitoring coverage.

## Core knowledge
Zero trust means no access is trusted solely because of network location. Decisions should combine verified identity, resource sensitivity, device/workload context, least privilege, and continuous or repeated evaluation where appropriate.

## Procedure
1. Inventory protected resources and high-risk access paths.
2. Classify identities, devices, and workloads.
3. Remove network-location assumptions from authorization decisions.
4. Strengthen identity assurance and workload authentication.
5. Apply least-privilege resource-level authorization.
6. Segment sensitive workloads and administrative paths.
7. Shorten sessions or re-authenticate based on risk.
8. Add telemetry for identity, device, and access anomalies.
9. Migrate incrementally with compatibility and recovery plans.
10. Validate denied paths and compromised-context scenarios.

## Decision points
Use contextual access signals when they are reliable and operationally supportable. Avoid adding complexity that does not materially reduce risk.

## Common failure patterns
Renaming VPNs as zero trust, keeping broad internal trust, overprivileged service identities, weak device signals treated as authoritative, and introducing policy complexity without observability.

## Verification
Access tests demonstrate that network location alone never grants privileged access, sensitive resources require appropriate identity/context, and compromised or revoked identities lose access promptly.

## Expected output
A phased zero-trust architecture with explicit trust signals, policy boundaries, segmentation, telemetry, and migration criteria.

## Stop conditions
Escalate when identity ownership, device posture reliability, or critical legacy access dependencies are unresolved.