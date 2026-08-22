# Architecture Decision Records

## Purpose
Capture important architecture decisions with enough context and rationale for future engineers to understand, challenge, and evolve them.

## When to use
Use for decisions that materially affect system structure, dependencies, data, security, operations, or long-term cost.

## Inputs
Problem statement, constraints, alternatives, evidence, stakeholders, risks, selected option.

## Context to inspect
Existing ADRs, architecture principles, NFRs, dependency landscape, previous decisions, implementation constraints.

## Core knowledge
An ADR records why a decision was made, not just what was chosen. Decisions should be immutable historical records; superseding decisions reference earlier ones rather than rewriting history.

## Procedure
1. State the decision context and problem.
2. Record relevant constraints and quality attributes.
3. List realistic alternatives considered.
4. Compare alternatives using explicit trade-offs.
5. State the chosen option and rationale.
6. Record consequences, risks, and follow-up actions.
7. Identify decision owner and status.
8. Link implementation evidence or related ADRs.
9. Supersede rather than silently edit when the decision changes materially.

## Decision points
Create an ADR when the cost of forgetting rationale exceeds the documentation cost. Avoid ADRs for trivial implementation choices that are obvious from code.

## Common failure patterns
Recording only the final choice, retrofitting rationale after implementation, hiding rejected alternatives, treating ADRs as approval theater, and editing history without traceability.

## Verification
A reviewer unfamiliar with the decision can explain the context, alternatives, rationale, consequences, and current status from the ADR alone.

## Expected output
A concise, traceable architecture decision record with explicit trade-offs and consequences.

## Stop conditions
Stop when the decision owner, critical evidence, or material alternatives are missing.