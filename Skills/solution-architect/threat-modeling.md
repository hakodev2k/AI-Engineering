# Threat Modeling

## Purpose
Systematically discover design-level security risks before they become expensive implementation or production defects.

## When to use
Use for externally exposed systems, sensitive workflows, identity changes, new trust boundaries, integrations, and high-impact architecture changes.

## Inputs
Context/data-flow diagrams, assets, actors, trust boundaries, controls, abuse cases.

## Preconditions
Architecture is concrete enough to model flows but early enough to change.

## Context to inspect
Authentication, authorization, data stores, external calls, admin paths, secrets, queues, APIs, file handling, logging, deployment and CI/CD.

## Core knowledge
Threat modeling is risk-driven. Frameworks such as STRIDE are prompts, not substitutes for understanding assets, attacker goals, and business impact.

## Procedure
1. Identify valuable assets and attacker goals.
2. Draw relevant data flows and trust boundaries.
3. Enumerate threats per component and boundary.
4. Identify abuse/misuse cases.
5. Assess likelihood and impact.
6. Map existing controls.
7. Define mitigations for unacceptable risks.
8. Assign owners and due dates.
9. Update architecture decisions where mitigation changes design.
10. Revisit the model after material architecture changes.

## Decision points
Prioritize threats by business risk, not count. Accept residual risk only with accountable approval.

## Common failure patterns
Checklist-only exercises, modeling too late, ignoring insiders/admin paths, treating every threat equally, missing ownership of mitigations.

## Verification
High-risk threats have verified mitigations or explicit risk acceptance.

## Expected output
Threat model with prioritized risks, controls, owners, and residual-risk decisions.

## Stop conditions
Stop and escalate when severe unresolved threats conflict with launch expectations.