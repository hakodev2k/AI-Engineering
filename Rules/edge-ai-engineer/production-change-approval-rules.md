# Production Change Approval Rules

## Purpose
Keep high-risk edge AI actions within explicit human authority and preserve reversibility.

## Scope
Production rollout, model replacement, runtime upgrades, security changes, data-retention changes, and fleet-wide configuration.

## MUST
- Production execution MUST be distinguished from analysis, recommendation, and preparation.
- High-impact fleet rollout, security-control weakening, irreversible update, or sensitive data-policy change MUST require explicit human approval.
- Approved changes MUST identify artifact, scope, expected impact, verification, and rollback or recovery plan.
- Post-change verification MUST confirm the intended version and health on representative devices.

## MUST NOT
- MUST NOT silently expand deployment scope beyond the approved cohort.
- MUST NOT force through a failed release gate without documented authorized exception.
- MUST NOT rewrite change history to conceal production actions.

## SHOULD
- Prefer small, reversible, observable changes with bounded blast radius.

## Exceptions
Emergency execution requires authorized incident context, minimized scope, and post-event review.

## Verification
Inspect approvals, release records, cohort scope, deployment logs, verification evidence, and rollback readiness.