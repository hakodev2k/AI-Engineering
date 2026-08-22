# Scheduling and Placement

## Purpose
Control pod placement for availability, performance, isolation, hardware needs, and efficient capacity use.

## When to use
Multi-zone services, specialized nodes, noisy-neighbor issues, or scheduling failures.

## Inputs
Topology, node labels/taints, workload criticality, hardware requirements, and replica count.

## Context to inspect
Affinity rules, topology spread, taints/tolerations, selectors, pending events, and node capacity.

## Core knowledge
Placement constraints interact and can make workloads unschedulable. Topology spread usually expresses availability intent better than rigid anti-affinity.

## Procedure
1. Define placement objective.
2. Inspect current labels, taints, and topology keys.
3. Apply the weakest constraint that meets the objective.
4. Use tolerations only with matching placement intent.
5. Spread critical replicas across failure domains.
6. Simulate node/zone loss and capacity pressure.
7. Inspect scheduler events for unintended constraints.

## Decision points
Use hard rules for true requirements and preferred rules for optimization. Reserve dedicated nodes for isolation or specialized hardware when justified.

## Common failure patterns
Overconstrained affinity, toleration without selector/affinity, invalid topology labels, and assuming replica count guarantees zone diversity.

## Verification
All replicas schedule under normal conditions and retain acceptable placement after node loss or scaling.

## Expected output
Minimal, explicit placement policy with tested failure behavior.

## Stop conditions
Stop if required topology labels or capacity are unavailable.