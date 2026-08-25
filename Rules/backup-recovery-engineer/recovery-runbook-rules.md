# Recovery Runbooks

## Purpose
Make recovery executable under pressure by people other than the original implementer.

## Scope
Restore procedures, prerequisites, sequencing, validation, escalation, rollback, and handoff.

## MUST
- Runbooks MUST state prerequisites, required access, restore-point selection, ordered steps, validation, failure handling, and escalation.
- Commands or actions with destructive effects MUST be clearly identified and require appropriate approval.
- Runbooks MUST identify dependencies that may be unavailable during the target failure scenario.
- Material procedure changes MUST be validated through testing.

## MUST NOT
- MUST NOT embed live secrets in runbooks.
- MUST NOT depend on undocumented tribal knowledge for critical recovery.
- MUST NOT mark a runbook current when referenced tools, paths, roles, or dependencies are obsolete.

## SHOULD
- Runbooks SHOULD include expected durations, decision checkpoints, and safe stopping points.
- Automation SHOULD be idempotent or explicitly document non-repeatable steps.

## Exceptions
Temporary manual procedures require owner, risk note, validation evidence, and replacement/review date.

## Verification
Perform tabletop or hands-on execution by an independent operator; inspect references, permissions, commands, validation criteria, and revision history.