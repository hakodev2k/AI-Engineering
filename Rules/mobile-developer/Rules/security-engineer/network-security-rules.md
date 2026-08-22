# Network Security Rules

## Purpose
Limit attack paths and unauthorized communication through intentional network boundaries.

## Scope
Applies to ingress, egress, service-to-service communication, administration paths, DNS, proxies, firewalls, and network segmentation.

## MUST
- Network exposure MUST be limited to required sources, destinations, ports, and protocols.
- Administrative access paths MUST be strongly authenticated and restricted.
- Sensitive network boundaries MUST be documented and reviewed when architecture changes.
- Egress controls MUST be considered for workloads where data exfiltration or command-and-control risk is material.
- Internet-facing services MUST have appropriate protection, monitoring, and ownership.

## MUST NOT
- MUST NOT use unrestricted any-to-any rules as a permanent production default.
- MUST NOT expose internal management services publicly solely for convenience.
- MUST NOT assume private network location alone establishes trust.

## SHOULD
- Prefer segmented networks and authenticated service identity over implicit network trust.
- Prefer centrally managed policies and observable traffic controls.

## Exceptions
Exceptions require scope, business reason, risk analysis, compensating controls, approval, and expiry or review date.

## Verification
Use firewall and security-group review, network policy tests, architecture diagrams, exposure scans, flow logs, and access-path validation.