# Availability and Disruption Management

## Purpose
Keep workloads available through voluntary disruption, rollout, node maintenance, and infrastructure failure.
## When to use
PDB design, maintenance planning, availability incidents, or multi-zone deployment.
## Inputs
Replica counts, SLOs, topology, quorum, rollout behavior, maintenance policy.
## Context to inspect
PDBs, topology spread, anti-affinity, probes, Deployments/StatefulSets, node drains, autoscaler behavior.
## Core knowledge
PDBs constrain voluntary eviction, not involuntary failure. Availability requires replica independence, healthy capacity, correct probes, and failure-domain distribution.
## Procedure
1. Define tolerated failures. 2. Validate replica count and topology. 3. Set readiness to represent serving capability. 4. Configure PDB without blocking all maintenance. 5. Test rolling update and drain. 6. Simulate node/zone loss. 7. Verify replacement capacity and recovery time.
## Decision points
Use minAvailable for explicit quorum/availability requirements; maxUnavailable is often easier for scalable stateless workloads.
## Common failure patterns
Single replica with strict PDB, all replicas in one zone, PDB blocking drains, readiness too shallow, and insufficient surge capacity.
## Verification
Prove maintenance and failure scenarios meet SLO and recover without manual intervention where expected.
## Expected output
Availability controls tied to failure scenarios and tested operational procedures.
## Stop conditions
Escalate when required availability exceeds available failure domains or capacity budget.