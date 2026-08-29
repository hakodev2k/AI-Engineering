# Trade-off and Option Analysis

## Purpose
Compare viable solution options transparently against requirements, risks, cost, and operational consequences.

## When to use
Use when multiple architectures, products, deployment patterns, or implementation approaches could satisfy the core need.

## Inputs
Requirements, candidate options, constraints, risk evidence, cost model, operational capabilities.

## Context to inspect
Architecture drivers, lock-in, migration, team skills, reliability, security, performance, support, and reversibility.

## Core knowledge
There is rarely a universally best architecture. Decision quality improves when criteria and weights are explicit and when uncertainty is separated from measured evidence.

## Procedure
1. Define the decision and viable alternatives.
2. Establish mandatory constraints.
3. Select decision criteria tied to outcomes.
4. Gather comparable evidence.
5. Evaluate benefits, drawbacks, risks, and reversibility.
6. Run sensitivity analysis on uncertain criteria.
7. Recommend an option with rationale.
8. Record conditions that would change the decision.

## Decision points
Eliminate options that violate mandatory constraints. Prefer reversible choices under high uncertainty unless irreversible commitment provides material value.

## Common failure patterns
Biased criteria, false precision, comparing unequal scopes, hiding switching costs, and presenting preference as evidence.

## Verification
Stakeholders can trace the recommendation to agreed criteria and supporting evidence.

## Expected output
A defensible option analysis and recommendation.

## Stop conditions
Stop when essential comparison evidence is unavailable or criteria conflict without an accountable decision owner.