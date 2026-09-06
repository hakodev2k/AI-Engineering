# AI Use-Case Qualification

## Purpose
Determine whether a proposed AI use case is valuable, feasible, operable, and safe enough to justify investment.

## When to use
Use during intake, portfolio planning, or before a pilot. Do not assume AI is the preferred solution merely because a task contains text, data, or repetitive work.

## Inputs
Business objective, current workflow, users, task volume, data sources, quality expectations, risk level, latency needs, cost constraints, and existing alternatives.

## Context to inspect
Inspect the current process, failure costs, decision rights, automation opportunities, data availability, integration boundaries, regulatory constraints, and baseline performance.

## Core knowledge
Strong AI candidates have measurable value, sufficient input context, tolerable uncertainty, recoverable failure modes, and a viable operating model. Deterministic automation is often better when rules are stable and correctness must be exact.

## Procedure
1. State the business outcome and current baseline.
2. Decompose the workflow into tasks and decisions.
3. Identify where probabilistic AI adds value versus deterministic software.
4. Define minimum acceptable quality, latency, cost, and safety.
5. Assess data/context availability and permissions.
6. Identify failure modes and downstream consequences.
7. Estimate human review or fallback requirements.
8. Compare AI with non-AI alternatives.
9. Define pilot success criteria and evidence needed.
10. Classify the use case as proceed, revise, defer, or reject.

## Decision points
Prefer AI where ambiguity, synthesis, classification, generation, or natural-language interaction creates material value. Prefer rules, search, or conventional software where outputs must be exact and the domain is well specified.

## Common failure patterns
Starting from a model instead of a problem, ignoring baseline cost, selecting irreversible high-risk actions, assuming data access, and treating demo quality as production readiness.

## Verification
A reviewer can trace the recommendation to explicit value, feasibility, risk, and operating assumptions, with measurable pilot criteria.

## Expected output
A qualified use-case brief with recommendation, rationale, risks, dependencies, baseline, and pilot criteria.

## Stop conditions
Stop when the business owner, workflow, critical data, or acceptable failure threshold is undefined.