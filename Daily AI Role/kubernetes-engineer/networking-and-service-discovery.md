# Networking and Service Discovery

## Purpose
Design and troubleshoot Kubernetes pod, service, DNS, and north-south networking.

## When to use
Use for connectivity failures, new cluster networking, service exposure, or latency/path investigations.

## Inputs
CNI configuration, CIDRs, Services, endpoints, DNS data, ingress/gateway config, packet/flow evidence.

## Context to inspect
Inspect pod/service CIDRs, kube-proxy or replacement dataplane, NetworkPolicies, CoreDNS, load balancers, routes, MTU, and cloud firewall rules.

## Core knowledge
Pods require routable connectivity; Services provide virtual discovery/load balancing; DNS depends on service/endpoints; NAT, conntrack, MTU, and policy can create non-obvious failures.

## Procedure
1. Define source, destination, protocol, port, and expected path.
2. Verify pod readiness, IPs, Service selectors, and EndpointSlices.
3. Resolve DNS from the affected namespace.
4. Test direct pod IP then Service IP/name.
5. Inspect policy, routes, NAT, MTU, and load-balancer health.
6. Compare working and failing nodes/zones.
7. Capture packets or flow logs only where needed.
8. Correct the narrowest proven fault and retest.

## Decision points
Choose ClusterIP for internal discovery, headless Services for direct endpoint discovery, and ingress/gateway/load balancer based on protocol and routing requirements.

## Common failure patterns
Selector mismatch, stale DNS assumptions, overlapping CIDRs, MTU mismatch, asymmetric routing, policy default-deny surprises, and debugging only from the operator workstation.

## Verification
Prove DNS resolution, endpoint reachability, Service routing, cross-node/zone traffic, and expected policy enforcement.

## Expected output
A validated network path or root-cause report with minimal corrective changes.

## Stop conditions
Escalate when cloud/network ownership is external, packet capture requires restricted access, or CIDR changes imply disruptive migration.