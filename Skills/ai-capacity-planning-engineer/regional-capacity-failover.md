# Regional Capacity and Failover Planning

## Purpose
Plan AI capacity across regions and failure domains so critical workloads survive regional degradation without hidden overload elsewhere.

## When to use
Use for multi-region serving, disaster recovery, data residency, new-region launches, or failover incidents.

## Inputs
Regional demand, latency requirements, data residency, hardware availability, quotas, inter-region routing, failover policy, dependency topology.

## Preconditions
Failure domains and routing behavior are documented.

## Context to inspect
Traffic manager, model availability, provider regions, data replicas, network paths, warm capacity, regional quotas, compliance constraints.

## Core knowledge
Nominal global spare capacity is not equivalent to usable failover capacity. Residency, latency, model availability, and simultaneous dependency failures can prevent spare capacity from absorbing traffic.

## Procedure
1. Map demand and criticality by region.
2. Identify allowed failover destinations.
3. Quantify capacity needed after each credible regional failure.
4. Check model, data, and tool availability in target regions.
5. Include routing and cache-warm effects.
6. Reserve or prewarm required capacity.
7. Test partial and full failover.
8. Define restoration thresholds.
9. Recalculate after regional growth or architecture changes.

## Decision points
Use active-active when latency and rapid recovery justify permanent distributed reserve. Use warm standby when cost matters and startup time still meets objectives.

## Common failure patterns
Counting forbidden regions as reserve, ignoring model loading time, assuming failover traffic is evenly distributed, and missing shared provider dependencies.

## Verification
Failover exercises demonstrate that designated regions absorb traffic while meeting critical SLOs and policy constraints.

## Expected output
A regional capacity matrix with normal load, failover obligations, reserve, and recovery rules.

## Stop conditions
Escalate when no compliant region can absorb the required workload.