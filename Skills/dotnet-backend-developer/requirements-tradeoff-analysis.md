# Requirements and Trade-off Analysis

## Purpose
Translate ambiguous backend requirements into implementable technical decisions with explicit assumptions, NFRs, risks, and alternatives.

## When to use
New features, architecture choices, uncertain requirements, cross-system integrations, estimates.

## Inputs
Business objective, stakeholders, constraints, current system, SLAs/NFRs, deadlines.

## Context to inspect
Existing behavior, dependent consumers, data/security constraints, operational limits, historical incidents, roadmap.

## Core knowledge
Good engineering optimizes for the actual constraint set. Functional behavior, latency, availability, consistency, security, cost, operability, and delivery time can conflict.

## Procedure
1. Restate the business outcome.
2. Identify actors and acceptance criteria.
3. Surface assumptions and unknowns.
4. Capture relevant NFRs quantitatively when possible.
5. Identify affected boundaries and dependencies.
6. Generate at least two viable approaches for non-trivial decisions.
7. Compare complexity, risk, cost, performance, security, operability, reversibility.
8. Recommend one option with rationale.
9. Record unresolved risks and validation steps.

## Decision points
Prefer reversible/simple choices under uncertainty; spend complexity only where requirements demand it.

## Common failure patterns
Designing before clarifying outcome, treating all NFRs as maximum, hidden assumptions, ignoring migration/operations, estimates without risk ranges.

## Verification
Stakeholders can validate assumptions/acceptance criteria and technical reviewers can trace recommendation to constraints.

## Expected output
A concise decision-ready technical plan with trade-offs.

## Stop conditions
Stop when a critical business or regulatory requirement remains unresolved.