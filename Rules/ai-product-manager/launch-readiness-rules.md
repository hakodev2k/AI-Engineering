# Launch Readiness Rules

## Purpose
Ensure AI features enter production only when product, model, safety, operational, and support conditions are ready.

## Scope
Applies to production launches, major model upgrades, material prompt or policy changes, and expanded user exposure.

## MUST
- Launch review MUST confirm product acceptance criteria, evaluation thresholds, safety checks, monitoring, rollback, support readiness, and ownership.
- Known limitations and residual risks MUST be documented before approval.
- Rollback or disable mechanisms MUST be validated before broad exposure when user harm or material business impact is possible.
- Launch authority MUST be explicit for high-risk changes.

## MUST NOT
- MUST NOT treat successful staging behavior as sufficient production evidence when scale or traffic composition materially differs.
- MUST NOT launch with missing critical telemetry or no incident owner.
- MUST NOT waive failed safety or quality gates without documented approval.

## SHOULD
- Rollouts SHOULD progress through controlled exposure stages with measurable promotion criteria.
- Customer-facing documentation SHOULD be ready before broad availability.

## Exceptions
Exceptions require an accountable approver, bounded exposure, compensating controls, rollback conditions, and follow-up deadline.

## Verification
Inspect launch checklist evidence, evaluation reports, operational dashboards, rollback tests, support materials, and approval records.