# Skill: Validate Resume Context

## Purpose
Determine whether a saved checkpoint can safely drive new actions.

## Inputs
Checkpoint, current-state capture, policy, repository context.

## Process
1. Validate required checkpoint/current-state fields.
2. Run `scripts/resume_integrity_gate.py`.
3. If gate passes, re-read files/tests directly relevant to the named next action.
4. Confirm task requirements have not been superseded by newer repository evidence.
5. Confirm approval-dependent actions still have current approval.
6. Resume only the named next action; do not skip directly to later stages.
7. After the first resumed mutation, run relevant verification before broadening work.
8. If gate fails, classify drift: repository, scope, task, environment, age, approval, or local diff.
9. Hand failed cases to Resume Planner for replanning or restart.

## Expected output
`safe-to-resume`, `replan-required`, or `blocked`, with evidence.

## Verification
No `safe-to-resume` result is valid without deterministic gate success and refreshed local context.

## Failure handling
Transient read failures retry max twice. Integrity mismatches do not auto-retry.

## Stop conditions
Unknown consumer changes, expired approval, unreviewed branch drift, security boundary change, or exceeded retries.
