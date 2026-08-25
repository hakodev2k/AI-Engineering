# Network Security Architecture

## Purpose
Design defensible network security architectures that align trust boundaries, traffic flows, identity, availability, and operational constraints.

## When to use
Use for new environments, major topology changes, segmentation programs, cloud connectivity, or security architecture reviews. Do not use as a substitute for detailed product configuration.

## Inputs
Business requirements, topology, asset inventory, data classifications, threat model, compliance constraints, traffic flows, availability targets.

## Preconditions
Identify system owners and obtain current diagrams and configuration evidence. Mark assumptions explicitly.

## Context to inspect
Trust zones, ingress/egress paths, routing, firewalls, proxies, load balancers, VPNs, cloud networks, DNS, identity dependencies, management planes, third-party links.

## Core knowledge
Defense in depth, least privilege, zero trust principles, segmentation, choke points, failure domains, asymmetric routing, stateful inspection, encryption boundaries, HA design.

## Procedure
1. Establish business services and critical assets.
2. Map trust boundaries and required flows.
3. Identify threat paths and administrative planes.
4. Minimize permitted connectivity.
5. Select controls at enforceable boundaries.
6. Design resilient control placement and failover behavior.
7. Define logging and telemetry requirements.
8. Validate routing and return-path implications.
9. Document exceptions and residual risks.
10. Review operability, recovery, and change impact.

## Decision points
Prefer segmentation where compromise blast radius matters. Centralize controls when consistency dominates; distribute controls when locality, scale, or cloud-native enforcement is stronger. Choose fail-open only when availability risk explicitly outweighs security risk.

## Common failure patterns
Flat networks, implicit trust, undocumented flows, single control points, management-plane exposure, asymmetric routing surprises, broad any-any rules, designs without telemetry.

## Verification
Trace representative allowed and denied flows, test failover, validate control logs, compare implementation with approved diagrams, and confirm no unintended paths exist.

## Expected output
Reviewed architecture, trust-zone model, flow matrix, control placement, risks, exceptions, and verification evidence.

## Stop conditions
Escalate when critical flows are unknown, ownership is unclear, required controls conflict with availability requirements, or changes could cause uncontrolled production impact.