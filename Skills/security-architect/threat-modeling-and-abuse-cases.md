# Threat Modeling and Abuse Cases

## Purpose
Identify realistic attack paths, abuse cases, trust failures, and control gaps before they become production vulnerabilities.

## When to use
Use for new systems, sensitive features, major integrations, architecture changes, and incident-driven redesigns.

## Inputs
Architecture diagrams, data flows, identities, assets, APIs, trust boundaries, threat intelligence, deployment topology, business impact.

## Preconditions
The system scope and primary data flows are known well enough to reason about attacker movement.

## Context to inspect
Authentication paths, privileged workflows, administrative planes, external interfaces, secrets, dependencies, tenancy model, and recovery mechanisms.

## Core knowledge
Effective threat modeling combines asset impact, attacker goals, entry points, privilege transitions, and feasible mitigations. Frameworks such as STRIDE are aids, not substitutes for system-specific reasoning.

## Procedure
1. Define assets and unacceptable outcomes.
2. Map entry points, trust boundaries, identities, and privilege levels.
3. Enumerate attacker goals and realistic abuse cases.
4. Trace attack paths across components and dependencies.
5. Rank threats by likelihood, exploitability, and business impact.
6. Identify preventive, detective, and recovery controls.
7. Validate whether controls break the attack chain.
8. Record unresolved risks, assumptions, and owners.
9. Revisit the model when architecture materially changes.

## Decision points
Prioritize attack paths that cross trust boundaries or reach high-impact assets. Accept residual risk only when explicit ownership and business rationale exist.

## Common failure patterns
Diagram-only exercises, generic threat lists, ignoring insider or tenant-to-tenant abuse, missing operational controls, and treating mitigations as complete without validation.

## Verification
Walk representative abuse paths end to end and confirm each high-risk path is blocked, detected, contained, or explicitly accepted.

## Expected output
A threat model with prioritized abuse cases, attack paths, mitigations, residual risks, and review triggers.

## Stop conditions
Stop when critical architecture details are unavailable, ownership is unclear, or a high-severity unresolved threat requires executive or security approval.