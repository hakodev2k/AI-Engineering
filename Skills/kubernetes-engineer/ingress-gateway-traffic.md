# Ingress and Gateway Traffic

## Purpose
Expose workloads safely and reliably using ingress controllers, Gateway API, load balancers, TLS, and routing policies.

## When to use
Public/private HTTP exposure, routing changes, TLS termination, or north-south traffic incidents.

## Inputs
Domains, routes, certificates, authentication boundaries, protocols, SLOs, and controller capabilities.

## Context to inspect
Ingress/Gateway resources, controllers, Services, DNS, load balancers, TLS secrets, health checks, and policies.

## Core knowledge
Kubernetes API objects require a compatible controller. Traffic path spans DNS, external load balancer, gateway/controller, Service, and pod.

## Procedure
1. Map the full request path.
2. Verify controller ownership and supported features.
3. Configure hosts, routes, backends, and TLS explicitly.
4. Define timeouts/body limits/retries intentionally.
5. Validate source IP and forwarded-header behavior.
6. Test health checks and certificate rotation.
7. Exercise failure and rollback paths.

## Decision points
Prefer Gateway API when its richer role separation and routing model are supported; use Ingress where ecosystem compatibility is stronger.

## Common failure patterns
Controller-specific annotations without validation, retry amplification, insecure TLS defaults, bad forwarded headers, and missing backend health analysis.

## Verification
Test routes, TLS, redirects, failure responses, observability, and unauthorized paths externally.

## Expected output
Documented, secure traffic configuration and tested routing behavior.

## Stop conditions
Escalate DNS, certificate, or external load-balancer ownership blockers.