# Ambiguity and Conflict Resolution Workflow

## Trigger
Requirements conflict, expected behavior is disputed, or acceptance depends on an unstated business decision.

## Stages
1. Freeze the disputed statement; do not rewrite it into false consensus.
2. Record each interpretation with source, stakeholder, evidence, and consequence.
3. Identify the authorized decision owner.
4. Present a concise option matrix including customer/process impact, dependency impact, reversibility, risk, and deadline consequence.
5. Ask for an explicit decision.
6. Update decision record and all affected requirements/criteria.
7. Ask Acceptance Verifier to confirm the conflict is no longer encoded ambiguously.

## Stop conditions
Decision made; or task marked `blocked` with owner, requested decision, impact, and escalation date.

## Failure learning
For repeated ambiguity, record Root Cause → Lesson → Process Improvement → Future Prevention in `templates/failure-learning-record.md`.