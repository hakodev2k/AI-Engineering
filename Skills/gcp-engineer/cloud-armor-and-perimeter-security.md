# Cloud Armor and Perimeter Security

## Purpose
Protect exposed and sensitive workloads with Cloud Armor policies, network controls, service perimeters, and layered access restrictions.

## When to use
Use for internet-facing applications, API abuse mitigation, data exfiltration controls, or security-hardening reviews.

## Inputs
Threat model, application endpoints, trusted sources, protected services, data sensitivity, and operational constraints.

## Context to inspect
Load balancers, Armor policies, firewall policies, VPC Service Controls, ingress/egress rules, access levels, and security logs.

## Core knowledge
Edge WAF controls do not replace application authorization. VPC Service Controls reduce data-exfiltration paths for supported Google services but can break legitimate integrations if boundaries are poorly mapped.

## Procedure
1. Identify assets and attack paths.
2. Map edge, network, identity, and service-control layers.
3. Add baseline managed WAF rules in preview when appropriate.
4. Tune rate controls from traffic evidence.
5. Define service perimeters around sensitive managed services.
6. Model required ingress and egress exceptions.
7. Validate CI/CD and operator access paths.
8. Enable logging and alerting.
9. Test blocked and permitted flows.
10. Periodically review exceptions.

## Decision points
Use deny rules only after observing likely false positives. Apply service perimeters when exfiltration risk justifies operational complexity.

## Common failure patterns
WAF rules deployed directly to block, perimeter bridges that defeat isolation, broad IP allowlists, and no exception ownership.

## Verification
Replay representative requests, test exfiltration paths, inspect logs, and confirm application authorization still enforces identity.

## Expected output
A layered perimeter-security model.

## Stop conditions
Stop if business-critical integrations have no test environment or documented traffic paths.