# IPv6 Readiness and Reliability

## Purpose
Design and validate IPv6 deployment so dual-stack or IPv6-native networks behave predictably across routing, DNS, security, observability, and application dependencies.

## When to use
Use for IPv6 adoption, dual-stack rollout, cloud modernization, address exhaustion mitigation, or IPv6-specific incidents.

## Inputs
Address plans, routing policy, DNS records, firewall rules, application support, load balancer configuration, monitoring, and provider capabilities.

## Context to inspect
Inspect RA/DHCPv6 behavior, prefix allocation, AAAA records, Happy Eyeballs behavior, IPv6 firewall policy, tunnel dependencies, and parity with IPv4 controls.

## Core knowledge
Dual stack doubles important failure modes if IPv4 and IPv6 are managed inconsistently. Clients may prefer IPv6, so partial IPv6 reachability can degrade applications even when IPv4 is healthy.

## Procedure
1. Inventory IPv6 support across hosts, applications, providers, and security controls.
2. Define hierarchical address allocation and routing boundaries.
3. Validate DNS AAAA publication strategy.
4. Review firewall and segmentation parity.
5. Test application behavior over IPv6 independently of IPv4.
6. Verify load balancers, proxies, monitoring, and logging preserve IPv6 context.
7. Test broken-IPv6 scenarios and client fallback behavior.
8. Monitor adoption and error rates separately by protocol.
9. Document rollback and coexistence strategy.

## Decision points
Use dual stack when ecosystem compatibility requires IPv4; use IPv6-native with translation only when dependency support and operational maturity are sufficient.

## Common failure patterns
Publishing AAAA before end-to-end readiness, missing IPv6 firewall rules, unmanaged temporary addressing, inconsistent observability, and assuming IPv4 success proves IPv6 health.

## Verification
Run representative connectivity, DNS, security, failover, and performance tests over IPv6 and compare against IPv4 expectations.

## Expected output
A verified IPv6 rollout or readiness assessment with explicit compatibility and reliability gaps.

## Stop conditions
Escalate when upstream providers, critical applications, or security controls cannot support required IPv6 behavior safely.