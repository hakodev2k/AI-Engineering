# Secure Architecture Review

## Purpose
Review system architecture for security weaknesses, unsafe trust assumptions, excessive privilege, and missing controls before implementation or release.

## When to use
Use for new systems, major redesigns, sensitive features, internet-facing services, integrations, or after meaningful security incidents.

## Inputs
Architecture diagrams, threat model, data flows, identity model, deployment topology, APIs, storage design, network controls, security requirements.

## Context to inspect
Trust boundaries, entry points, privileged paths, secrets, tenant isolation, data flows, external dependencies, failure modes, monitoring, and recovery paths.

## Core knowledge
Architecture review should focus on attack paths and trust assumptions rather than checklist compliance. Strong controls at boundaries reduce systemic risk more effectively than scattered defensive code.

## Procedure
1. Define review scope and critical assets.
2. Validate trust boundaries and data flows.
3. Inspect authentication and authorization architecture.
4. Review privilege separation and service identities.
5. Check secrets, cryptography, and key-management assumptions.
6. Review network exposure and dependency trust.
7. Validate multi-tenant and sensitive-data isolation.
8. Check failure, fallback, and recovery behavior for security regressions.
9. Map findings to concrete remediations and owners.
10. Record residual risks and required approvals.

## Decision points
Prefer eliminating unsafe trust assumptions over adding monitoring around them. Accept compensating controls only when equivalent risk reduction can be demonstrated.

## Common failure patterns
Checklist-only reviews, assuming internal equals trusted, missing authorization at resource boundaries, shared credentials, undocumented bypass paths, and ignoring operational recovery.

## Verification
High-severity findings have remediation evidence or approved risk acceptance, and representative attack paths have been tested or otherwise validated.

## Expected output
A prioritized architecture security review with findings, evidence, remediation guidance, ownership, and residual risk.

## Stop conditions
Stop when critical diagrams, identity flows, or system scope are missing, or when remediation requires approval outside the reviewer’s authority.