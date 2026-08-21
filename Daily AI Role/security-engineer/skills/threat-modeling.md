# Skill: Threat Modeling

## Purpose
Turn a system or change into explicit assets, trust boundaries, abuse cases, attack paths, and prioritized mitigations.

## Trigger
New system, material architecture change, external integration, privileged workflow, sensitive-data flow, or high-risk feature.

## Inputs
Architecture/data-flow description, actors, assets, APIs, identities, dependencies, deployment model, data classification, existing controls.

## Preconditions
Scope owner known; system boundary identifiable; missing information marked as assumption rather than guessed.

## Procedure
1. Define objective and scope.
2. Inventory assets and security properties: confidentiality, integrity, availability, authenticity, accountability.
3. Map actors, entry points, components, data flows, and trust boundaries.
4. Enumerate abuse cases and plausible attacker goals.
5. Derive attack paths across boundaries.
6. Score each path by exposure, feasibility, impact, prerequisites, and existing controls.
7. Assign preventive, detective, responsive, or recovery controls.
8. Identify residual risk and decision owner.
9. Send identity-heavy paths to cloud-identity-reviewer and implementation-sensitive paths to code-security-reviewer in parallel.
10. Consolidate and verify that every critical/high path has an owner and disposition.

## Decisions
Prefer mitigations that remove entire attack classes over one-off checks. If evidence is insufficient, classify as unknown and request targeted evidence.

## Constraints
No invented architecture, no unsupported compliance claims, no destructive validation.

## Outputs
Threat model, prioritized attack paths, control plan, residual risks, assumptions, open questions.

## Quality and verification
Every high-risk threat must map to an asset, boundary, attack path, control, owner, and verification method.

## Failure handling
After two clarification/review cycles, escalate unresolved high-risk uncertainty.

## Stop condition
All critical/high threats are mitigated, accepted by authorized owner, or explicitly escalated.