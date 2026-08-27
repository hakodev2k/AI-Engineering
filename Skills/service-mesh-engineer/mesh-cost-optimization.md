# Mesh Cost Optimization

## Purpose
Reduce mesh infrastructure and telemetry cost while preserving required SLOs and security controls.

## When to use
Use for cloud-cost review, fleet growth or resource-rightsizing.

## Inputs
Proxy/gateway/control-plane resources, node cost, telemetry spend, traffic volume and SLOs.

## Context to inspect
Requests/limits, actual utilization, sidecar density, gateway autoscaling, log volume, trace sampling and cross-zone traffic.

## Core knowledge
Mesh cost includes direct compute, node fragmentation, telemetry storage, cross-zone transfer and engineering overhead. Optimization must be tied to measured workload behavior.

## Procedure
1. Attribute costs to control plane, data plane, gateways, telemetry and network transfer.
2. Rank largest cost drivers.
3. Right-size proxies from percentile utilization plus failure headroom.
4. Reduce redundant access logs and high-volume traces.
5. Tune sampling by diagnostic value.
6. Evaluate locality to reduce transfer without harming resilience.
7. Consolidate gateways only where blast radius remains acceptable.
8. Test each saving against SLO/security gates.
9. Track realized savings after rollout.

## Decision points
Prefer removing low-value telemetry before reducing security controls. Shared infrastructure saves cost but increases failure coupling.

## Common failure patterns
Rightsizing from averages, starving proxies, disabling telemetry needed for incidents, locality overload and cost shifting to application teams.

## Verification
Compare spend and unit cost before/after while confirming latency, errors, saturation and security controls remain within targets.

## Expected output
A prioritized optimization plan with quantified savings and guardrails.

## Stop conditions
Stop when cost attribution is unreliable or proposed savings compromise mandated controls or failover capacity.