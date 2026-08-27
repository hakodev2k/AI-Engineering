# Cloud Network Security Controls

## Purpose
Design layered network controls that enforce least connectivity while preserving operability and application requirements.

## When to use
Use for security-group/NSG design, subnet ACLs, segmentation, firewall policy, new workload onboarding, or network-security review.

## Inputs
Traffic-flow matrix, identities, trust zones, protocols/ports, compliance requirements, threat model, and existing policies.

## Preconditions
Separate required application flows from historical rules. Confirm ownership before removing access.

## Context to inspect
Security groups/NSGs, ACLs, cloud firewalls, route-based inspection, WAF where relevant, endpoint policies, IAM, flow logs, and exception records.

## Core knowledge
Network controls are one layer, not a substitute for identity and application authorization. Stateful and stateless controls behave differently. Rules should express stable intent and avoid dependence on ephemeral addresses when identity/group references are available.

## Procedure
1. Build required-flow inventory.
2. Map flows to trust boundaries and data sensitivity.
3. Choose the narrowest enforcement layer that owns the boundary.
4. Prefer identity/group references over broad CIDRs where supported.
5. Remove redundant and shadowed rules cautiously.
6. Define explicit egress controls for sensitive workloads.
7. Instrument accepts and denies.
8. Automate policy checks in IaC/CI.
9. Test allowed and forbidden paths.
10. Establish exception expiry and review.

## Decision points
Use distributed security groups for workload-level policy; centralized firewalls for advanced inspection/governance where justified. Avoid duplicating identical policy across many layers unless defense-in-depth value is clear.

## Common failure patterns
0.0.0.0/0 convenience rules, stale exceptions, IP-based rules for dynamic workloads, undocumented egress, duplicated controls with conflicting owners, and blocking health/DNS dependencies.

## Verification
Test positive and negative flows, inspect flow/firewall logs, validate IaC policy, and confirm application acceptance criteria after tightening.

## Expected output
A least-connectivity rule set, ownership/exception model, evidence of enforcement, and monitoring.

## Stop conditions
Stop when business-critical flow ownership is unknown, a rule removal risks outage without rollback, or security policy requires formal approval.