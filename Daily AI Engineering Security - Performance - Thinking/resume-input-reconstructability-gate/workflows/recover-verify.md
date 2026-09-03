# Workflow: Recover and Verify

## Trigger
A task is about to resume after checkpoint restore, retry, interrupt, or process restart.

## Goal
Resume only when the original logical invocation can be reconstructed faithfully.

## Inputs
Checkpoint, dependency manifest, original fingerprint, completion records, side-effect metadata.

## Baseline
Capture uninterrupted execution for the same deterministic fixture: task count, terminal state, outputs, and side-effect ledger.

## Stages
1. **Observe** — identify the pending task and its original dependency manifest.
2. **Measure baseline** — save uninterrupted reference results.
3. **Diagnose** — classify each dependency and locate missing/non-durable inputs.
4. **Hypothesis** — specify whether the task should be reused, reconstructed, or blocked.
5. **Implement improvement** — persist stable descriptors/results or add a non-resumable guard.
6. **Measure again** — execute resume fixture.
7. **Compare** — terminal state, outputs, task execution count, and side-effect ledger must match policy.
8. **Independent verification** — a reviewer not responsible for the change approves PASS/BLOCK.

## Tools
`scripts/resume_contract_check.py`, unit tests, checkpoint/state diff tools.

## Outputs
Eligibility verdict, missing dependencies, before/after fingerprints, equivalence comparison, verifier decision.

## Checkpoints
C1 manifest complete; C2 baseline recorded; C3 fingerprint matches; C4 replay/idempotency decision valid; C5 equivalence test passes.

## Metrics
Dependency-manifest coverage, unsafe resumes blocked, duplicate task executions, state/output equivalence rate.

## Retry policy
Maximum two recovery/remediation attempts.

## Stop conditions
Complete on independent PASS. Stop after two failed attempts or immediately when a non-idempotent side effect could be duplicated without approval.

## Failure path
Restart from a known-safe workflow boundary, explicitly recreate runtime resources, and require human approval if irreversible effects may repeat.

## Definition of Done
Required dependencies accounted for; fingerprint matched; completed work not duplicated; uninterrupted/resumed results equivalent; loops bounded; independent verification passes.
