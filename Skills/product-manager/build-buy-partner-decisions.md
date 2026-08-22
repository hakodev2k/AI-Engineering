# Build Buy Partner Decisions

## Purpose
Choose whether a product capability should be built internally, purchased, or delivered through a partner based on differentiation, economics, control, risk, and time.

## When to use
Use for commodity capabilities, infrastructure dependencies, external APIs, specialized compliance services, and major platform choices.

## Inputs
Required outcomes, strategic importance, vendor options, internal capabilities, total costs, integration constraints, security needs, roadmap, and exit requirements.

## Context to inspect
Inspect switching costs, data portability, SLAs, pricing model, roadmap dependency, customization, operational ownership, vendor health, and contract constraints.

## Core knowledge
Build is justified by strategic differentiation or control needs, not engineering preference. Buying trades implementation speed for dependency and switching risk.

## Procedure
1. Define the capability and required outcomes independent of solution.
2. Determine whether it differentiates the product.
3. Establish non-negotiable functional and non-functional requirements.
4. Estimate internal build and lifecycle cost.
5. Evaluate vendor/partner fit, economics, reliability, security, and roadmap.
6. Model integration and switching costs.
7. Identify lock-in and exit strategy.
8. Compare time-to-value and opportunity cost.
9. Run proof of concept for critical unknowns.
10. Document decision and revisit triggers.

## Decision points
Build when differentiation, control, or unique constraints justify ownership. Buy when capability is mature and commodity. Partner when distribution, data, or complementary capabilities create mutual leverage.

## Common failure patterns
Comparing license fee with build cost only, ignoring maintenance, choosing vendors on demos, and accepting lock-in without an exit plan.

## Verification
Alternatives use comparable total-cost horizons; critical requirements are tested; security/legal/engineering reviews are complete.

## Expected output
A build-buy-partner recommendation with evidence, economics, risks, integration plan, and exit conditions.

## Stop conditions
Stop when vendor diligence, legal terms, or technical feasibility cannot be adequately assessed.