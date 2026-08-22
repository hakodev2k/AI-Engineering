# Product Quality and Release Decisions

## Purpose
Make evidence-based release decisions that balance customer value, defect risk, operational readiness, deadlines, and reversibility.

## When to use
Use before material releases, migrations, risky feature flags, or when known defects create disagreement about shipping.

## Inputs
Acceptance results, defect inventory, test evidence, telemetry readiness, rollout plan, support readiness, known risks, dependencies, and rollback capability.

## Context to inspect
Inspect critical journeys, severity definitions, historical incidents, affected segments, data migration, compatibility, performance, security, accessibility, and observability.

## Core knowledge
Zero defects is rarely realistic; release quality is about residual risk against user impact and recovery capability. A known issue requires explicit acceptance, not silence.

## Procedure
1. Restate release outcome and affected users.
2. Confirm critical acceptance criteria and non-functional checks.
3. Classify open defects by impact, reach, workaround, detectability, and reversibility.
4. Validate analytics, monitoring, support, and rollback readiness.
5. Identify unknowns and whether staged exposure can reduce them.
6. Decide fix, defer with acceptance, limit rollout, or delay.
7. Record accepted risks and owners.
8. Define launch guardrails and stop thresholds.
9. Monitor release and verify real user journeys.
10. Review escaped defects and update future criteria.

## Decision points
Ship with known defects only when residual harm is tolerable and mitigation is credible. Prefer staged rollout when uncertainty is the main risk.

## Common failure patterns
Bug counts as quality, severity without customer context, deadline-driven acceptance, no rollback, and declaring release complete before production verification.

## Verification
Critical criteria pass, accepted risks are explicit, rollback and monitoring work, and post-release customer behavior is healthy.

## Expected output
A release decision with evidence, residual risks, rollout controls, and verification plan.

## Stop conditions
Do not release when critical safety, security, data integrity, compliance, or unrecoverable customer-impact criteria fail.