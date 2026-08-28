# Workflow: Diagnose and Verify Absent Protected Paths

## Trigger
A sandbox/permission change, platform upgrade, new protected path, or report that a protected descendant can be created under a writable root.

## Goal
Prove the protected namespace remains enforced before and after path creation without mutating the real workspace.

## Inputs
Workspace topology, policy JSON, backend/platform/version, protected-path inventory, trusted metadata consumers.

## Baseline
Record current writable roots, protected paths, existence states, and documented backend guarantees.

## Context
Keep the real workspace read-only for diagnosis. Active create attempts run only in a disposable fixture.

## Stages
1. **Observe** — inventory present/absent protected descendants and writable ancestors.
2. **Measure baseline** — run `scripts/protected_path_guard.py` with current backend capabilities.
3. **Diagnose** — identify paths whose protection depends on current existence or materialization.
4. **Form hypothesis** — state the exact namespace gap and later trusted consumer.
5. **Implement improvement** — change policy/backend so future-path denial is enforceable without creating the path, or narrow writable scope.
6. **Measure again** — rerun static guard and isolated absent/present fixture checks.
7. **Verify** — independent verifier reviews results and setup side effects.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Static guard, unit tests, backend-native sandbox test harness, filesystem inventory.

## Outputs
Before/after matrix, guard JSON, test results, risk notes, verification decision.

## Checkpoints
After baseline, before any fixture mutation, after policy change, before completion.

## Metrics
Absent-state protection coverage, present-state protection coverage, setup-mutation count, platform parity, failing paths.

## Retry policy
Maximum 2 implementation attempts. Each retry requires a changed policy/backend hypothesis.

## Stop conditions
Stop and block completion if future-path protection remains unproven, setup materializes protected metadata unexpectedly, or platform results disagree after 2 attempts.

## Failure path
Reduce writable scope or disable the affected policy/backend for the relevant workload; escalate with evidence.

## Verification
Independent reviewer reproduces tests and confirms the real workspace stayed unchanged.

## Definition of Done
Implemented, measured, and independently verified; all protected paths pass in absent and present states; no protected sentinel was created by setup; no blocking issue remains.
