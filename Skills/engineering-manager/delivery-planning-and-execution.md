# Delivery Planning and Execution

## Purpose
Create credible engineering delivery plans that expose uncertainty, dependencies, quality work, and learning rather than presenting false precision.

## When to use
Use for significant features, migrations, platform work, multi-team initiatives, or commitments with material deadlines.

## Inputs
Outcome, scope, architecture constraints, dependencies, team capacity, historical throughput, risks, acceptance criteria, and operational requirements.

## Context to inspect
Review hidden work such as testing, migration, observability, security, rollout, documentation, dependency lead time, and support burden.

## Core knowledge
Plans are models that should change with evidence. Milestones based on demonstrable outcomes are more useful than percent-complete reporting. Scope, time, capacity, and quality cannot all be independently fixed.

## Procedure
1. Define outcome and acceptance conditions.
2. Decompose work into independently verifiable milestones.
3. Identify dependencies, unknowns, and critical path.
4. Estimate using historical evidence and explicit assumptions.
5. Include testing, rollout, migration, security, and operational readiness.
6. Sequence early work to reduce major uncertainty.
7. Assign clear ownership.
8. Track completed outcomes and risk changes.
9. Reforecast when evidence invalidates assumptions.
10. Negotiate scope or sequencing before sacrificing safety or quality controls.

## Decision points
Use fixed dates when external constraints are real, then make scope explicit and adjustable. Use discovery spikes when uncertainty dominates estimation.

## Common failure patterns
Optimistic single-point estimates, hidden dependency work, tracking activity instead of outcomes, late integration, treating overtime as capacity, and silently cutting tests to preserve dates.

## Verification
Verify each milestone has observable completion criteria, major risks have mitigation or contingency, dependencies have owners, and forecasts reflect current evidence.

## Expected output
An executable delivery plan with milestones, ownership, dependencies, assumptions, risks, and forecast ranges.

## Stop conditions
Escalate when commitments require knowingly unsafe shortcuts, critical dependencies have no owner, or scope and deadline constraints are mutually infeasible.