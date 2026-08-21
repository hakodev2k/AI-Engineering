# Workflow: Pipeline Change

## Trigger
New or modified CI/CD behavior.

## Goal
Deliver a safe, reviewable pipeline change without degrading required controls.

## Inputs
Task contract, repository, current workflow, target behavior, quality policy, validation commands.

## Preconditions
Scope and target branch/environment are known.

## Stages
1. **Intake — final owner:** classify impact, deadline, dependencies, risk, permissions.
2. **Explore — incident/repository investigation:** inspect current workflow and failure history read-only.
3. **Plan — final owner:** define files, stages, dependencies, validation, rollback of workflow change.
4. **Implement — pipeline implementer:** make scoped changes.
5. **Focused validation — implementer:** syntax/lint/build/test or dry-run as available.
6. **Independent review — change-risk reviewer:** security, determinism, secret hygiene, permissions, artifact behavior, concurrency.
7. **Correction loop — implementer:** at most 2 review/fix cycles unless config lowers the limit.
8. **Fresh verification — verification agent:** re-run required gates.
9. **Handoff — final owner:** evidence, residual risk, next action.

## Parallelism
Read-only log/history review and policy/security review may run concurrently after scope is stable. Implementation of the same workflow file is single-owner.

## Checkpoints
Plan approved for high-risk change; focused checks green; independent review complete; verification complete.

## Failure/retry
Transient external checks may retry within configured bound. Deterministic failures require a change, not rerun.

## Definition of Done
Required workflow behavior is demonstrated, no required gate is silently lost, permissions/secrets are safe, fresh verification passes, and handoff records residual risk.