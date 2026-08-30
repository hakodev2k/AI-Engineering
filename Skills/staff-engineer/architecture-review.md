# Architecture Review

## Purpose
Evaluate significant architecture proposals for correctness, maintainability, operability, scalability, security, and organizational fit before expensive commitments are made.

## When to use
Use for new platforms, major service boundaries, storage changes, critical integrations, high-scale paths, or cross-team architectural changes. Do not use as a ceremonial approval gate for low-risk local changes.

## Inputs
Proposal, requirements, NFRs, diagrams, data flows, interfaces, rollout plan, risk assumptions, expected load, cost model.

## Preconditions
The proposal has a clear problem statement and named decision owner.

## Context to inspect
Existing architecture, dependency graph, production constraints, incident history, operational ownership, security boundaries, data classification, and relevant ADRs.

## Core knowledge
Good review separates requirements from implementation preferences. Evaluate failure modes, coupling, reversibility, operational burden, migration risk, and whether complexity is justified.

## Procedure
1. Restate the problem and success criteria.
2. Verify functional and non-functional requirements.
3. Inspect boundaries, dependencies, and data ownership.
4. Walk critical request and failure paths.
5. Evaluate scalability, consistency, availability, security, and cost trade-offs.
6. Check operability: deployment, rollback, observability, incident response, and ownership.
7. Identify hidden coupling and migration constraints.
8. Compare at least one credible alternative.
9. Classify findings as blocking, important, or optional.
10. Record accepted trade-offs and follow-up actions.

## Decision points
Block only when risk is material and evidence supports the concern. Prefer simpler designs when additional complexity does not buy measurable capability.

## Common failure patterns
Reviewing syntax instead of architecture, vague scalability claims, ignoring ownership, designing only the happy path, over-indexing on personal preference, and failing to document accepted risks.

## Verification
Confirm blocking findings are resolved or explicitly accepted by accountable owners and that the final design remains internally consistent.

## Expected output
A review record containing validated assumptions, risks, decisions, required changes, and follow-ups.

## Stop conditions
Stop when requirements are missing, ownership is unclear, or the decision involves security/compliance authority not represented in the review.