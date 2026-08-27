# Kubernetes Cloud Networking

## Purpose
Integrate Kubernetes networking with cloud routing, load balancing, IPAM, security, DNS, and private connectivity.

## When to use
Use for cluster network design, CNI changes, pod IP exhaustion, ingress/egress issues, service reachability, or cloud/Kubernetes boundary incidents.

## Inputs
Cluster topology, CNI, pod/service CIDRs, node subnets, ingress controllers, service types, network policies, cloud routes, and traffic requirements.

## Preconditions
Know the CNI data path and whether pod addresses are native-routed, overlay, or translated.

## Context to inspect
CNI configuration, node/pod routes, ENI/interface limits, service proxies, ingress/load balancers, DNS, network policies, NAT, MTU, and flow telemetry.

## Core knowledge
Kubernetes abstractions hide but do not remove network constraints. CNI choice affects address consumption, observability, MTU, routing, performance, and policy. Cloud and Kubernetes security controls must align.

## Procedure
1. Map pod-to-pod, pod-to-service, ingress, egress, and control-plane flows.
2. Determine actual packet path for each class.
3. Validate pod/service CIDR capacity and overlap.
4. Check CNI/interface/provider limits.
5. Align load balancer and ingress health semantics.
6. Define network-policy boundaries.
7. Verify DNS and private endpoint behavior from pods.
8. Validate MTU and NAT behavior.
9. Instrument cluster and cloud layers.
10. Test node/zone failure and scale-out.

## Decision points
Choose native VPC/VNet routing for integration and observability when address capacity permits; overlays when address conservation or portability outweigh complexity. Use network policy for pod-level segmentation, cloud controls for infrastructure boundaries.

## Common failure patterns
Pod IP exhaustion, overlapping service ranges, MTU mismatch, policy that ignores DNS, load-balancer health mismatch, and troubleshooting only the Kubernetes or only the cloud layer.

## Verification
Run connectivity tests across nodes/zones, validate denied flows, scale pods, inspect routes/flows, test ingress/egress, and measure packet loss/latency.

## Expected output
A documented packet-path model, corrected configuration, capacity/security evidence, and troubleshooting runbook.

## Stop conditions
Stop if CNI behavior cannot be established, a CNI migration risks cluster outage without rollback, or provider limits require architectural change.