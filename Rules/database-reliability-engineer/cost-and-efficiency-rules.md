# Cost and Efficiency Rules

## Purpose
Control database cost without degrading reliability, recoverability, or performance commitments.

## Scope
Compute, storage, replicas, backups, licensing, managed-service tiers, and data-transfer cost.

## MUST
- Attribute major database costs to workloads or ownership boundaries where practical.
- Evaluate cost changes against SLOs, capacity headroom, RPO/RTO, and operational risk.
- Use measured utilization and workload evidence before downsizing.
- Review waste from idle replicas, over-retention, unused indexes, and excessive provisioned capacity.

## MUST NOT
- Do not reduce redundancy, backup coverage, or security solely to meet short-term cost targets without explicit risk approval.
- Do not present savings without including migration and operational costs.

## SHOULD
- Prefer reversible efficiency changes and verify realized savings after implementation.

## Exceptions
Approved reliability-cost trade-offs require documented owner, duration, impact, and review date.

## Verification
Review billing data, utilization, architecture decisions, SLO impact, and before/after cost evidence.