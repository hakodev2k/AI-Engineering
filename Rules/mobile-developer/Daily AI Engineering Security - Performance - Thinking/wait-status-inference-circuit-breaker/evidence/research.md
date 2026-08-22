# Research

## Topic
Wait/Status Inference Circuit Breaker

## Category
Performance

## Problem
Long-running agent orchestrators repeatedly re-enter the model merely to poll waiting subagents or commands, causing high token usage, latency, and quota burn while no meaningful state changes.

## Why it matters now
Recent Codex issue reports show idle wait/status turns dominating tool-call volume and remetering very large cached contexts at short intervals.

## Affected users
Developers running multi-agent coding tasks, long shell jobs, desktop agent sessions, and unattended orchestrators.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37299 (2026-08-06) reports 75% of model-visible tool calls as wait-family calls, 83% of wait_agent calls timing out, ~137–141k input tokens per turn, and ~290M tokens in a day for one task.
2. OpenAI Codex issue #35259 (2026-07-24) reports wait/status polling alone accounting for 19.8% of raw local token volume.
3. OpenAI Codex issue #33999 (2026-07-18) reports repeated `wait(noop)` calls without any running exec cell.
4. Issue #36503 (2026-08-01) documents thousands of repeated continuation attempts against unchanged blocked state.

### Interpretation
The failure is architectural: polling cadence is expressed as model turns rather than runtime events. When state is unchanged, the model is still charged and the full context may be remetered. Stale agent state can keep the loop alive indefinitely.

## Existing approaches
- Fixed polling intervals and timeout-based waits.
- Cached-prefix inference.
- Manual stop/restart.
- Agent lifecycle status APIs.

## Remaining limitations
Fixed polling still invokes inference when nothing changed. Cache hits reduce compute but not necessarily metered usage. Stale status can defeat simple polling. Manual intervention is unsuitable for unattended workflows.

## Root-cause analysis
1. No separation between runtime waiting and model reasoning.
2. No deduplication of unchanged wait/status observations.
3. No exponential backoff tied to observed progress.
4. No circuit breaker for repeated timeout/no-op signatures.
5. No hard budget on coordination-only model turns.

## Improvement opportunity
Use runtime-side event waiting when possible; otherwise detect unchanged status signatures, back off polling, suppress model turns for no-change observations, and trip a circuit breaker after bounded repetitions. Resume inference only on state change, deadline, explicit failure, or human input.

## Relevant sources
- https://github.com/openai/codex/issues/37299
- https://github.com/openai/codex/issues/35259
- https://github.com/openai/codex/issues/33999
- https://github.com/openai/codex/issues/36503
