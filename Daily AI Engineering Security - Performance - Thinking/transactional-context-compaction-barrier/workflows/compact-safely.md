# Workflow: Compact Safely

## Trigger
Context utilization reaches the configured threshold or overflow recovery requests compaction.

## Goal
Reduce current-context tokens without losing durable history, corrupting tool side effects, or entering a retry loop.

## Inputs
Current-context snapshot, context window, durable history checkpoint, tool-call ledger, retry ledger, policy.

## Baseline
Record current-context tokens, transcript digest, task-critical facts, pending tool calls, and existing retry count.

## Stages
1. **Observe** — collect scoped token and durability evidence.
2. **Measure baseline** — calculate utilization from current-context tokens only.
3. **Diagnose** — run the pre-compaction guard and classify blockers.
4. **Form hypothesis** — state what content class can be compressed and expected reduction.
5. **Prepare** — generate a candidate while retaining the original checkpoint.
6. **Measure again** — count candidate current-context tokens.
7. **Improved?** — require minimum reduction; otherwise reject candidate.
8. **Verify** — independent agent checks critical facts and terminal side effects.
9. **Commit** — atomically promote candidate only after verification.

## Responsible agent
Coordinator prepares; Verification Agent independently verifies.

## Tools
`hooks/pre-compaction.md`, `scripts/compaction_guard.py`, approved token counter, durable transcript store.

## Outputs
Guard result, candidate digest, before/after metrics, verification record, commit/defer/rollback decision.

## Checkpoints
Before candidate generation; before original-history replacement; after commit.

## Metrics
Context utilization, reduction ratio, deferred compactions, retry count per digest, critical-fact retention, unresolved-side-effect block count.

## Retry policy
Maximum 2 retries for the same transcript digest. A retry must change the compaction strategy or input; unchanged blind retries are forbidden.

## Stop conditions
Missing durable history, unknown side-effect state, exhausted retries, negative/no token reduction, or failed verification.

## Failure path
Keep original history active, record evidence, defer compaction, and escalate if the context limit prevents further safe progress.

## Verification
Verification Agent must pass before commit.

## Definition of Done
Implemented controls are active; measured reduction meets policy; verification passes; original history remains recoverable through commit; no blocking issue remains.
