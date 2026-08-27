# Control Plane Operations

## Purpose
Operate mesh control planes as reliable distributed configuration systems.

## When to use
Use for installation, scaling, upgrades, multi-tenancy, control-plane incidents and configuration-distribution problems.

## Inputs
Topology, workload count, config volume, control-plane metrics/logs, version matrix, availability targets.

## Context to inspect
Deployment replicas, leader election, API-server load, discovery connections, certificate authorities, webhooks, revision strategy and dependency health.

## Core knowledge
Control-plane failure should not immediately break established data-plane traffic, but it can block configuration, endpoint and certificate updates. Scale is driven by workload churn, config fan-out and discovery state, not only request traffic.

## Procedure
1. Define availability and recovery objectives.
2. Inventory control-plane dependencies and failure domains.
3. Measure config push latency, errors, memory, CPU and connection counts.
4. Partition tenancy or revisions where blast radius requires it.
5. Configure HA across appropriate zones.
6. Protect admission/discovery dependencies from overload.
7. Test loss of replicas and dependent APIs.
8. Use canary/revision upgrades and explicit compatibility checks.
9. Validate rollback before promotion.
10. Maintain runbooks for stale configuration and discovery failures.

## Decision points
Choose shared control planes for simplicity when tenant risk is low; isolate by revision, cluster or trust domain when regulatory, scale or blast-radius requirements dominate.

## Common failure patterns
Single-zone placement, webhook outages blocking deployments, global bad pushes, version skew, certificate dependency failure and treating readiness as proof of convergence.

## Verification
Demonstrate HA failover, bounded config convergence, upgrade rollback and continued data-plane operation during control-plane disruption.

## Expected output
A resilient control-plane operating model with capacity thresholds and recovery procedures.

## Stop conditions
Escalate when compatibility is unknown, CA integrity is questionable, or upgrade rollback is unavailable.