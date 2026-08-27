# Mesh Migration and Adoption

## Purpose
Migrate workloads into or out of a service mesh incrementally without hidden dependencies or irreversible coupling.

## When to use
Use for initial adoption, mesh replacement, sidecar-to-ambient migration or decommissioning.

## Inputs
Workload inventory, protocols, SLOs, dependencies, security posture, rollout capacity and ownership.

## Context to inspect
Injection labels, network policies, health checks, startup order, ports, gateways, certificates, client retries and telemetry.

## Core knowledge
Migration changes request paths, identity and operational ownership. Mixed meshed/unmeshed states must be designed explicitly rather than treated as temporary accidents.

## Procedure
1. Segment workloads by risk and protocol compatibility.
2. Define measurable adoption outcomes and non-goals.
3. Document mixed-mode connectivity and security.
4. Pilot low-risk representative services.
5. Compare latency, errors, resources and operational burden.
6. Migrate bounded cohorts.
7. Enforce stricter identity/policy only after dependency evidence.
8. Train service owners on troubleshooting.
9. Remove legacy paths after an observation window.
10. For exit migrations, prove equivalent security/telemetry before mesh removal.

## Decision points
Adopt mesh features gradually; avoid using advanced routing/policy until basic connectivity and identity are stable. Stop adoption if measurable value does not justify complexity.

## Common failure patterns
Big-bang injection, no mixed-mode plan, health-check breakage, hidden plaintext dependencies and irreversible reliance on mesh-specific semantics.

## Verification
Test representative traffic before/after, rollback cohorts and confirm security/SLO parity.

## Expected output
A staged migration plan with gates, ownership and exit criteria.

## Stop conditions
Stop when critical protocols are unsupported, rollback is unavailable or baseline behavior is not measurable.