# Rollouts and Disruptions

## Purpose
Deliver workload changes and infrastructure maintenance without violating availability objectives.

## When to use
Deployment strategy design, node maintenance, upgrades, or rollout incidents.

## Inputs
Replica count, SLO, startup time, capacity headroom, update risk, and maintenance requirements.

## Context to inspect
Deployment strategy, maxSurge/maxUnavailable, PodDisruptionBudgets, readiness, topology, and node drains.

## Core knowledge
Voluntary disruption controls differ from rollout controls. PDBs protect availability during certain disruptions but can block maintenance if impossible to satisfy.

## Procedure
1. Define minimum available capacity.
2. Measure startup/readiness time.
3. Set rolling-update parameters.
4. Add PDB based on actual redundancy.
5. Ensure spare capacity for surge and drains.
6. Test rollback and failed readiness.
7. Simulate node drain and zone loss.
8. Document emergency override criteria.

## Decision points
Use rolling updates for routine compatible changes; canary/blue-green when risk or validation needs justify extra complexity.

## Common failure patterns
PDB requiring all replicas, no surge capacity, readiness that becomes true too early, and draining stateful workloads without safeguards.

## Verification
Run controlled rollout and drain while observing availability, errors, and recovery.

## Expected output
Safe rollout/disruption policy with tested rollback.

## Stop conditions
Stop if required availability cannot be met with current replicas/capacity.