# Skill: Convergence Diagnosis

## Purpose
Diagnose non-converging agent execution using observable task state rather than hidden chain-of-thought.

## Trigger
A long-running task exceeds expected cycles, repeatedly adds work, repeats reviews, or produces continuation turns without artifact changes.

## Inputs
Acceptance criteria, current statuses, cycle history, artifact-change evidence, test/review results, publication state.

## Preconditions
Acceptance criteria are finite and have stable IDs.

## Required context
Facts, criteria, evidence links, current artifacts, and policy only.

## Allowed tools
Read-only repository/status inspection, tests, deterministic `convergence_guard.py`.

## Constraints
MUST NOT request hidden reasoning. MUST NOT create new work unless tied to a failed criterion. MUST preserve current work before stopping.

## Procedure
1. Freeze the acceptance-criterion IDs for the diagnostic interval.
2. Record each criterion as pending/failed/passed/waived/blocked with evidence.
3. Record per-cycle remaining count, progress events, and new work.
4. Run `scripts/convergence_guard.py`.
5. If blocked, identify the exact rule violation.
6. Permit at most one bounded correction per failed criterion before re-evaluation.
7. On stop decision, snapshot task-owned state and hand off.

## Decision points
- Continue only when measurable progress occurs and limits remain.
- Add work only when a named failed criterion requires it.
- Stop when no-progress/cycle/expansion limits fire.

## Expected output
Facts, Evidence, Failed criteria, Guard decision, Remaining work, Snapshot status, Verification status.

## Metrics
Cycles to completion; no-progress cycles; new work items per failed criterion; unsupported expansion count; rework count.

## Verification
Independent reviewer confirms the final criterion ledger matches artifacts/tests.

## Failure handling
Preserve current state, emit reason codes, escalate blocked criteria.

## Stop conditions
Guard stop decision, exhausted correction limit, unsafe or irreversible action requiring human approval.
