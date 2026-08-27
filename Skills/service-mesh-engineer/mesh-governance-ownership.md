# Mesh Governance and Ownership

## Purpose
Define platform/service-team responsibilities and safe self-service boundaries for mesh configuration.

## When to use
Use when scaling mesh adoption across teams or resolving ownership and change-control ambiguity.

## Inputs
Organization model, tenancy, compliance requirements, platform APIs, incident responsibilities and deployment workflow.

## Context to inspect
RBAC, GitOps repositories, namespaces, policy resources, exception processes, support model and audit requirements.

## Core knowledge
Centralized mesh power without ownership creates bottlenecks; unrestricted self-service creates shared-risk configuration. Governance should distinguish platform invariants from application-specific traffic intent.

## Procedure
1. Classify configuration by blast radius and expertise required.
2. Assign ownership for control plane, gateways, identity, routing and service policy.
3. Define safe self-service APIs and defaults.
4. Enforce high-confidence invariants automatically.
5. Establish review for high-risk/global changes.
6. Define exception owner, reason and expiry.
7. Publish support and incident escalation paths.
8. Audit privileged changes and policy drift.
9. Review governance after incidents and platform changes.

## Decision points
Centralize trust roots and global invariants; delegate service-local intent where isolation and validation are strong. Prefer automation over manual approval for deterministic rules.

## Common failure patterns
No clear owner, platform team approving every route, global admin for service teams, undocumented exceptions and policy that cannot be tested.

## Verification
Run ownership scenarios, confirm least-privilege RBAC, test exception expiry and audit traceability.

## Expected output
A responsibility model, change classes and enforceable governance controls.

## Stop conditions
Escalate unresolved ownership for trust roots, global gateways or emergency changes.