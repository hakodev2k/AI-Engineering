# Research — Context Compression Success Budget Separation Guard

## Topic
Context Compression Success Budget Separation Guard

## Category
Performance

## Problem
Long-running tool-using agents need repeated context maintenance. A single shared `compression_attempts` counter can incorrectly treat successful maintenance compactions as if they were failed/no-progress retries. After enough legitimate successful compactions, the agent can lose the ability to compact later context growth and fail even though compression still works.

## Why it matters now
Current 2026 reports across agent runtimes show that compaction is now a recurring operational dependency for long sessions, and failure/retry semantics materially affect availability, latency, and token cost.

## Affected users
- Developers running long autonomous coding/research sessions.
- Agent platform teams implementing context compression and continuation.
- Users of tool-heavy sessions where context repeatedly regrows after successful compaction.
- Teams operating metered backends where unnecessary retries or premature session failure are expensive.

## Current public evidence
### Observed evidence
1. NousResearch Hermes Agent issue #72451, opened July 27, 2026, documents a long tool-calling turn where three successful in-place compactions materially reduced input size, yet all three consumed the same per-turn attempt budget. A later context overflow could not trigger a fourth compaction until a fresh turn reset the counter. Source: https://github.com/NousResearch/hermes-agent/issues/72451
2. Hermes Agent issue #59587, opened July 6, 2026, documents that proactive compression and reactive 413/context-overflow handling share the same counter, making “first retry” semantics ambiguous and motivating a dedicated error-compression attempt counter. Source: https://github.com/NousResearch/hermes-agent/issues/59587
3. OpenAI Codex issue #25534, opened June 1, 2026, reports remote compaction transient failures exhausting a retry budget and aborting the turn instead of degrading to a local compaction path, showing the wider need to separate bounded failure handling from successful maintenance capability. Source: https://github.com/openai/codex/issues/25534
4. Anthropic Claude Code issue #41198, opened March 30, 2026, reports repeated compaction retries consuming about 1M tokens while idle, showing why failed/no-progress retries must remain bounded even while successful maintenance cycles may need to recur. Source: https://github.com/anthropics/claude-code/issues/41198

### Interpretation
One lifetime counter per turn conflates two different control objectives: preventing retry thrash and allowing productive maintenance. A safer design tracks failed/no-progress compression streaks separately from verified successful maintenance compactions, with both progress verification and an outer absolute safety bound.

### Proposed solution
Introduce a deterministic compression-budget state machine. Successful compression counts as maintenance only after it materially reduces context pressure and the next model request succeeds. Failed or insufficient compactions increment a bounded failure streak. Successful maintenance resets the failure streak but not an independent absolute safety counter. Reactive error retries receive their own bounded budget.

## Existing approaches
- One `max_attempts` counter shared across proactive, post-tool, 413, and context-overflow paths.
- Per-turn reset of the shared counter.
- Percentage-reduction gates before retry.
- Manual `/compact` or fresh-session recovery.
- Remote compaction retries with fixed retry limits.

## Remaining limitations
- Shared counters can strand legitimate long turns after successful maintenance.
- Resetting too aggressively can reintroduce infinite compression loops.
- A reduction measured only by message count may hide poor token reduction.
- A compression should not be considered successful until the next model request actually fits and completes.
- Retry logic may differ between proactive maintenance and reactive provider errors.

## Root-cause analysis
1. Failure prevention and maintenance scheduling are represented by one mutable counter.
2. “Success” is sometimes recorded at compressor return rather than after post-compaction model success.
3. Progress thresholds are not consistently tied to actual/estimated token pressure.
4. Proactive and reactive paths share state without explicit semantics.
5. The outer agent loop may permit very long turns, making repeated legitimate maintenance necessary.

## Improvement opportunity
Separate three quantities: consecutive failed/no-progress attempts, reactive error retries, and total maintenance events. Verify material progress and successful model continuation before resetting the failure streak. Keep a high absolute total-event cap and explicit stop conditions so the design cannot become an unbounded compaction loop.

## Goal
Sustain long productive turns across repeated successful maintenance compactions while still terminating failed/no-progress compression loops quickly.

## Metrics
- Successful maintenance compactions per long fixture before terminal failure.
- Consecutive no-progress attempts before stop.
- Reactive retries per provider overflow/413 event.
- Model calls and tokens spent on failed compaction paths.
- Context-overflow recovery success rate.
- False terminal failures after verified successful compactions.

## Trigger
Every proactive compression, post-tool compression, 413/context-overflow recovery attempt, and post-compression model response.

## Inputs
Pre/post context pressure, compression result status, next model response status, failure class, path type (`maintenance` or `reactive`), current counters.

## Outputs
Updated budget state plus `continue`, `retry`, `handoff`, or `stop` decision and reason code.

## Relevant sources
- Hermes Agent #72451: https://github.com/NousResearch/hermes-agent/issues/72451
- Hermes Agent #59587: https://github.com/NousResearch/hermes-agent/issues/59587
- OpenAI Codex #25534: https://github.com/openai/codex/issues/25534
- Claude Code #41198: https://github.com/anthropics/claude-code/issues/41198
