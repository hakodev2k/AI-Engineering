# Dependency and Failure-Domain Mapping

## Purpose
Expose hidden single points of failure and correlated dependencies across AI infrastructure, providers, data, tools, and control planes.

## When to use
Use during architecture review, launch readiness, incident follow-up, provider consolidation, or regional expansion.

## Inputs
System architecture, provider inventory, deployment topology, network paths, data stores, model gateways, tool dependencies, operational ownership.

## Preconditions
Major runtime and control-plane dependencies can be enumerated.

## Context to inspect
Regions, accounts, clusters, DNS, identity, secrets, model providers, vector stores, queues, observability, feature flags, CI/CD, artifact registries.

## Core knowledge
Nominally redundant components may share a hidden failure domain such as one cloud account, identity provider, region, quota pool, DNS zone, model vendor, or control plane. Reliability analysis must include correlated failures.

## Procedure
1. Trace each critical user journey end to end.
2. List direct and transitive dependencies.
3. Mark shared regions, accounts, networks, quotas, and providers.
4. Distinguish data plane from control plane dependencies.
5. Identify components whose failure blocks recovery itself.
6. Classify failure domains and expected blast radius.
7. Compare redundancy claims against true independence.
8. Add mitigation or documented risk acceptance for critical concentration.
9. Validate assumptions with drills or provider documentation.
10. Update the map after material architecture changes.

## Decision points
Add redundancy when failure probability multiplied by impact justifies cost and complexity. Avoid superficial multi-region designs that still share critical control planes.

## Common failure patterns
Ignoring identity/DNS, assuming multiple models mean multiple providers, shared quota pools, one global config store, and backup systems that depend on the failed primary plane.

## Verification
A reviewer can trace every critical journey and identify how each major failure domain is detected, contained, and recovered.

## Expected output
A dependency map, correlated-failure analysis, critical single points, mitigations, and accepted risks.

## Stop conditions
Escalate when critical dependency ownership or topology cannot be established.