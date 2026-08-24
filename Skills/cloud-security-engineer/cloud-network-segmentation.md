# Cloud Network Segmentation

## Purpose
Reduce attack surface and lateral movement through intentional cloud network boundaries and traffic policy.

## When to use
Use for VPC/VNet design, service exposure, environment isolation, hybrid connectivity, or lateral-movement remediation.

## Inputs
Network topology, service dependencies, ports, protocols, trust zones, DNS, load balancers, firewalls, and routing.

## Context to inspect
Inspect actual routes, security groups, network ACLs, private endpoints, peering/transit, ingress controllers, egress paths, and DNS resolution.

## Core knowledge
Segmentation should follow trust and dependency boundaries, not arbitrary subnet counts. Default-deny is strongest when operationally supportable and observable.

## Procedure
1. Classify trust zones.
2. Map required flows source-to-destination.
3. Identify public and transitive paths.
4. Remove unnecessary exposure.
5. Define narrow ingress and egress rules.
6. Separate environments and sensitive tiers.
7. Control administrative paths.
8. Log accepted and denied flows.
9. Test allowed and blocked connectivity.

## Decision points
Prefer identity-aware service controls when network location is insufficient; use private connectivity when it materially reduces exposure without creating opaque operational dependencies.

## Common failure patterns
0.0.0.0/0 administrative access, overly broad east-west rules, forgotten peering routes, uncontrolled egress, and rules with no owner.

## Verification
Validate reachability from representative zones, inspect effective rules and routes, and confirm denied paths generate useful telemetry.

## Expected output
Documented trust zones, minimal flow rules, test evidence, and exceptions.

## Stop conditions
Stop when dependency mapping is incomplete or rule changes could isolate critical systems without a tested recovery path.