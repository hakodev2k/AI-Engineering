# Network Threat Modeling

## Purpose
Identify realistic network attack paths and select controls based on assets, trust boundaries, adversary capabilities, and operational constraints.

## When to use
Use before architecture changes, new external connectivity, cloud migration, sensitive-service deployment, or security review.

## Inputs
Architecture, assets, data flows, identities, trust boundaries, threat intelligence, business impact.

## Context to inspect
Ingress/egress, admin paths, remote access, third parties, routing, DNS, identity, cloud connectivity, control dependencies.

## Core knowledge
Attack paths, trust assumptions, STRIDE-style reasoning where useful, lateral movement, control bypass, dependency compromise, likelihood vs impact.

## Procedure
1. Define scope and critical assets.
2. Draw data and control flows.
3. Mark trust boundaries and privileged paths.
4. Enumerate plausible adversary entry points.
5. Trace lateral and escalation paths.
6. Map preventive, detective, and recovery controls.
7. Rank gaps by plausible impact and exploitability.
8. Define mitigations and verification tests.

## Decision points
Prioritize paths that combine realistic access with high impact rather than exhaustive theoretical threats. Accept risk only with explicit owner and rationale.

## Common failure patterns
Checklist-only modeling, ignoring management planes, assuming internal networks are trusted, no business impact context, controls without validation.

## Verification
Review with system owners and operators, test selected attack-path assumptions safely, and confirm mitigations break or detect paths.

## Expected output
Threat model, prioritized attack paths, control gaps, mitigations, residual risks.

## Stop conditions
Escalate when architecture evidence is insufficient, critical ownership is missing, or testing would exceed authorization.