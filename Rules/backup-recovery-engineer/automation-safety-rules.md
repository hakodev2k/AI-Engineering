# Automation Safety

## Purpose
Use automation to improve repeatability without amplifying destructive mistakes.

## Scope
Backup orchestration, restore automation, policy assignment, cleanup, failover, and infrastructure automation.

## MUST
- Automation MUST validate target identity, scope, prerequisites, and intended restore point before destructive or state-replacing actions.
- High-risk execution MUST require explicit authorization appropriate to environment and impact.
- Automation MUST emit auditable results and fail visibly on unmet safety conditions.
- Repeated operations MUST be idempotent where practical or clearly guard non-repeatable steps.

## MUST NOT
- MUST NOT default destructive actions to production targets.
- MUST NOT automatically weaken retention, immutability, encryption, or access controls to recover from errors.
- MUST NOT continue after ambiguous target selection.

## SHOULD
- Dry-run, preview, and staged validation SHOULD be provided for consequential changes.
- Recovery automation SHOULD support checkpoints and resumability.

## Exceptions
Emergency bypasses require authorized human approval, bounded scope, audit evidence, and retrospective review.

## Verification
Review scripts/configuration, guardrails, permission boundaries, dry-run behavior, test results, failure paths, logs, and production approval controls.