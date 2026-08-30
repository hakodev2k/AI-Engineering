# Requirements Traceability

## Purpose
Maintain explicit links from stakeholder and system requirements to formal assumptions, models, properties, proofs, tests, and implementation obligations.

## When to use
Use in regulated, safety-critical, security-sensitive, or long-lived systems where formal evidence must remain understandable as requirements evolve.

## Inputs
Requirements, hazard/security analyses, specifications, theorem/property identifiers, test artifacts, code modules, and release criteria.

## Preconditions
Requirements need stable identifiers or another durable referencing scheme.

## Context to inspect
Changed requirements, derived requirements, assumptions, proof dependencies, implementation ownership, test coverage, and unresolved verification debt.

## Core knowledge
Traceability is bidirectional: every important requirement should map to evidence, and every formal claim should map back to an intended requirement or risk. Traceability does not itself establish correctness; it establishes coverage and change impact.

## Procedure
1. Normalize requirement identifiers and versions.
2. Classify each requirement by assurance relevance.
3. Map requirements to formal properties and assumptions.
4. Map formal properties to proof/model-check evidence.
5. Link implementation obligations and executable tests where applicable.
6. Record derived requirements introduced by verification.
7. Identify requirements with no evidence and formal claims with no requirement.
8. Recompute impact when requirements, definitions, or assumptions change.
9. Review traceability before release and assurance sign-off.
10. Keep links machine-readable where practical.

## Decision points
Use fine-grained trace links for high-risk claims; aggregate low-risk supporting requirements when individual linking adds maintenance cost without assurance value.

## Common failure patterns
One-way traceability, stale links, tracing to filenames instead of stable artifacts, untracked derived requirements, and treating presence of a link as evidence quality.

## Verification
Sample links end-to-end, validate identifiers automatically, detect orphan requirements/properties, and confirm changed requirements invalidate dependent evidence as expected.

## Expected output
A current traceability matrix or graph connecting requirements, formal evidence, implementation obligations, and residual gaps.

## Stop conditions
Stop assurance sign-off when critical requirements lack evidence, formal claims lack provenance, or change impact cannot be established reliably.