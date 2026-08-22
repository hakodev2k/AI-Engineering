# Skill — Verify Compaction Continuity

## Purpose
Verify that a compaction preserves task-critical state while actually reducing context.

## Trigger
Before committing any automatic or manual compaction result.

## Inputs
Pre-compaction manifest, post-compaction context, active-goal ledger, mandatory facts/approvals, admitted-message IDs, token counts.

## Preconditions
A snapshot boundary exists; every admitted message has a monotonic ID; summaries are marked reference-only.

## Required context
Only the closed snapshot, protected facts/goals, and post-snapshot tail.

## Allowed tools
Token counter, deterministic manifest checker, persistence readback, diffing, tests.

## Constraints
MUST NOT infer missing approvals or goals from summary prose. MUST NOT discard concurrent messages. MUST NOT accept compaction solely because the summarizer returned successfully.

## Procedure
1. Record pre-compaction token count and message-ID range.
2. Verify every admitted ID is either inside the closed snapshot or in the post-snapshot tail.
3. Check mandatory facts, constraints, active goals, completed goals, approvals, and unresolved blockers against structured ledgers.
4. Verify the summary is tagged `reference_only` and cannot become the active user turn.
5. Count post-compaction tokens and compute reclaimed percentage.
6. Persist compacted state, reload it, and compare message inventory plus active-goal hashes.
7. Run stale-work fixture: completed goals must remain completed and must not reappear as pending.
8. Commit only when all invariants pass; otherwise rollback.

## Decision points
- Missing message ID -> rollback.
- Missing critical fact/approval -> rollback.
- Reclaimed tokens below policy -> re-plan once with a smaller summary payload; otherwise abort.
- Persistence mismatch -> rollback and escalate.

## Expected output
`commit` or `rollback` with coverage, continuity, reclamation, persistence, and fixture results.

## Metrics
Coverage %, critical-fact retention %, token reclamation %, retry count, stale-goal resurrection count.

## Verification
Independent verifier reruns the deterministic checker after reload.

## Failure handling
Maximum two compaction attempts. Second attempt MUST change payload or strategy. No infinite summarize-retry loop.

## Stop conditions
Stop after successful verified commit or after two failed attempts; preserve original context on failure.
