# Skill: Resume Reconciliation
## Purpose
Verify that a restored/compacted agent checkpoint still matches durable external state before allowing mutation.
## Trigger
App restart, context compaction, runtime recovery, provider failover, task resume, or any detected gap in execution history.
## Inputs
Restored checkpoint, durable world snapshot, side-effect ledger, mutation policy, current task acceptance criteria.
## Preconditions
Read-only access to durable state and operation receipts; mutation tools disabled during reconciliation.
## Required context
Facts about completed operations, current world fingerprints, pending work, and latest valid checkpoint only.
## Allowed tools
Read-only VCS/API/status inspection, `scripts/reconcile_resume.py`, test runner.
## Constraints
MUST NOT repeat an external write to discover whether it already happened. MUST NOT grant mutation authority on an unexplained state mismatch.
## Procedure
1. Capture restored checkpoint sequence/frontier.
2. Capture current durable world sequence and fingerprint.
3. Load immutable receipts for completed side effects.
4. Run the reconciliation script.
5. Classify discrepancies as explained, unexplained, or unsafe.
6. If explained, update the ledger/checkpoint through the owning workflow before resuming.
7. If unexplained, block mutation and request human approval for high-risk operations.
## Decision points
- `world == checkpoint`: continue.
- `world > checkpoint` with ledger evidence: reconcile, then continue.
- unexplained world-ahead/fingerprint mismatch: block.
## Expected output
Facts, Evidence, Reconciliation status, Mutation authority, Risks, Verification status.
## Metrics
Duplicate side-effect count, unexplained resume mismatches, reconciliation latency, blocked unsafe resumes, repeated-work rate.
## Verification
Independent reviewer checks the world snapshot and receipts rather than trusting the agent summary.
## Failure handling
Retry read-only reconciliation at most twice. Fallback is read-only mode. Escalate unresolved durable-state divergence.
## Stop conditions
Stop mutation immediately on unexplained external state, missing receipts for high-risk actions, or exhausted retries.
