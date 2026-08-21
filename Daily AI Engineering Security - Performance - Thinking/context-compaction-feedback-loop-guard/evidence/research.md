# Research — Context Compaction Feedback Loop Guard

## Topic
Context Compaction Feedback Loop Guard

## Category
Token

## Problem
Long-running agents can enter repeated context-compaction cycles that consume large token budgets while making little or no progress. A failed or ineffective compaction may retry the same oversized input, persist retry debris, preserve too much protected history, or resume with context still near the threshold. The next turn then triggers compaction again, creating a feedback loop.

## Why it matters now
Current coding/agent products increasingly support long-lived sessions with large context windows, many tool calls, reasoning traces, images, and subagents. Recent public incidents show that compaction itself can become the dominant token consumer and can leave a session permanently unhealthy.

## Affected users
Coding-agent users, agent-runtime maintainers, platform operators, teams using persistent autonomous sessions, and developers paying for large-context model calls.

## Current public evidence
### Observed evidence
1. Prime Agent issue #900, opened 2026-08-08, reports a self-amplifying loop where `context_length_exceeded` triggers oversized compaction, failed recovery persists more retry debris, and future messages repeat the cycle: https://github.com/PrimeIntellect-ai/prime-agent/issues/900
2. Hermes Agent issue #84371, opened 2026-08-12, reports repeated compaction where preflight sees ~367K tokens but the compaction protects the entire transcript as tail (`middle_window_tokens=0`), producing six or more ineffective compactions in ten minutes: https://github.com/NousResearch/hermes-agent/issues/84371
3. Claude Code issue #41198, opened 2026-03-30, documents five compaction agents firing in five minutes on an idle session, each processing roughly 200K tokens, for about one million tokens of user-unproductive work: https://github.com/anthropics/claude-code/issues/41198
4. OpenAI Codex issue #35032, opened 2026-07-23, reports automatic compaction completing while the thread remains around 80% full, causing repeated `compact -> resume nearly full -> compact again` usage waste: https://github.com/openai/codex/issues/35032
5. OpenAI Codex issue #24388, opened 2026-06-12, reports remote compaction failing with `context_length_exceeded` when large `input_image` payloads survive inside replacement history: https://github.com/openai/codex/issues/24388

## Existing approaches
- Trigger compaction when an estimated context threshold is crossed.
- Summarize a middle/history range and preserve recent turns.
- Retry compaction after a provider context error.
- Use remote/provider-managed compaction when available.
- Start a new session manually when automatic recovery fails.

## Remaining limitations
Threshold-only triggering does not prove that a compaction reduced the next-request context enough. Retry logic can submit the same oversized material repeatedly. Protected-tail policies may leave no compressible middle. Retry/error artifacts can become durable input for later compactions. Large non-text payloads and reasoning/tool envelopes may be under-accounted. Many systems lack a measurable “compaction progress” invariant and a retry circuit breaker.

## Root-cause analysis
- Trigger metrics and post-compaction success metrics are often the same coarse estimate rather than actual next-request size.
- Compaction attempts are not keyed/deduplicated by source-state fingerprint.
- Retry output/errors are persisted into the same history being compacted.
- Protected-tail selection can consume the entire compressible budget.
- Token estimation may omit provider-specific reasoning, tool-call envelopes, images, or serialization overhead.
- No minimum progress ratio is required before another automatic compaction.
- Retry loops are insufficiently bounded or can restart on the next turn without remembering recent failures.

## Improvement opportunity
Add a deterministic compaction controller that fingerprints source context, estimates request composition by bucket, requires a minimum post-compaction reduction, caps retries per fingerprint, excludes retry debris from future source material, and opens a cooldown/circuit-breaker when compaction fails or produces insufficient progress. Verify against actual provider usage when available rather than estimate alone.

## Goal
Prevent repeated low-value compaction calls while preserving enough context for correctness and surfacing an explicit recovery path when a session cannot be compacted safely.

## Metrics
- Compaction input tokens per user-visible turn.
- Number of compactions per source fingerprint and per 10-minute window.
- Estimated and actual pre/post request tokens.
- Reduction ratio `(before-after)/before`.
- Tokens spent on failed/insufficient compactions.
- Percent of source context classified as compressible versus protected.
- Retry-debris bytes/tokens excluded.
- Session recovery success without context loss regressions.

## Trigger
Any automatic compaction request, retry after `context_length_exceeded`, or session resume that remains above the configured threshold shortly after compaction.

## Inputs
Session/context fingerprint, token buckets, provider context limit, trigger threshold, protected-tail policy, compaction attempt history, retry/error artifacts, and actual usage telemetry when available.

## Outputs
Decision (`compact`, `allow`, `cooldown`, `manual_recovery`), bounded retry count, target post-compaction budget, progress measurement, excluded debris metadata, and audit record.

## Interpretation
These reports do not prove one universal implementation defect. They show a recurring control-loop failure class: compaction is treated as an action to retry rather than an optimization that must demonstrate measurable progress before repeating.

## Proposed solution
A reusable controller, policy, workflow, and deterministic analyzer that enforces source-state fingerprints, minimum progress, bounded attempts, cooldowns, token-bucket accounting, and explicit stop conditions.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/900
- https://github.com/NousResearch/hermes-agent/issues/84371
- https://github.com/anthropics/claude-code/issues/41198
- https://github.com/openai/codex/issues/35032
- https://github.com/openai/codex/issues/24388
