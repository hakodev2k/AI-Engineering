# Network Segmentation

## Purpose
Reduce lateral movement and blast radius by designing and validating enforceable network segmentation.

## When to use
Use for zone redesign, sensitive workloads, compliance boundaries, ransomware resilience, or excessive east-west reachability.

## Inputs
Asset inventory, application dependencies, flow logs, topology, business criticality, identity and ownership data.

## Context to inspect
VLANs/VPCs/VNets, subnets, routing tables, ACLs, security groups, firewalls, service meshes, Kubernetes policies, legacy dependencies.

## Core knowledge
Segmentation is an enforcement problem, not merely subnetting. Boundaries should follow risk and dependency patterns. Deny-by-default requires dependency discovery and controlled rollout.

## Procedure
1. Classify assets and workloads.
2. Discover observed and declared dependencies.
3. Group workloads by trust and function.
4. Define permitted inter-zone flows.
5. Choose enforcement points closest to useful trust boundaries.
6. Stage rules in monitor or audit mode when available.
7. Remove broad transitional rules progressively.
8. Test critical workflows and failure cases.
9. Monitor denied traffic for hidden dependencies.
10. Document ownership and exception expiry.

## Decision points
Use coarse zones when operational simplicity is essential; microsegmentation when lateral movement risk justifies policy complexity. Prefer identity-aware controls when addresses are ephemeral.

## Common failure patterns
Subnetting without enforcement, stale allowlists, shared admin networks, undocumented exceptions, overly granular policy that cannot be operated, and permanent temporary rules.

## Verification
Run reachability tests from representative zones, inspect denied-flow telemetry, confirm critical transactions, and verify policy matches the approved matrix.

## Expected output
Segmentation model, flow policy, exception register, rollout plan, and validation evidence.

## Stop conditions
Stop before enforcement if dependency discovery is incomplete for critical services or rollback cannot be performed safely.