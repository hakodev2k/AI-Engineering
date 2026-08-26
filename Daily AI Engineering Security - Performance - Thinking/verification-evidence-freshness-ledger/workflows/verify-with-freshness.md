# Workflow: Verify With Freshness
## Trigger
An agent proposes completion after modifying code.
## Goal
Obtain sufficient fresh evidence once, avoid duplicate verification loops, and block stale claims.
## Inputs
Task criteria, current revision, verification commands, ledger.
## Baseline
Record verification runs/task and current ledger state before changes.
## Stages
1. **Observe:** capture revision and required checks.
2. **Measure:** run the ledger evaluator.
3. **Diagnose:** if blocked, classify missing, stale, failed, future-timestamp, or revision mismatch.
4. **Hypothesize:** decide whether one verification run can resolve the block.
5. **Implement evidence:** execute required checks and append one record.
6. **Measure again:** rerun the gate.
7. **Improved?** If no, one additional verification attempt is allowed for the unchanged revision.
8. **Verify:** independent reviewer confirms exact-revision evidence.
## Responsible agent
Implementation agent records evidence; Independent Verification Reviewer performs final verification.
## Tools
VCS revision command, approved test runner, `scripts/verification_ledger.py`.
## Outputs
Fresh evidence key or blocking reason.
## Checkpoints
Before first verification; after each appended record; before completion.
## Metrics
Verification runs/task, duplicate suppression, stale rejection, post-verification rework.
## Retry policy
Maximum 2 verification executions per unchanged revision.
## Stop conditions
Persistent failure after 2 attempts, unsafe test requirement, ambiguous revision, or missing independent review.
## Failure path
Block completion and escalate with evidence; never weaken the gate.
## Definition of Done
Fresh passing evidence for exact revision, required checks covered, independent pass, no blocking issue.
