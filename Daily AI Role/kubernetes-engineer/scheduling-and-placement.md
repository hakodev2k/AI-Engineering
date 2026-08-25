# Scheduling and Placement

## Purpose
Control pod placement to satisfy availability, hardware, locality, isolation, and cost requirements while preserving scheduler flexibility.

## When to use
Use for multi-zone services, specialized hardware, noisy-neighbor isolation, stateful workloads, or persistent Pending pods.

## Inputs
Workload requirements, node labels/taints, topology, resource requests, storage topology, and scheduling events.

## Context to inspect
Inspect affinity rules, topology spread constraints, taints/tolerations, node selectors, priorities, disruption budgets, CSI topology, and scheduler events.

## Core knowledge
Hard constraints reduce feasible nodes; soft preferences preserve resilience. Taints repel pods, affinity attracts/repels based on labels, topology spread distributes replicas, and priority/preemption affects contention.

## Procedure
1. State the placement objective and failure scenario.
2. Verify resource requests and available node capacity.
3. Inspect current labels, taints, and topology keys.
4. Prefer topology spread and preferred affinity before hard pinning.
5. Add hard constraints only for true correctness or isolation requirements.
6. Coordinate storage zone constraints and autoscaler behavior.
7. Test scheduling with node/AZ loss and rolling updates.
8. Inspect scheduler events for unsatisfied predicates.
9. Document label ownership and invariants.

## Decision points
Use node affinity for hardware/location requirements, taints for dedicated or protected nodes, anti-affinity or topology spread for replica separation, and priority only when business criticality justifies preemption.

## Common failure patterns
Over-constrained pods, mutable labels used as invariants, impossible anti-affinity, missing tolerations, topology keys that do not exist, and constraints incompatible with autoscaling.

## Verification
Confirm replicas distribute as intended, replacements schedule during failures, autoscaling can provision eligible nodes, and no unintended workloads enter protected pools.

## Expected output
Minimal placement rules with rationale, failure behavior, and verification evidence.

## Stop conditions
Escalate if topology labels are unreliable, storage cannot satisfy placement, or business priority for preemption is undefined.