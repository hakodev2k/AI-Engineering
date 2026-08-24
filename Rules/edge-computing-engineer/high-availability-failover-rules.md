# High Availability and Failover
## Purpose
Maintain required service when nodes, links, or sites fail.
## Scope
Redundancy, failover, leader election, and degraded operation.
## MUST
- Availability targets MUST map to explicit failure domains and redundancy assumptions.
- Failover MUST be tested under realistic node, link, and dependency failures.
- Stateful failover MUST define consistency and data-loss bounds.
## MUST NOT
- MUST NOT count components in the same failure domain as independent redundancy.
- MUST NOT enable automatic failover that can create unsafe split-brain effects without safeguards.
## SHOULD
- Degraded modes SHOULD preserve the most critical functions first.
## Exceptions
Single-node designs require documented business acceptance of outage and recovery objectives.
## Verification
Run failover drills, partition tests, recovery timing, state-consistency checks, and failure-domain review.