# Workflow — Compact, Validate, Publish

## Trigger
Context usage crosses the configured compaction threshold or an operator requests compaction.

## Goal
Reduce active context while preserving task state, source identity, chronology, and pending input.

## Inputs
Session transcript, active-goal ledger, critical constraints, pending-message queue, compaction policy.

## Baseline
Capture input token count, source message count, critical-state ledger size, current active goal, completion state, and pending-message watermark.

## Stages
1. **Observe** — record why compaction triggered and current context utilization.
2. **Freeze** — snapshot the exact source range and watermark incoming events.
3. **Measure** — record baseline tokens and critical state.
4. **Compact** — summarize only the frozen range and emit a structured envelope with provenance IDs.
5. **Validate** — run `scripts/validate_compaction.py` against source ledger and candidate.
6. **Decision** — if valid, append messages newer than the watermark verbatim and publish the compacted state. If invalid, feed only failed invariants back to the summarizer.
7. **Retry** — at most two summarization retries for the same immutable snapshot.
8. **Fallback** — if still invalid, retain source context; when necessary, evict only stable reloadable artifacts rather than semantic task state.
9. **Verify** — re-read the published state and confirm token count, active goal, completion state, constraints, and provenance.

## Responsible agent
A compaction implementation may generate the candidate, but an independent verifier or deterministic validator MUST make the publication decision for blocking invariants.

## Tools
Session store read/snapshot, token counter, summarizer, deterministic validator, regression tests.

## Outputs
Compaction envelope, integrity report, before/after token metrics, publication decision, retry/fallback record.

## Checkpoints
- C1 immutable snapshot established.
- C2 ledger generated before summary.
- C3 provenance valid.
- C4 critical-state coverage complete.
- C5 pending-message watermark reconciled.
- C6 published state re-read successfully.

## Metrics
Token reduction ratio, critical-fact recall, provenance violations, cross-session contamination, task-status reversals, dropped-message count, validator latency.

## Retry policy
Maximum 2 summary regeneration attempts. Each retry MUST target the reported failed invariants; it MUST NOT expand scope or change the source snapshot.

## Stop conditions
Success when all blocking checks pass. Stop with fallback when retry budget is exhausted, source snapshot identity changes, or storage cannot guarantee the watermark.

## Failure path
Do not publish the candidate. Preserve original state. Emit a failure report and use stable-reference eviction only if context pressure requires immediate reduction.

## Verification
Run regression fixtures and re-read published state. Token savings are accepted only when integrity checks remain green.

## Definition of Done
Implemented: validator is wired into compaction publication. Measured: before/after tokens and integrity metrics are recorded. Verified: all critical fixtures pass and no blocking invariant remains.
