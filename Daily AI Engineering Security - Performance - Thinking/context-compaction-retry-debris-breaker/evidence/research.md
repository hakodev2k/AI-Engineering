# Research — Context Compaction Retry Debris Breaker

## Topic
Context Compaction Retry Debris Breaker

## Category
Token / Performance

## Problem
Long-running agent sessions can enter a self-amplifying failure loop when context overflow triggers compaction, the compaction request itself is oversized or fails, and retry diagnostics are persisted back into the same durable history. Each retry then increases the next compaction input and makes recovery less likely.

## Why it matters now
Recent August 2026 reports show multiple context-compaction failure modes in active agent projects, including permanent retry amplification, stale compaction handoffs, and silent loss of previously distilled state.

## Affected users
Developers operating long-running coding agents, assistants with durable sessions, background agents, and platforms that persist tool/retry history.

## Current public evidence
### Observed evidence
1. Prime Agent issue #900, opened 2026-08-08, reports a production loop where context overflow triggers oversized compaction, failed compaction persists more retry/output diagnostics, and each retry expands future input: https://github.com/PrimeIntellect-ai/prime-agent/issues/900
2. Hermes Agent issue #83248, opened 2026-08-10, reports a compaction scan failure that discards a valid previous summary and replaces it with a thin one-turn summary, causing silent loss of earlier distilled work: https://github.com/NousResearch/hermes-agent/issues/83248
3. Hermes Agent issue #80622, opened 2026-08-06, reports a reference-only compaction handoff becoming an active turn and resuming stale completed work after compaction: https://github.com/NousResearch/hermes-agent/issues/80622

## Existing approaches
- Compact automatically after a token threshold.
- Retry overflow/compaction failures.
- Preserve a prior summary or handoff in session state.
- Keep a recent tail of raw messages after compaction.

## Remaining limitations
- Retry artifacts can become part of the next summarization input.
- Compaction input can remain unbounded even after the normal model call has already overflowed.
- A previous valid handoff may be replaced without proving semantic continuity.
- Retry loops often lack an independent stop condition based on input growth and repeated failure signatures.

## Root-cause analysis
1. Durable retry debris is mixed with semantic conversation history.
2. Compaction input has no independent byte/token ceiling below the provider limit.
3. Compaction retry state is not isolated from the material being compacted.
4. Previous-summary replacement lacks continuity checks.
5. Failure recovery retries the same effective payload without requiring measurable change.

## Improvement opportunity
Introduce a deterministic pre-compaction gate that separates retry debris from semantic history, enforces a bounded compaction input budget, reuses the last verified handoff when continuity cannot be proven, and stops retries unless the next payload is materially smaller or structurally different.

## Goal
Prevent permanent compaction loops and preserve semantic continuity during recovery.

## Metrics
- Maximum compaction retry attempts: 2.
- Retry payload size MUST decrease by at least 10% or change strategy.
- Retry/debug artifacts included in summary input: 0.
- Previous verified handoff retained when continuity check fails: 100%.
- Stuck-session fixture reaches terminal recovery decision within 3 compaction attempts.

## Trigger / Inputs / Outputs
- Trigger: before automatic compaction and after compaction failure.
- Inputs: message metadata, token/character estimates, prior verified summary, retry history, provider context limit.
- Outputs: bounded compaction payload, excluded-artifact report, continuity verdict, retry/stop decision.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/900
- https://github.com/NousResearch/hermes-agent/issues/83248
- https://github.com/NousResearch/hermes-agent/issues/80622
