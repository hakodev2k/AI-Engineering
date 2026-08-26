# ML Network Segmentation and Egress Control

## Purpose
Limit lateral movement, data exfiltration, and uncontrolled dependency access from ML training, evaluation, and serving workloads.

## When to use
Use for sensitive training environments, untrusted artifact analysis, production inference, multi-tenant clusters, or incident remediation.

## Inputs
Network topology, service dependencies, DNS/proxy design, storage endpoints, model hubs, telemetry destinations, and workload identities.

## Preconditions
Inventory required network flows and emergency access procedures.

## Context to inspect
Inspect cluster namespaces, security groups/firewalls, service mesh, proxies, private endpoints, DNS, metadata services, notebook access, and artifact downloads.

## Core knowledge
ML workloads often require large external downloads and broad storage access, which can normalize dangerous egress. Network controls should complement identity controls; IP allowlists alone are weak when shared infrastructure or dynamic endpoints are involved.

## Procedure
1. Map required ingress and egress per workload class.
2. Separate development, training, artifact analysis, and production serving zones.
3. Deny unsolicited ingress by default.
4. Restrict egress to required repositories, storage, telemetry, and control-plane services.
5. Protect cloud metadata/credential endpoints.
6. Use authenticated proxies or private endpoints when appropriate.
7. Isolate untrusted model/dataset inspection from sensitive networks.
8. Limit east-west access between tenants and pipeline stages.
9. Log denied and unusual flows with workload identity context.
10. Test dependency failure behavior when egress is blocked.
11. Document temporary exception workflow and expiry.

## Decision points
Use network isolation for components that cannot be sufficiently trusted at application level. Prefer identity-aware controls where destinations are dynamic. Allow direct internet access only when operational value exceeds exfiltration/supply-chain risk.

## Common failure patterns
Training nodes with unrestricted internet and sensitive data; public notebook ports; shared flat networks; permanent emergency firewall exceptions; blocking telemetry needed for incident response; trusting DNS names without transport authentication.

## Verification
Run connectivity tests for approved and denied paths, verify metadata-service protections, test an isolated untrusted workload, and confirm flow logs identify the responsible workload.

## Expected output
A documented segmentation model, enforceable flow policy, exception process, and tested connectivity matrix.

## Stop conditions
Stop if required dependencies are unknown, network changes risk isolating critical production control paths, or emergency access cannot be preserved safely.