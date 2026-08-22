# Lifecycle Hooks

## Before task start
- **Trigger:** task accepted.
- **Preconditions:** task contract file exists when structured intake is used.
- **Action:** run `python scripts/validate-package.py --task <task.json>`.
- **Expected:** schema-critical fields and safe role boundaries pass.
- **Failure:** block execution until corrected.

## After planning
- **Trigger:** risk/scenario plan completed.
- **Action:** check that critical acceptance criteria have a verification method, dependencies/approvals are visible, and destructive operations are identified.
- **Expected:** executable plan.
- **Failure:** block implementation for critical omissions.

## Before implementation
- **Trigger:** automation code edit is about to start.
- **Action:** confirm repository conventions, test layer, data isolation, environment, and expected command.
- **Failure:** unresolved shared-state or environment risk blocks parallel execution.

## After implementation
- **Trigger:** code/fixture changes complete.
- **Action:** run `pwsh scripts/run-quality-gates.ps1 -Mode Focused` from package root or adapt its documented commands to the target repository.
- **Expected:** syntax/static checks and focused tests pass.
- **Failure:** block review; classify failure rather than rerun blindly.

## Before review
- **Action:** inspect diff, remove unrelated changes, collect test command/results, verify no secrets or production endpoints were added.
- **Failure:** block reviewer handoff.

## After review
- **Action:** all blocking findings must be resolved or explicitly escalated. Maximum two fix-review cycles.
- **Failure:** unresolved blocking finding prevents verification.

## Before delivery
- **Action:** Verification Agent runs required quality gates, confirms skipped/quarantined critical tests, and completes DoD checklist.
- **Failure:** completion is blocked unless a human owner explicitly accepts the documented risk.

## After failure
- **Action:** capture failure category, earliest useful evidence, last action, retry count, and next owner. Enter flaky workflow for nondeterminism.
- **Failure behavior:** repeated same-action retry is prohibited.

## Before production action
- **Action:** require explicit human approval, exact target/environment, rollback/recovery plan, and least-privilege access.
- **Expected:** approved and bounded action.
- **Failure:** hard stop.
