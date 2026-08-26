# Partitioning and Rebalancing

## Purpose
Preserve availability and predictable load as cache clusters scale or topology changes.

## Scope
Sharding, consistent hashing, slot movement, resharding, and node replacement.

## MUST
- Partition strategy MUST define distribution, membership change behavior, and failure domains.
- Rebalancing MUST be capacity-checked for network, CPU, memory, and origin miss amplification.
- Topology changes with material production risk MUST have rollback or abort criteria and human approval.
- Clients MUST handle membership changes without unbounded retry storms.

## MUST NOT
- Large resharding operations MUST NOT be performed without monitoring and recovery procedures.
- Partition health MUST NOT be inferred solely from cluster-wide averages.
- Node removal MUST NOT violate required redundancy without explicit risk acceptance.

## SHOULD
- Prefer gradual rebalancing and bounded migration rates.
- Monitor per-partition load and movement progress.

## Exceptions
Require reason, evidence, risk, alternatives, rollback, and approval.

## Verification
Review topology, capacity models, migration plans, chaos tests, per-partition telemetry, and post-change validation.