# Workflow: Reconcile and Resume
**Trigger:** restart, resume, context compaction, failover, or missing execution continuity.  
**Goal:** safely restore progress without repeating durable side effects.

## Inputs
Checkpoint, current task requirements, current durable-world snapshot, side-effect ledger, policy.
## Baseline
Record checkpoint sequence, world sequence/fingerprint, completed operation ids, pending operations, and current mutation capability.
## Stages
1. **Observe** — collect restored state and durable state without mutation.
2. **Measure baseline** — compare sequences, fingerprints, receipts and pending operations.
3. **Diagnose** — classify divergence as none, explained world-ahead, or unexplained.
4. **Form hypothesis** — identify the smallest evidence-backed explanation for each mismatch.
5. **Implement improvement** — repair only ledger/checkpoint metadata when supported by durable evidence; do not replay external writes.
6. **Measure again** — rerun `scripts/reconcile_resume.py`.
7. **Improved?** — if no, re-evaluate once; maximum 2 reconciliation attempts total.
8. **Verify** — independent Reconciliation Verifier checks current external evidence.
9. **Complete** — re-enable only the mutation capabilities required for remaining work.

## Responsible agent
Workflow owner performs reconciliation; `subagents/reconciliation-verifier.md` performs independent verification.
## Tools
Read-only state APIs, VCS status/log, receipt lookup, reconciliation script, unit tests.
## Outputs
Reconciliation JSON, evidence record, mutation-authority decision, next action.
## Checkpoints
Before any write; after metadata repair; after independent verification.
## Metrics
Duplicate mutations=0; unexplained mismatches=0 at completion; retries<=2; reconciliation evidence coverage=100% for high-risk side effects.
## Retry policy
Maximum 2 attempts. No retries that repeat external side effects.
## Stop conditions
Unexplained durable state, missing high-risk receipt, secret exposure, or exhausted retries.
## Failure path
Remain read-only, preserve evidence, escalate to human owner. Never weaken correctness to regain progress.
## Verification
Current durable state must independently match the accepted execution frontier.
## Definition of Done
Implemented gate active; Measured baseline/recheck captured; Verified reconciliation passes; no blocking issue remains.
