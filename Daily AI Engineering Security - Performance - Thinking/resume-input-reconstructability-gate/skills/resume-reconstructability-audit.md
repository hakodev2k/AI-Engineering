# Skill: Resume Reconstructability Audit

## Purpose
Determine whether a paused/failed task can be resumed with inputs semantically equivalent to the original invocation.

## Trigger
Checkpoint/resume changes, runtime-only inputs, dynamic `Send`/fan-out, nested subgraphs, human interrupts, or crash recovery.

## Inputs
Checkpoint, task dependency manifest, original task fingerprint, completion/result records, runtime resource descriptors, side-effect classification.

## Preconditions
Each required input dependency is labeled `durable`, `reconstructable`, or `runtime-only`.

## Allowed tools
Checkpoint inspection, local replay fixtures, deterministic hashing, unit tests, state comparison.

## Constraints
Do not request hidden chain-of-thought. Do not fabricate missing runtime state. Do not replay non-idempotent side effects solely to discover whether resume works.

## Procedure
1. Enumerate all inputs required by the task at its original execution boundary.
2. Label persistence semantics for each dependency.
3. Compute an original logical-input fingerprint from durable values plus stable descriptors for reconstructable resources.
4. At resume, reconstruct candidate inputs and recompute the fingerprint.
5. Check completed-task/result evidence to determine whether execution should be reused rather than repeated.
6. If a required runtime-only input is absent or fingerprints differ, block automatic resume.
7. For side-effecting tasks, require an idempotency/replay guarantee before any re-execution.
8. Run uninterrupted-vs-resumed equivalence tests.

## Decision points
- Missing optional input: continue only if contract marks it optional.
- Missing required runtime-only input: BLOCK.
- Completed task result present: reuse unless framework contract explicitly requires recomputation.
- Fingerprint drift: BLOCK and escalate/restart from a safe boundary.

## Expected output
PASS/BLOCK verdict, dependency gaps, original/resume fingerprints, replay decision, and recovery recommendation.

## Metrics
Manifest coverage, blocked unsafe resumes, duplicate execution count, equivalence-test match rate.

## Verification
An independent verifier checks the manifest and compares terminal outputs/state for uninterrupted and resumed runs.

## Failure handling
At most two recovery attempts. Fallback is restart from a safe graph boundary with explicit reinitialization and user/operator approval when side effects may repeat.

## Stop conditions
Stop on verified equivalence or after two failed recovery attempts.
