# WAN, SD-WAN, and QoS Engineering

## Purpose
Design branch and wide-area connectivity that balances application experience, resilience, cost, traffic engineering, and operational simplicity.

## When to use
Use for WAN redesign, SD-WAN rollout, circuit migration, SaaS/cloud optimization, voice/video quality issues, or congestion management.

## Inputs
Sites, circuits, application classes, bandwidth, latency/loss targets, provider SLAs, security model, traffic volumes, and business criticality.

## Context to inspect
Inspect underlay health, overlay tunnels, path-selection policy, SLA probes, QoS markings/queues, Internet breakout, NAT, security inspection, and failover capacity.

## Core knowledge
SD-WAN does not repair poor underlays; it provides policy and path choices. QoS manages contention but cannot create bandwidth. Classification must align end to end where domains honor markings.

## Procedure
1. Classify applications by business and network requirements.
2. Baseline each underlay path.
3. Define preferred and fallback path policy.
4. Design local/central Internet breakout deliberately.
5. Define QoS classes, markings, queues, and shaping.
6. Size paths for normal and failover demand.
7. Configure SLA thresholds that avoid route flapping.
8. Test brownout, outage, and restoration behavior.
9. Monitor experience by application and site.
10. Tune using measured outcomes.

## Decision points
Use multiple diverse transports when resilience justifies cost. Prioritize real-time/control traffic under contention, but avoid excessive classes that operators cannot reason about.

## Common failure patterns
Shared last-mile “diversity,” aggressive SLA thresholds, QoS configured only at one edge, undersized failover links, DSCP trust without validation, and overlay complexity hiding provider faults.

## Verification
Measure application latency/loss/jitter, path selection, queue behavior, failover capacity, and recovery across representative sites.

## Expected output
A WAN/SD-WAN design with traffic policy, QoS, resilience, capacity, security, and operational telemetry.

## Stop conditions
Stop when carrier diversity cannot be verified, application requirements are unknown, or failover testing could disrupt critical sites without coordination.