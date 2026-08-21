# Hooks: Backend Quality Gates

## Before task start
**Preconditions:** task objective and repository available.  
**Action:** validate required context using `scripts/validate-task.py`.  
**Expected result:** missing critical inputs are surfaced before implementation.  
**Failure behavior:** block planning when objective or acceptance criteria are absent for risky changes.

## After planning
**Action:** verify plan includes changed boundaries, tests, risks, approval points, and Definition of Done.  
**Failure behavior:** return to planning; blocks implementation for security, data, or public-contract changes.

## After implementation
**Action:** run `scripts/dotnet-verify.ps1` from repository root.  
**Expected result:** restore/build/tests succeed.  
**Failure behavior:** blocks review; retry only after a concrete fix or evidence of a transient environment failure.

## Before review
**Action:** inspect changed-file list and diff; verify no unexpected binary files, secret-like content, generated artifacts, or unrelated changes.  
**Failure behavior:** block review until scope is explained or corrected.

## After review
**Action:** require all Critical/High findings to be resolved or explicitly accepted by authorized human.  
**Failure behavior:** blocks verification.

## Before delivery
**Action:** run `scripts/package-audit.py` for role-package consistency when modifying this package; for application work, verify acceptance-criteria matrix and final test evidence.  
**Failure behavior:** blocks completion if required evidence is missing.

## After failure
**Action:** preserve command/error/evidence, classify failure as transient, validation, test, permission, dependency, environment, or business-rule failure.  
**Retry:** maximum 2 retries for genuinely transient non-destructive operations.  
**Blocking:** repeated failure is exposed as a blocker.

## Before production action
**Action:** require explicit human approval and a rollback/recovery plan for deployment, destructive SQL, data mutation, infrastructure/configuration/security changes, secret rotation, or irreversible migration.  
**Failure behavior:** always blocks autonomous execution.
