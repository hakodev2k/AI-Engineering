# Replication and Placement Rules

## Purpose
Ensure replicas survive realistic infrastructure failures.

## Scope
Applies to replica count, erasure coding, placement, quorum, and failure-domain topology.

## MUST
- Map replicas or fragments across independent failure domains appropriate to the durability objective.
- Validate quorum behavior during node, rack, zone, and network failures.
- Detect and remediate under-replication within defined recovery objectives.

## MUST NOT
- Count colocated replicas as independent durability copies.
- Change placement policy without modeling rebalance load and temporary risk.
- Allow prolonged under-replication without alerting and accountable ownership.

## SHOULD
- Continuously audit placement conformance and skew.
- Prefer policies that remain safe during maintenance plus one additional failure when feasible.

## Exceptions
Reduced redundancy requires time-bounded approval, explicit exposure, and restoration criteria.

## Verification
Inspect placement maps, quorum tests, under-replication metrics, and failure-injection results.