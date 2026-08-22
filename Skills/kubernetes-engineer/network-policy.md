# Network Policy

## Purpose
Apply least-privilege pod networking without breaking required service communication.

## When to use
Cluster hardening, multi-tenancy, sensitive workloads, or segmentation reviews.

## Inputs
Application dependency map, namespaces, ports, protocols, DNS requirements, and CNI capabilities.

## Context to inspect
Existing policies, namespace/pod labels, service paths, egress dependencies, and CNI enforcement semantics.

## Core knowledge
NetworkPolicy is additive and selector-driven. Enforcement requires supporting CNI. Default-deny is useful only with a verified dependency model.

## Procedure
1. Inventory legitimate ingress and egress flows.
2. Confirm CNI policy support.
3. Establish stable identity labels.
4. Introduce default-deny in controlled scope.
5. Add minimal allow policies for required flows.
6. Include DNS and infrastructure dependencies deliberately.
7. Test allowed and denied paths.
8. Monitor drops after rollout.

## Decision points
Roll out namespace-by-namespace when dependency knowledge is incomplete; use richer CNI policy only when standard NetworkPolicy cannot express requirements.

## Common failure patterns
Global deny without dependency discovery, mutable labels, forgotten DNS/egress, assuming Service names are policy identities, and untested CNI behavior.

## Verification
Automated connectivity tests prove required flows work and prohibited flows fail.

## Expected output
Least-privilege policies plus a validated communication matrix.

## Stop conditions
Stop when required flows cannot be identified or enforcement capability is unknown.