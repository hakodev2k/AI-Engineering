# Technical Planning and Trade-offs

## Purpose
Turn frontend requirements into an evidence-based implementation plan that exposes assumptions, dependencies, risks, alternatives, rollout, and verification before expensive work begins.

## When to use
Use for major features, cross-team integrations, migrations, risky refactors, performance work, or ambiguous technical approaches.

## Inputs
Requirements, designs, repository context, API contracts, non-functional requirements, delivery constraints, telemetry, and team capabilities.

## Context to inspect
Existing architecture, similar features, dependencies, browser support, design system, backend readiness, deployment model, test strategy, and known technical debt.

## Core knowledge
Senior planning reduces uncertainty rather than pretending it does not exist. Evaluate alternatives against user value, complexity, reversibility, operational risk, performance, accessibility, security, and maintenance—not novelty.

## Procedure
1. Define the outcome and acceptance evidence.
2. Inspect existing implementation patterns before proposing new ones.
3. List assumptions and unresolved questions.
4. Identify affected boundaries and dependencies.
5. Generate viable alternatives, including the smallest-change option.
6. Compare trade-offs and failure modes.
7. Choose an approach and record why rejected alternatives lose.
8. Break work into independently verifiable slices.
9. Define tests, telemetry, rollout, migration, and rollback.
10. Reassess the plan when new evidence invalidates assumptions.

## Decision points
Prefer reversible decisions under uncertainty. Invest in abstraction when multiple known use cases and change patterns justify it. Choose incremental migration when production risk dominates implementation convenience.

## Common failure patterns
Planning from assumptions without reading code, solution-first estimates, hidden cross-team dependencies, ignoring accessibility/security/performance until review, and treating estimates as certainty.

## Verification
The plan maps requirements to implementation and evidence, dependencies have owners, high risks have mitigations, and each delivery slice has a clear completion test.

## Expected output
A concise technical plan with selected approach, alternatives, trade-offs, risks, dependencies, rollout, and verification.

## Stop conditions
Stop when critical requirements or dependencies are unknown, a security/privacy decision lacks authority, or estimates would be misleading without a discovery spike.