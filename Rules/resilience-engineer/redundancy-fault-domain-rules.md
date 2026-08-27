# Redundancy and Fault Domain Rules

## Purpose
Ensure redundancy provides real isolation from failures rather than duplicate capacity with hidden shared fate.

## Scope
Applies to replicated services, clusters, zones, regions, networks, storage, queues, identity systems, and other redundant components.

## MUST
- Redundant components MUST be placed across fault domains appropriate to the failure being mitigated.
- Critical redundancy designs MUST identify shared power, network, control-plane, identity, storage, deployment, configuration, and dependency risks.
- Capacity after the loss of the designed fault domain MUST meet documented minimum service requirements or trigger an explicit degraded mode.
- Failover paths MUST be exercised under representative conditions before being relied upon for production recovery.
- Quorum and replica placement MUST account for correlated loss and network partition behavior.

## MUST NOT
- MUST NOT count replicas in the same effective fault domain as independent redundancy.
- MUST NOT rely on a standby that is unmonitored, unpatched, untested, or unable to accept production load.
- MUST NOT add redundancy that creates unsafe split-brain behavior without an explicit consistency strategy.

## SHOULD
- Designs SHOULD minimize shared operational mechanisms between primary and recovery paths when practical.
- Fault-domain assumptions SHOULD be encoded in infrastructure policy or automated placement controls.

## Exceptions
Reduced isolation requires a documented constraint, quantified consequence, compensating control, verification plan, and accountable approval.

## Verification
Inspect topology and dependency graphs, placement policy, quorum configuration, failover test evidence, and post-failure capacity measurements. Verify the claimed independent domains are independent in practice.