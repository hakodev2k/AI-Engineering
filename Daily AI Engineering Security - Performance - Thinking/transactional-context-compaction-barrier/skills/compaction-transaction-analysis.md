# Skill: Compaction Transaction Analysis

## Purpose
Determine whether an agent can compact context without losing source history, confusing cumulative usage with current prompt size, or crossing unresolved side effects.

## Trigger
Automatic/manual compaction, context-window pressure, overflow recovery, or a report of lost history/tool effects.

## Inputs
Current-context token snapshot, configured window, transcript checkpoint state, tool-call ledger, retry ledger, compaction policy.

## Preconditions
Token metrics include scope metadata. Side-effecting tools expose durable states.

## Required context
Current task requirements, durable transcript metadata, and tool states. Summary text is evidence only after source history durability is proven.

## Allowed tools
Read-only session inspection, deterministic guard, unit tests, metrics queries.

## Constraints
- MUST NOT request hidden chain-of-thought.
- MUST NOT compact based on cumulative run usage.
- MUST NOT discard source history before durable checkpoint verification.
- MUST NOT cross unresolved side-effecting tool calls.

## Procedure
1. Record Facts: context tokens, context window, token-scope label, durable-history status.
2. Record Assumptions separately; reject unlabeled token counters.
3. Enumerate tool calls and classify each `not_started|issued|committed|failed_confirmed|unknown`.
4. Run `scripts/compaction_guard.py`.
5. If deferred, resolve the deterministic blocker rather than lowering safeguards.
6. If prepared, generate the compacted candidate without deleting source history.
7. Measure before/after current-context tokens.
8. Require the configured minimum reduction and semantic task-critical preservation.
9. Commit replacement only after independent verification.

## Decision points
Defer on non-current token scope, undurable history, unresolved side effects, low utilization, or exhausted retry budget. Roll back if the candidate does not materially reduce tokens.

## Expected output
Facts, Evidence, Decision, blocker reasons, history digest, before/after metrics, verification status.

## Metrics
Compactions per session; false compaction triggers; unresolved-side-effect blocks; token reduction ratio; source-history durability coverage; retry count per digest.

## Verification
A separate verifier checks the source checkpoint exists, tool states are terminal, and critical task facts survive compaction.

## Failure handling
Preserve original history, mark compaction deferred/failed, and record the digest-specific failure.

## Stop conditions
Maximum two retries for the same history digest; stop immediately on missing durability evidence or unknown side-effect state.
