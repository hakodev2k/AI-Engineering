# Research — Concurrent Session Turn Serialization Guard

## Topic
Concurrent Session Turn Serialization Guard

## Category
Security

## Problem
Agent runtimes that allow multiple turns to execute concurrently against the same session can let each turn act on a stale transcript snapshot. A later-resuming turn may not see an earlier turn's already-completed tool side effect and can execute the same action again. Retry/fallback paths can create the same split-brain effect when previously executed tool blocks are retracted from model-visible history while external work continues.

## Why it matters now
Recent 2026 reports show duplicate real-world actions caused by stale session snapshots and replayed agent dispatches, including concurrent turns issuing the same dispatch twice and fallback retries spawning duplicate code-writing agents. These are not hypothetical prompt-quality problems; they are orchestration-state consistency failures at the boundary between model state and external side effects.

## Affected users
Agent-platform builders, coding-agent users, webhook/chat gateway operators, multi-agent orchestration teams, and any system where concurrent inbound messages or model fallback can trigger write-capable tools.

## Current public evidence
### Observed evidence
1. **Hermes Agent issue #84235**, opened Aug 12, 2026, reports a production incident where concurrent turns on one session operated from stale transcript snapshots. One turn completed a dispatch; another later resumed without seeing it and dispatched again, producing duplicate side effects. Source: https://github.com/NousResearch/hermes-agent/issues/84235
2. **Claude Code issue #85402**, opened Aug 9, 2026, reports that a model-refusal fallback re-executed Agent dispatches whose background spawns had already happened. Retracted tool-use blocks made the fallback turn unaware of orphaned running agents, causing duplicate concurrent workers in one worktree. Source: https://github.com/anthropics/claude-code/issues/85402
3. **Warp issue #13560**, July 2026, reports tool calls being surfaced as cancelled after the command already executed; autonomous retry then duplicated externally visible side effects. Source: https://github.com/warpdotdev/warp/issues/13560

## Existing approaches
- Per-tool idempotency keys.
- Retry limits and circuit breakers.
- Optimistic session storage updates.
- Model-visible transcript replay.
- Per-request cancellation tokens.
- General duplicate-call detection.

## Remaining limitations
Per-tool idempotency does not solve stale read/decision state when different-but-equivalent calls are generated. Retry breakers react after repeated failure, not after successful-but-hidden execution. Transcript persistence alone is insufficient when turns read snapshots before another turn commits, or when fallback machinery retracts model-visible messages while external work remains active. Cancellation status can also be ambiguous: a tool may have committed even if the parent turn did not receive the receipt.

## Root-cause analysis
- No single-writer invariant for mutable session execution state.
- Session revision is not checked immediately before side-effecting actions.
- Tool execution receipts are coupled to model-visible message history instead of a durable side-effect ledger.
- Fallback/retry paths can rebuild a turn from an earlier logical state without reconciling already-started work.
- Cancellation conflates 'response not observed' with 'side effect did not occur'.
- Equivalent side effects may have different raw arguments, defeating naive exact-call deduplication.

## Improvement opportunity
Add an action-time session-revision gate plus durable execution receipts. Every side-effecting turn claims a session execution lease or validates an expected revision before commit. If the revision changed, the turn must reconcile durable receipts and refresh state before deciding. Fallback/retry paths inherit the logical operation ID and reconcile already-started child/tool operations before re-execution.

## Goal
Prevent duplicate or conflicting side effects caused by concurrent turns, stale snapshots, cancellation ambiguity, and fallback replay without globally disabling safe parallel read-only work.

## Metrics
- 0 duplicate side effects in stale-snapshot concurrency fixtures.
- 100% side-effecting operations carry a logical operation ID and session revision.
- 100% revision conflicts trigger reconciliation before retry.
- 100% fallback/retry attempts reuse or reconcile the original logical operation ID.
- Read-only parallelism remains available.
- No write action is marked safe solely because the parent response was cancelled.

## Trigger
Before any write-capable tool call, child-agent spawn, external dispatch, publish/send/deploy/delete operation, or retry/fallback of a turn that may already have executed a side effect.

## Inputs
Session ID, expected session revision, logical operation ID, tool/agent identity, canonical action fingerprint, current durable receipts, fallback/retry lineage, and side-effect classification.

## Outputs
Decision (`allow`, `reconcile`, `block`, `already_committed`), current session revision, matched receipt, conflict evidence, and audit record.

## Interpretation
These reports do not prove all agent runtimes permit concurrent stale execution. They demonstrate a recurring class of orchestration failures where model-visible history and actual external execution diverge. The key engineering requirement is therefore consistency and reconciliation, not a model prompt telling the agent to 'be careful'.

## Proposed solution
A reusable serialization/reconciliation package that preserves parallel read-only work while enforcing a single-writer or compare-and-swap boundary for side effects. It uses deterministic revision checking and receipt reconciliation rather than hidden reasoning.

## Relevant sources
- Hermes Agent #84235: https://github.com/NousResearch/hermes-agent/issues/84235
- Claude Code #85402: https://github.com/anthropics/claude-code/issues/85402
- Warp #13560: https://github.com/warpdotdev/warp/issues/13560
