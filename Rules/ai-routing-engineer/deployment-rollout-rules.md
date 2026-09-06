# Deployment and Rollout Rules

## Purpose
Change routing behavior progressively with measurable blast radius and rapid rollback.

## Scope
Configuration deployment, canaries, staged rollout, health gates, rollback, and route migrations.

## MUST
- Production routing changes MUST be versioned and deployed through an auditable change mechanism.
- High-impact changes MUST use progressive exposure unless an approved emergency path applies.
- Rollout gates MUST include relevant error, latency, quality, safety, and cost signals.
- Every material route change MUST have a rollback or safe-disable strategy before deployment.
- Rollout decisions MUST use current evidence from the affected traffic segment.

## MUST NOT
- MUST NOT expand a rollout while mandatory guardrails are failing.
- MUST NOT combine unrelated high-risk changes when doing so prevents clear attribution or rollback.
- MUST NOT delete the previous safe route before migration is verified.

## SHOULD
- Separate configuration rollout from model/provider onboarding where possible.
- Use automated halt criteria for deterministic guardrails.

## Exceptions
Emergency rollouts require incident authority, bounded blast radius, audit trail, and post-change review.

## Verification
Inspect deployment history, canary metrics, guardrail evaluation, rollback tests, and configuration diffs.