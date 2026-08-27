# Ingress and Egress Security

## Purpose
Control external traffic entering and leaving Kubernetes workloads while preserving required connectivity and observability.

## When to use
Use for ingress controllers, gateways, external APIs, internet egress, webhook integrations, or data-exfiltration controls.

## Inputs
Traffic flows, DNS names/IPs, TLS requirements, gateway configuration, network policies, proxy/firewall capabilities, and data classifications.

## Preconditions
Identify authoritative external dependencies and certificate/domain ownership.

## Context to inspect
Inspect load balancers, ingress/gateway resources, TLS termination, forwarded headers, source-IP trust, WAF/proxy rules, DNS, NAT, egress gateways, and bypass paths.

## Core knowledge
North-south controls must address authentication, TLS, routing trust, exposure, and exfiltration. Application-layer gateways do not replace pod-level segmentation.

## Procedure
1. Inventory externally reachable services and outbound dependencies.
2. Remove unintended public exposure.
3. Enforce TLS and certificate lifecycle.
4. Define trusted proxy/header boundaries.
5. Restrict ingress routes and methods where feasible.
6. Apply egress allow controls for sensitive workloads.
7. Route high-risk traffic through observable gateways/proxies when justified.
8. Test direct/bypass paths.
9. Monitor unusual destinations and exposure changes.

## Decision points
Use domain/L7 egress controls when IPs are dynamic and the platform supports trustworthy enforcement; otherwise combine network controls with proxy architecture.

## Common failure patterns
Trusting arbitrary forwarded headers; wildcard ingress; unrestricted egress; bypassing gateways via LoadBalancer/NodePort; expired certificates.

## Verification
Test intended routes, forbidden routes, TLS posture, source identity handling, and blocked unauthorized egress.

## Expected output
A documented and tested external traffic boundary with controlled exceptions.

## Stop conditions
Escalate unintended public exposure of sensitive services or inability to constrain high-risk data egress.