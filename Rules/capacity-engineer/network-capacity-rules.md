# Network Capacity

## Purpose
Ensure network constraints are modeled before they degrade throughput, latency, or availability.

## Scope
Applies to service links, load balancers, gateways, inter-zone and inter-region paths, egress, VPNs, and provider networking limits.

## MUST
- Network capacity planning MUST include bandwidth, packets per second, connection rates, concurrent connections, latency, loss, and provider limits where material.
- Plans MUST account for failover traffic shifts and replication or backup traffic when they share paths with production workloads.
- Capacity conclusions MUST distinguish endpoint, link, appliance, and provider bottlenecks.
- Large topology or traffic-routing changes MUST include before/after capacity validation.

## MUST NOT
- MUST NOT assume nominal link bandwidth equals usable application throughput.
- MUST NOT ignore encryption, encapsulation, retransmission, or cross-region overhead when material.
- MUST NOT route failover traffic into a path that has not been validated for the resulting peak load.

## SHOULD
- Track utilization by direction and traffic class where contention differs.
- Include burst and connection-establishment behavior in tests for high-churn workloads.

## Exceptions
Exceptions require bounded risk, alternate evidence, monitoring, and an approved remediation plan.

## Verification
Review flow metrics, load-balancer limits, connection statistics, packet loss, latency, routing design, and failover tests.
