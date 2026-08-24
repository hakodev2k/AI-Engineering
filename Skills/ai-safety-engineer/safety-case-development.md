# Safety Case Development

## Purpose
Build a structured, evidence-backed argument that a system is acceptably safe for a defined deployment context.

## When to use
Use for high-risk launches, major capability expansions, governance reviews, or regulated environments.

## Inputs
Safety requirements, threat models, evals, incidents, architecture controls, monitoring plans, residual risks.

## Context to inspect
Deployment scope, assumptions, evidence freshness, control dependencies, operational ownership, and uncertainty.

## Core knowledge
A safety case is not a claim that a system is universally safe. It is a bounded argument linking claims to evidence and assumptions for a specific context.

## Procedure
1. Define the top-level safety claim and deployment scope.
2. Decompose it into subclaims about hazards and controls.
3. Link each subclaim to independent evidence.
4. Record assumptions and environmental dependencies.
5. Identify defeaters and contradictory evidence.
6. Quantify or characterize uncertainty.
7. Document residual risks and accountable acceptance.
8. Define conditions that invalidate the case.
9. Review with independent stakeholders.

## Decision points
Reject weak evidence for high-consequence claims. Use multiple evidence types when one benchmark can be gamed or is incomplete.

## Common failure patterns
Circular evidence; cherry-picked evals; hidden assumptions; stale results; treating absence of incidents as proof of safety.

## Verification
Audit every claim-to-evidence link and test whether the case remains valid under realistic changed assumptions.

## Expected output
A reviewable safety case with claims, evidence, assumptions, uncertainty, residual risks, and invalidation triggers.

## Stop conditions
Stop approval when critical claims lack credible evidence or known defeaters remain unresolved.