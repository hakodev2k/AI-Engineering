# Network Policy Segmentation

## Purpose
Constrain pod communication and reduce lateral movement with enforceable Kubernetes network policy.

## When to use
Use for multi-tier applications, sensitive namespaces, multi-tenancy, ingress/egress hardening, or incident containment design.

## Inputs
Service dependency map, namespaces, labels, DNS needs, ingress/egress paths, CNI capabilities, and external destinations.

## Preconditions
Confirm the CNI actually enforces the policy features used. Obtain observable traffic data before restrictive rollout.

## Context to inspect
Inspect namespace selectors, pod selectors, IP blocks, DNS, control-plane dependencies, node-local services, service meshes, and cloud networking.

## Core knowledge
NetworkPolicy behavior depends on selected pods and policy direction. Default-deny is effective only when required flows are explicitly restored and the CNI implements semantics correctly.

## Procedure
1. Map legitimate flows.
2. Establish namespace/workload labels with stable ownership.
3. Introduce default-deny ingress and egress in test scope.
4. Add least-privilege allow rules.
5. Account for DNS and platform dependencies.
6. Validate ingress, egress, and cross-namespace paths.
7. Roll out progressively.
8. Monitor denied traffic and drift.

## Decision points
Prefer identity/label-based rules for cluster workloads and destination controls for external egress. Use stronger CNI-specific L7 controls only when portability trade-offs are acceptable.

## Common failure patterns
Assuming policy works with unsupported CNI; broad namespace allows; mutable labels; forgetting DNS; using IP allowlists for dynamic services.

## Verification
Test expected connections and explicit forbidden paths from representative pods. Confirm enforcement through CNI telemetry.

## Expected output
A segmented policy set with dependency rationale and connectivity test evidence.

## Stop conditions
Stop before enforcement when dependency mapping is incomplete enough to risk a production outage.