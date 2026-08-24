# Network Capacity Rules
## Purpose
Ensure network paths can carry expected and failover traffic safely.
## Scope
Bandwidth, packets, connections, load balancers, NAT, DNS, inter-zone, inter-region, and egress.
## MUST
- Plans MUST evaluate relevant bandwidth and connection-rate limits across the complete critical path.
- Failover traffic MUST be included when sizing alternate paths.
- Network capacity claims MUST use measured throughput and saturation evidence where available.
## MUST NOT
- MUST NOT assume interface line rate equals usable application throughput.
- MUST NOT ignore connection, packet-rate, NAT, or load-balancer limits when bandwidth is low.
## SHOULD
- Plans SHOULD identify cost-sensitive cross-zone or egress scaling effects.
## Exceptions
Unobservable limits require conservative vendor-documented bounds.
## Verification
Review network metrics, quota data, topology, and controlled throughput tests.