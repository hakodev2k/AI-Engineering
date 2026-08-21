# High Availability Rules
## Purpose
Design database availability around explicit service objectives and failure modes.
## Scope
Replication, failover, quorum, replicas, topology, and regional resilience.
## MUST
- Map availability architecture to documented failure scenarios and service objectives.
- Test failover and verify application reconnect, consistency, and recovery behavior.
- Monitor replication health and lag where replicas affect correctness or recovery.
## MUST NOT
- Claim high availability from redundant nodes that share an unexamined failure domain.
- Route correctness-sensitive reads to lagging replicas without defined tolerance.
## SHOULD
- Prefer automated failover only when split-brain and recovery behavior are understood and tested.
## Exceptions
Reduced redundancy requires documented duration, risk, and approval.
## Verification
Review topology, failure-domain mapping, failover drills, replica metrics, and recovery evidence.