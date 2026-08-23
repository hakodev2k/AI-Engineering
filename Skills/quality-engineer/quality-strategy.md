# Quality Strategy

## Purpose
Create a risk-based quality strategy that aligns engineering effort with product, customer, regulatory, and operational risk.

## When to use
Use for new products, major releases, quality resets, or recurring escaped defects.

## Inputs
Requirements, architecture, incident history, usage patterns, SLAs, compliance constraints, delivery plan.

## Context to inspect
Review critical user journeys, failure impact, dependencies, environments, current tests, defect trends, and release process.

## Core knowledge
Quality is broader than testing. Balance prevention, detection, observability, recoverability, and feedback speed. Test depth should follow risk rather than uniform coverage targets.

## Procedure
1. Define quality objectives and measurable outcomes.
2. Identify critical journeys and failure modes.
3. Rank risks by likelihood and impact.
4. Map risks to preventive and detective controls.
5. Define test levels and ownership.
6. Define environment and test-data needs.
7. Establish release gates and exceptions.
8. Define production quality signals.
9. Assign owners and review cadence.
10. Reassess after incidents and architecture changes.

## Decision points
Automate stable repeatable checks; retain exploratory testing for uncertainty. Prefer lower-level tests when they provide equivalent confidence faster.

## Common failure patterns
Coverage-percentage goals without risk context, excessive E2E dependence, unclear ownership, production excluded from quality strategy, and gates that teams routinely bypass.

## Verification
Trace high risks to controls and evidence; confirm metrics, owners, gates, and escalation paths are actionable.

## Expected output
A prioritized quality strategy with controls, evidence requirements, metrics, and ownership.

## Stop conditions
Escalate when critical requirements, risk owners, or production constraints cannot be established.