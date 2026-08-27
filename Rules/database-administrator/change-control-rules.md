# Change Control

## Purpose
Control database changes so production risk is explicit, reviewable, and reversible.

## Scope
Schema, configuration, permissions, maintenance, topology, storage, and operational changes.

## MUST
- Production-impacting changes MUST have an owner, risk classification, implementation plan, validation criteria, and rollback or recovery plan.
- Preconditions and expected post-change state MUST be recorded before execution.
- High-risk changes MUST receive human approval and use an approved maintenance or deployment process.
- Changes MUST be tested in a representative non-production environment when practical.

## MUST NOT
- MUST NOT make undocumented production changes merely to bypass normal controls.
- MUST NOT combine unrelated high-risk changes when separation would improve diagnosis or rollback.
- MUST NOT treat successful command execution as proof of successful outcome.

## SHOULD
- Changes SHOULD be small, observable, and independently reversible.
- Automation SHOULD be preferred for repeatable operations after its failure modes are understood.

## Exceptions
Emergency exceptions require incident context, explicit authorization, captured commands/actions, and retrospective review.

## Verification
Review change records, approvals, diffs, execution logs, monitoring evidence, and rollback readiness.