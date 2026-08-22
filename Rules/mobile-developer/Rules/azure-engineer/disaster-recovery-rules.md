# Disaster Recovery Rules

## Purpose
Prepare for region, platform, dependency, and operational disasters beyond routine backup restoration.

## Scope
Regional failover, Azure Site Recovery, replicated services, recovery orchestration, DR drills, and crisis dependencies.

## MUST
- Define disaster scenarios, recovery objectives, decision authority, and invocation criteria.
- Identify dependencies that must remain available during regional or control-plane disruption.
- Validate replication and failover mechanisms with scheduled drills.
- Document failback strategy and data reconciliation requirements.
- Require human approval for production disaster failover unless pre-authorized automation is explicitly designed and tested.

## MUST NOT
- Assume geo-replication guarantees application-consistent recovery.
- Perform untested production failover solely from theoretical architecture assumptions.
- Ignore DNS, identity, secrets, networking, or external dependencies in DR planning.

## SHOULD
- Exercise partial and full DR scenarios at risk-appropriate intervals.

## Exceptions
Unmet DR requirements require explicit business risk acceptance and remediation ownership.

## Verification
Review DR architecture, replication status, runbooks, drill evidence, recovery timings, reconciliation results, and approvals.