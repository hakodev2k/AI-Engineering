# Workflow: Delegate, Handoff, Recover, Verify

## Trigger
Delegated work is expensive, long-running, parallel, headless, or materially harmful to lose.

## Goal
Accept child completion only when the parent possesses the actual verified deliverable, while preserving useful partial work after failures.

## Inputs
Original task, acceptance criteria, handoff policy, child status/terminal metadata, deliverable, checkpoints, and verification evidence.

## Baseline
Before deployment, measure the current completion-without-deliverable and retry/rework rates on representative delegated tasks.

## Context
Record the required output type and which side effects/tests/reviews constitute acceptance evidence.

## Stages
1. **Decompose** — parent defines the delegated scope and concrete deliverable acceptance criteria.
2. **Dispatch** — child receives scope and handoff contract; no hidden reasoning is requested.
3. **Checkpoint** — long tasks persist externally useful facts/results at meaningful milestones.
4. **Produce deliverable** — child writes inline output or durable artifact before terminal success.
5. **Build envelope** — record terminal state/reason, unfinished tool calls, digest, checkpoints, and verification evidence.
6. **Validate** — run `scripts/validate_handoff.py`.
7. **Accepted?** — if yes, independent verifier retrieves and checks the actual deliverable.
8. **Rejected?** — classify recoverability and resume from checkpoint or rerun only the missing slice.
9. **Retry** — maximum two recovery attempts, each addressing a named rejection reason.
10. **Complete** — parent records Implemented/Measured/Verified status separately.

## Responsible agent
Parent/planner for stages 1–2; implementing child for stages 3–5; deterministic gate for stage 6; Handoff Verifier for stage 7; parent/recovery owner for stages 8–10.

## Tools
Artifact store/filesystem, child status/result APIs, hashing, `scripts/validate_handoff.py`, task-specific tests/reviews.

## Outputs
Accepted durable deliverable and verification record, or reject report plus recoverable checkpoint/recovery decision.

## Checkpoints
At minimum after evidence collection for long investigations and before irreversible side effects. Checkpoints should contain externally useful results, not private chain-of-thought.

## Metrics
False-success rate, completion-without-deliverable rate, digest pass rate, recoverable-partial rate, retry count, verification coverage, and rework time.

## Retry policy
Maximum two recovery attempts. A retry MUST change the failing condition; blind replay is prohibited.

## Stop conditions
Two failed recoveries, missing artifact with no usable checkpoint, integrity mismatch that cannot be resolved, conflicting terminal state, or dangerous action requiring explicit human approval.

## Failure path
Reject completion, preserve checkpoints/evidence, avoid claiming success, scope recovery to missing work, and escalate when the deliverable cannot be reconstructed safely.

## Verification
Validator status `accept`, actual deliverable retrievable, task-specific checks pass, and independent verifier confirms acceptance criteria.

## Definition of Done
Implemented: durable handoff mechanism integrated. Measured: baseline and post-change false-success/rework metrics captured. Verified: deterministic gate and independent verifier accept representative failure/success cases with no blocking issue.
