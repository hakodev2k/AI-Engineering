# Network Segmentation and Zero Trust

## Purpose
Reduce lateral movement and blast radius by translating trust requirements into enforceable network boundaries and least-privilege flows.

## When to use
Use for security redesign, sensitive workloads, compliance boundaries, cloud migrations, user/device isolation, or flat-network remediation.

## Inputs
Asset inventory, identities, application flows, data sensitivity, threat model, firewall capabilities, endpoint posture, and operational constraints.

## Context to inspect
Inspect VLAN/VRF/VPC/VNet boundaries, firewalls, security groups, ACLs, identity-aware proxies, east-west flows, admin paths, and exceptions.

## Core knowledge
Zero trust is continuous explicit verification and least privilege, not merely more subnets. Network controls should complement identity, device, application, and data controls.

## Procedure
1. Classify assets and trust levels.
2. Discover required flows using evidence.
3. Define zones around meaningful risk boundaries.
4. Specify default-deny policy where feasible.
5. Permit minimum protocols, directions, identities, and destinations.
6. Separate management planes and privileged paths.
7. Design logging for allow and deny decisions.
8. Migrate incrementally using observed-flow baselines.
9. Review exceptions with owners and expiry.
10. Test lateral-movement resistance.

## Decision points
Use coarse segmentation where simplicity outweighs marginal isolation; use microsegmentation for high-value workloads with mature inventory and policy automation. Prefer identity-aware enforcement when network location is insufficient context.

## Common failure patterns
Creating zones without enforcing policy, permanent broad exceptions, trusting internal networks, missing management-plane segmentation, and blocking undocumented dependencies during cutover.

## Verification
Validate approved flows, denied unauthorized paths, logging, administrative isolation, exception inventory, and recovery procedures.

## Expected output
A segmentation model, enforceable flow matrix, migration sequence, exceptions, and verification evidence.

## Stop conditions
Stop when required flows cannot be identified, policy ownership is absent, or enforcement could disrupt critical services without staged validation.