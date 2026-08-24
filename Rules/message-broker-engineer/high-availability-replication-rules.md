# High Availability and Replication

## Purpose
Keep messaging available through expected component failures.

## Scope
Replication, quorum, leader election, availability zones, and failure domains.

## MUST
- Replication settings MUST align with stated durability and availability objectives.
- Failure domains MUST be independent enough to survive the documented design failure.
- Quorum-affecting maintenance MUST preserve safe write and recovery behavior.

## MUST NOT
- MUST NOT reduce replication or durability controls in production solely to improve throughput without approval.
- MUST NOT assume redundancy is effective without failure testing.

## SHOULD
- Test broker-node and zone failures under representative load.

## Exceptions
Require risk analysis, time bound, recovery plan, and approval.

## Verification
Inspect topology, replica health, quorum settings, failover tests, and recovery timing.