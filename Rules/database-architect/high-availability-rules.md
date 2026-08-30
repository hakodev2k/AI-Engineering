# High Availability

## Purpose
Ensure database availability design is explicit, testable, and aligned with business impact.

## Scope
Failover, quorum, redundancy, health checks, fencing, maintenance, and availability targets.

## MUST
- Availability architecture MUST trace to defined SLOs, RTO, RPO, and tolerated failure domains.
- Failover mechanisms MUST prevent split-brain and stale-primary writes.
- Maintenance procedures MUST preserve required redundancy or explicitly enter an approved reduced-resilience state.
- Recovery behavior MUST be tested under realistic node, zone, and network failures.

## MUST NOT
- MUST NOT claim high availability from component count alone.
- MUST NOT automate failover without validating fencing, quorum, and data-loss behavior.
- MUST NOT leave critical failover dependencies in the same failure domain.

## SHOULD
- Prefer automated detection with controlled, observable failover.
- Capacity SHOULD preserve headroom after the loss of a required failure domain.

## Exceptions
Exceptions require quantified availability impact, duration, compensating controls, and approval.

## Verification
Review topology, SLO mapping, failover drills, quorum settings, capacity evidence, and incident records.