# Skill: Context Snapshot Audit
## Purpose
Determine whether token metadata represents the current model context or a different accounting quantity before compaction.
## Trigger
Unexpected compaction, context meter above 100%, repeated compaction, large discrepancy between transcript size and session token metadata, or provider/cache migration.
## Inputs
Context window, persisted total, latest model-call context, cumulative run usage, optional transcript estimate, snapshot provenance.
## Preconditions
Access to non-secret usage metadata and session/transcript statistics.
## Required context
Provider usage semantics and the runtime path that writes session metadata.
## Allowed tools
Read-only logs/session state, transcript token estimator, `scripts/compaction_snapshot_guard.py`, unit tests.
## Constraints
MUST NOT request hidden chain-of-thought. MUST NOT trigger destructive compaction to test an untrusted counter.
## Procedure
1. Record the exact writer/runtime path.
2. Capture latest-call context tokens separately from cumulative run usage.
3. Obtain one independent transcript estimate where feasible.
4. Record snapshot source/provenance.
5. Run the deterministic guard.
6. If blocked, recompute the latest snapshot once and compare again.
7. Identify which invariant failed: provenance, persisted/latest drift, transcript drift, cumulative masquerade, or threshold.
8. Fix the writer/typing boundary rather than loosening the compaction threshold.
## Decision points
If trustworthy latest context is below threshold, suppress automatic compaction. If latest context is genuinely above threshold and evidence agrees, allow normal bounded compaction.
## Expected output
Facts, Evidence, Snapshot source, Drift metrics, Decision, Risks, Verification status.
## Metrics
False-compaction rate, persisted/latest ratio, transcript drift, compactions/session, summarization tokens, post-compaction quality regression.
## Verification
Use independent verifier and multi-tool-loop regression fixture.
## Failure handling
One recomputation attempt; then preserve history and escalate.
## Stop conditions
No trustworthy snapshot after recomputation, conflicting provider semantics, or any evidence of destructive data loss.
