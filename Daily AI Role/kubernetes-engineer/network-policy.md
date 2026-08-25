# Network Policy

## Purpose
Implement least-privilege workload network segmentation without breaking required service communication.

## When to use
Use for zero-trust segmentation, tenant isolation, compliance controls, or reducing lateral movement.

## Inputs
Application dependency map, namespaces, labels, ports/protocols, DNS requirements, CNI capabilities.

## Context to inspect
Inspect existing policies, CNI enforcement semantics, ingress/egress dependencies, monitoring agents, DNS, and external endpoints.

## Core knowledge
NetworkPolicy is additive and selector-driven; enforcement depends on the CNI. Default deny changes the failure mode from open to explicit allow.

## Procedure
1. Map observed and declared communication flows.
2. Standardize stable workload labels.
3. Introduce namespace-scoped default deny in a controlled environment.
4. Add explicit ingress and egress allows for required flows.
5. Include DNS and platform dependencies deliberately.
6. Test positive and negative paths.
7. Roll out incrementally with flow telemetry.
8. Document policy ownership and exceptions.

## Decision points
Use namespace selectors for trust zones and pod selectors for workload identity. Prefer explicit egress controls where data-exfiltration risk justifies operational complexity.

## Common failure patterns
Assuming unsupported CNI behavior, forgetting DNS, broad namespace allows, label drift, IP-based rules for dynamic services, and deploying default deny without dependency evidence.

## Verification
Confirm authorized paths work, unauthorized paths fail, policies select intended pods, and flow logs show no unexplained denies.

## Expected output
Minimal, tested segmentation policies and an auditable dependency rationale.

## Stop conditions
Stop if required flows cannot be identified, CNI enforcement is unknown, or policy changes could isolate critical production control paths without rollback.