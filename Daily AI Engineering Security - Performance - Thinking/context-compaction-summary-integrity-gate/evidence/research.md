# Research — Context Compaction Summary Integrity Gate

## Topic
Context compaction summary integrity in long-running AI agents.

## Category
Token / Thinking

## Problem
Automatic context compaction can lose or invent task state, merge or reorder turns, surface summaries as ordinary messages, or allow a reference-only summary to become the active instruction. These failures can reduce tokens while silently degrading correctness.

## Why it matters now
Long-running coding and automation agents increasingly depend on automatic compaction. Recent public issue reports in 2026 show multiple distinct failure modes: cross-session contamination, fabricated turns, stale-task resurrection, and dropped messages.

## Affected users
Agent framework maintainers, coding-agent users, multi-agent workflow teams, support/chat automation developers, and platform teams that compact long sessions.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #38788 (2026-06-04) reported a compacted summary from a cron session leaking into an unrelated live conversation, causing topic drift: https://github.com/NousResearch/hermes-agent/issues/38788
2. Hermes Agent issue #64539 (2026-07-14) reported compaction fabricating a user turn and switching language; the poisoned summary survived later compaction cycles: https://github.com/NousResearch/hermes-agent/issues/64539
3. Hermes Agent issue #80622 (2026-08-06) reported a reference-only compaction handoff becoming the active turn and resuming already-completed historical work: https://github.com/NousResearch/hermes-agent/issues/80622
4. Hermes Agent issue #28093 (2026-05-18) reported a user message arriving during active processing being dropped when compaction triggered: https://github.com/NousResearch/hermes-agent/issues/28093
5. Claude Code issue #73280 (2026-07-02) reported repeated Skill content being summarized during compaction rather than safely evicted/deduplicated, wasting context and risking format drift: https://github.com/anthropics/claude-code/issues/73280

### Interpretation
Compaction is not merely a token optimization. It mutates the effective state the model sees, so it needs invariants similar to a data migration: source identity, turn preservation, active-goal preservation, explicit provenance, and validation before the compacted state replaces source context.

## Existing approaches
- Token-threshold-triggered automatic summarization.
- Manual `/compress` or user-driven compaction.
- Keeping recent tail messages verbatim while summarizing older history.
- Persisting full history externally and injecting a summary into the active window.
- One-off fixes for specific metadata, role, or session-store bugs.

## Remaining limitations
- Summary quality is often judged semantically rather than against explicit invariants.
- Session identity and source message IDs are not always carried into compacted artifacts.
- New messages arriving during compaction can race with the snapshot being summarized.
- A summary can preserve fluent prose while dropping constraints, approvals, failed actions, or completion status.
- Re-compaction can amplify earlier summary errors.

## Root-cause analysis
1. No immutable source snapshot boundary before compression.
2. No machine-readable contract for facts, active goal, decisions, constraints, pending work, and completed work.
3. Missing provenance linking summary claims to source message IDs.
4. No deterministic post-compaction checks for turn count, session identity, language, active-goal status, or pending-message inclusion.
5. Compacted summaries are sometimes inserted using ordinary message roles without a durable reference-only marker.

## Improvement opportunity
Introduce a compaction integrity gate around the summarizer. Snapshot the exact source range, create a structured summary envelope with provenance, run deterministic invariants, compare preserved critical facts against a pre-compaction ledger, and only publish the compacted state when validation passes. On failure, keep the original context or reduce context using non-semantic eviction of safely reloadable artifacts.

## Goal
Reduce context usage without silent task-state corruption.

## Metrics
- 100% preservation of configured critical facts/constraints on test fixtures.
- 0 cross-session source IDs in output.
- 0 fabricated user-turn IDs.
- 100% inclusion of messages committed before snapshot close.
- Compaction token reduction measured separately from fidelity.
- Regression corpus pass rate >= 99% before production rollout; critical invariants require 100%.

## Trigger
Before and after any automatic/manual context compaction event.

## Inputs
Session ID, ordered source messages with stable IDs, active-goal ledger, critical constraints, pending-message watermark, compaction candidate, and policy.

## Outputs
`allow`, `retry`, or `reject`; integrity report; missing/extra provenance IDs; preserved-fact results; token before/after metrics.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/38788
- https://github.com/NousResearch/hermes-agent/issues/64539
- https://github.com/NousResearch/hermes-agent/issues/80622
- https://github.com/NousResearch/hermes-agent/issues/28093
- https://github.com/anthropics/claude-code/issues/73280
