# Service Networking

## Purpose
Design and troubleshoot Kubernetes service discovery and east-west connectivity.

## When to use
Creating services, diagnosing connectivity, or changing cluster networking.

## Inputs
Service ports, protocols, DNS names, endpoints, CNI behavior, and network requirements.

## Context to inspect
Services, EndpointSlices, DNS, kube-proxy or replacement dataplane, CNI, routes, and policies.

## Core knowledge
Service virtual IPs route to ready endpoints; DNS discovery and dataplane behavior are separate layers. CNI implementation determines pod networking semantics.

## Procedure
1. Trace traffic from client to DNS, Service, endpoint, and pod.
2. Validate selectors and EndpointSlices.
3. Confirm port/targetPort/protocol mappings.
4. Test DNS resolution and direct endpoint connectivity.
5. Inspect NetworkPolicies and CNI state.
6. Check node-level dataplane only after higher layers are validated.
7. Record the failed layer and evidence.

## Decision points
Use ClusterIP for internal stable discovery; headless services when clients need endpoint identity; external exposure belongs to ingress/gateway design.

## Common failure patterns
Wrong selectors, named-port mismatches, debugging only with ping, assuming DNS failure equals network failure, and bypassing policy analysis.

## Verification
Test connectivity from representative namespaces/nodes and confirm only intended paths succeed.

## Expected output
Correct service configuration or evidence-backed network root cause.

## Stop conditions
Escalate when CNI/control-plane access required for diagnosis is unavailable.