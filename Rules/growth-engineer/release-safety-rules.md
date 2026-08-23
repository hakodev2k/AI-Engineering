# Release Safety Rules

## Purpose
Control the customer and business risk of shipping growth changes.

## Scope
Deployments, migrations, configuration, experiments, campaigns, and launch sequencing.

## MUST
- Define validation, monitoring, rollback, ownership, and stop conditions for material releases.
- Require human approval before production changes that are destructive, irreversible, security-weakening, billing-critical, or contract-breaking.
- Separate code deployment from customer exposure when staged rollout materially reduces risk.

## MUST NOT
- Continue rollout when predefined safety guardrails are breached without an explicit authorized decision.
- Perform destructive production data changes as an incidental growth release.

## SHOULD
- Prefer reversible changes and progressive exposure for uncertain high-impact behavior.

## Exceptions
Emergency mitigation may bypass normal sequencing when incident authority, evidence, rollback, and retrospective review are recorded.

## Verification
Review release checklist, approvals, deployment evidence, guardrail dashboards, rollback readiness, and post-release validation.