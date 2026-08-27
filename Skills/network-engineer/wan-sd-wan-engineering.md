# WAN and SD-WAN Engineering

## Purpose
Design and operate resilient WAN connectivity with application-aware path selection and controlled provider failure.

## When to use
Use for branch connectivity, SD-WAN rollout, circuit migration, brownout investigation, or WAN capacity planning.

## Inputs
Site criticality, circuits, underlay/overlay topology, SLAs, application classes, traffic volumes, routing policy, telemetry, and provider details.

## Context to inspect
Loss, latency, jitter, utilization, tunnel health, path-selection thresholds, QoS, NAT, BGP/overlay routes, provider diversity, and local breakout.

## Core knowledge
WAN failures are often degradations rather than hard downs. Effective designs distinguish loss/latency/jitter brownouts, preserve routing stability, and avoid correlated provider or last-mile dependencies.

## Procedure
1. Classify site and application availability requirements.
2. Inventory underlays, providers, physical paths, and bandwidth.
3. Baseline performance by path and time period.
4. Define overlay routing and application classes.
5. Set health thresholds from application tolerance, not arbitrary defaults.
6. Design failover/failback hysteresis to avoid flapping.
7. Validate QoS marking and queue treatment end to end.
8. Account for Internet breakout, SaaS, cloud, and security service paths.
9. Test circuit loss, degradation, and controller isolation.
10. Measure convergence and user-visible impact.
11. Document provider escalation evidence and operational runbooks.

## Decision points
Choose local Internet breakout when SaaS/cloud path efficiency outweighs centralized inspection needs and equivalent security controls exist. Prefer diverse carriers and entrances for critical sites when budget supports genuine path diversity.

## Common failure patterns
Two circuits sharing one last mile, aggressive SLA probes causing oscillation, asymmetric stateful paths, oversubscribed backup links, DSCP rewritten by providers, and tunnels healthy while applications are impaired.

## Verification
Prove application paths, SLA measurements, QoS behavior, failover/failback, backup capacity, and observability during hard and soft failures.

## Expected output
WAN design/policy, path-selection criteria, capacity model, tested failover evidence, and provider/operations runbook.

## Stop conditions
Stop when physical diversity cannot be confirmed, failover would overload backup capacity, or provider behavior contradicts contracted/assumed service semantics.