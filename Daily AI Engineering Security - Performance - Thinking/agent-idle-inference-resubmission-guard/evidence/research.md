# Research

## Topic
Preventing model inference resubmission while an agent is observably idle or terminal

## Category
Token

## Problem
Internal/background agent workers can repeatedly resubmit model requests even when there is no pending input and no model follow-up requirement, burning cached tokens and quota without progress.

## Why it matters now
Fresh August 2026 reports show extreme token amplification in long-running coding-agent hosts. A particularly strong Codex report from 2026-08-22 describes 1,911 requests and roughly 243M input tokens from a background memory worker while the visible parent was idle, with logs indicating `model_needs_follow_up=false`, `has_pending_input=false`, and `needs_follow_up=false`.

## Affected users
Coding-agent users, platform builders, orchestration teams, providers operating internal memory/review workers, and organizations with token/quota budgets.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #40110, opened 2026-08-22: Codex 0.149.0 background memory worker repeatedly resubmitted a completed turn while idle; 1,911 requests, 242,939,410 input tokens, 241,319,680 cached input tokens, and only 36,154 output tokens were reported. The reporter states the loop persisted while follow-up and pending-input flags were false. https://github.com/openai/codex/issues/40110
2. OpenAI Codex issue #37299, opened 2026-08-06: Desktop wait/status orchestration reportedly re-metered roughly 140k cached context every 10–30 seconds while stale subagent state kept the loop alive, reaching about 290M tokens in a day. https://github.com/openai/codex/issues/37299
3. OpenAI Codex issue #36503, opened 2026-08-01: a Desktop `/goal` workflow reportedly entered unbounded identical retries after blocked-state recording failed, accumulating 708.9M session tokens, mostly cached. https://github.com/openai/codex/issues/36503

### Interpretation
These incidents differ in subsystem, but share a control-plane defect: model admission is coupled to a timer/retry/worker loop rather than to a fresh, progress-bearing event. Prompt caching lowers marginal compute but does not make repeated inference free and can obscure the magnitude of the loop.

## Existing approaches
- Fixed retry counts and exponential backoff.
- Status-poll suppression/coalescing.
- Prompt caching.
- Spend/rate-limit circuit breakers.
- Manual process termination.

## Remaining limitations
Backoff still spends tokens indefinitely if the loop has no terminal predicate. Spend caps stop damage only after consumption. Status-poll guards may not cover internal memory/review workers. Cache hits reduce some cost but still consume quota/accounting and provider work. Manual termination is reactive.

## Root-cause analysis
1. No single admission predicate governs all model-requesting workers.
2. Terminal state and worker lifecycle state can diverge.
3. Timers/retries are treated as sufficient reasons to call the model.
4. State-change identity is not tracked, so identical requests can be reissued.
5. Cached-input telemetry is underweighted in runaway detection.

## Improvement opportunity
Require every inference request to carry a machine-verifiable trigger with freshness/identity. Reject requests when all follow-up/pending/change predicates are false; deduplicate trigger IDs; enforce bounded retry reasons; and audit cached-input amplification separately from uncached input.

## Relevant sources
- Codex #40110, 2026-08-22: https://github.com/openai/codex/issues/40110
- Codex #37299, 2026-08-06: https://github.com/openai/codex/issues/37299
- Codex #36503, 2026-08-01: https://github.com/openai/codex/issues/36503

## Goal, metrics, trigger, inputs, outputs
Goal: zero model requests in stable idle/terminal state while preserving valid continuations. Metrics: idle requests, cached tokens wasted idle, requests after terminal, time-to-quiescence, false blocks, tokens/task, cost/task, latency. Trigger: model-request attempt by any background/internal worker. Inputs: state flags, event/version IDs, retry metadata, token telemetry. Outputs: allow/block decision, reason, violation record, before/after metrics.