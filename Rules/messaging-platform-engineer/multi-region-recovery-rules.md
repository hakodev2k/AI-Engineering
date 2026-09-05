# Multi-Region and Recovery Rules

## Purpose
Define safe behavior during zone, region, cluster, or control-plane failures.

## Scope
Replication, failover, active-active/active-passive topology, DNS/routing, recovery points, and recovery time.

## MUST
- Recovery objectives MUST define acceptable message loss, duplicate risk, and restoration time.
- Cross-region replication semantics and lag MUST be documented and measured.
- Failover procedures MUST define producer and consumer routing, offset/checkpoint treatment, and duplicate handling.
- Recovery tests MUST exercise realistic broker or region loss at a frequency appropriate to service criticality.

## MUST NOT
- MUST NOT claim zero data loss without evidence that replication and acknowledgement boundaries guarantee it.
- MUST NOT fail over blindly when split-brain or divergent state can occur.
- MUST NOT treat replica presence as proof that consumers can resume correctly.

## SHOULD
- Prefer reversible failover and explicit failback procedures.

## Exceptions
Reduced recovery capability requires documented risk, duration, mitigation, and approval.

## Verification
Review topology, replication metrics, failover tests, RPO/RTO evidence, and recovery runbooks.