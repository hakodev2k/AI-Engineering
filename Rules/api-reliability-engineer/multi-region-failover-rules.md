# Multi-Region and Failover Rules

## Purpose
Make regional redundancy and failover an evidenced recovery capability rather than an assumed property.

## Scope
Applies to APIs deployed across regions, zones, clusters, or active/passive environments.

## MUST
- Failover design MUST define traffic switching, state behavior, dependency readiness, recovery objectives, and split-brain prevention where relevant.
- Standby capacity MUST be sufficient for the intended failover load or explicitly document degraded capacity.
- Failover procedures MUST be exercised periodically with measurable recovery results.
- DNS, routing, certificates, secrets, quotas, and data replication MUST be included in readiness checks.
- Failback MUST have its own safety and consistency plan.

## MUST NOT
- MUST NOT claim regional resilience because compute exists in multiple regions while critical dependencies remain single-region.
- MUST NOT execute a high-risk production failover outside an incident or approved exercise without human authorization.
- MUST NOT ignore replication lag or divergent writes during recovery.

## SHOULD
- Automated failover SHOULD be used only when detection and state-safety conditions are reliable.
- Recovery objectives SHOULD be validated from drills rather than architecture diagrams.

## Exceptions
Exceptions require explicit single-region risks, recovery alternatives, owner, deadline, and approval.

## Verification
Review architecture, dependency inventory, failover drills, routing tests, replication metrics, capacity evidence, and recovery timelines.