# Build vs Buy Evaluation

## Purpose
Evaluate whether a capability should be built internally, adopted from open source, or purchased from a vendor using total cost, strategic value, risk, and operating constraints.

## When to use
Use before major platform investments, vendor commitments, or custom implementations of non-core capabilities.

## Inputs
Requirements, strategic importance, vendor options, licensing, integration needs, security constraints, staffing, expected scale, switching cost.

## Preconditions
The capability and acceptance criteria are clearly defined enough for comparison.

## Context to inspect
Existing internal capabilities, procurement constraints, vendor architecture, APIs, data residency, support model, roadmap fit, exit options, and operational ownership.

## Core knowledge
The comparison must include lifecycle cost, not just purchase price or implementation time. Consider differentiation, lock-in, extensibility, reliability, security, compliance, staffing, and migration/exit cost.

## Procedure
1. Define required outcomes and non-negotiable constraints.
2. Determine whether the capability is strategically differentiating.
3. Identify credible build, open-source, and vendor alternatives.
4. Compare functional fit and integration complexity.
5. Evaluate security, reliability, compliance, and support.
6. Estimate multi-year total cost of ownership.
7. Assess lock-in, data portability, and exit cost.
8. Run a focused proof of concept for uncertain high-impact assumptions.
9. Document recommendation, risks, and fallback plan.

## Decision points
Build when differentiation or control materially matters and ownership is sustainable. Buy when the capability is commodity and vendor fit is strong. Prefer open source only when the organization can own operations and security responsibly.

## Common failure patterns
Comparing license price to engineering salary only, ignoring integration and migration costs, vendor demos treated as production evidence, and no exit strategy.

## Verification
Validate critical requirements through evidence or proof of concept and confirm TCO assumptions with finance, operations, security, and owning teams.

## Expected output
A decision matrix and recommendation with TCO, risks, strategic fit, and exit considerations.

## Stop conditions
Stop when procurement, legal, security, or data-handling constraints require specialist approval before a viable decision can be made.