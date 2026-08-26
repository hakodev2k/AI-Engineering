# Research — Repeated Tool-Call Progress Watchdog

**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Deterministic detection and recovery for AI-agent tool loops that remain active without measurable task progress.

## Problem
Agents can repeatedly issue the same or equivalent tool calls, status checks, or continuation actions while consuming context and tokens but producing no meaningful state change.

## Why it matters now
Multiple August 2026 reports show this failure across independent agent stacks, including Codex automatic continuation, Vercel AI SDK loop controls, and unattended Hermes Agent missions.

## Affected users
AI-agent users, coding-agent developers, orchestration-framework maintainers, and engineering teams running unattended or long-duration tasks.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37800, opened August 10, 2026, reports an automatic continuation loop that repeatedly emitted continuation messages without meaningful progress while consuming tokens: https://github.com/openai/codex/issues/37800
2. Vercel AI issue #17606, opened July 21, 2026, requests a built-in repeated-identical-tool-call stop condition because step caps are too blunt and unrestricted loops can run indefinitely: https://github.com/vercel/ai/issues/17606
3. Hermes Agent issue #82304, opened August 9, 2026, describes an unattended poller continuing for hours after a cloud job completed because it checked the wrong response field, keeping a billed resource alive: https://github.com/NousResearch/hermes-agent/issues/82304
4. OpenAI Codex issue #38132, opened August 12, 2026, reports a coordinator entering a tool-selection loop while trying to inspect subagent status: https://github.com/openai/codex/issues/38132

### Interpretation
The recurring engineering gap is lack of a progress-aware, model-independent stop mechanism. Call count alone is insufficient; a useful long task may legitimately use many steps, while a stuck task can waste its entire cap.

## Existing approaches
- Fixed maximum steps or turns.
- Model-defined stop conditions.
- Timeouts.
- Retry limits.
- Manual cancellation and log inspection.

## Remaining limitations
- Step caps measure quantity, not progress.
- Timeouts react late and can terminate healthy slow work.
- Model-authored stop logic is not independent from the model that is looping.
- Exact byte equality misses semantically equivalent calls with reordered or incidental arguments.
- Systems often do not record a task-specific progress signal after every tool result.

## Root-cause analysis
1. No explicit observable definition of progress.
2. Tool-call fingerprints and state deltas are not tracked across steps.
3. Retry and continuation mechanisms are often independent and can amplify each other.
4. Stop decisions depend on the same model loop instead of a deterministic supervisor.
5. Recovery policies lack bounded retries and escalation criteria.

## Improvement opportunity
Use canonical tool-call fingerprints plus a progress ledger. Detect repeated or cyclic calls with no verified state change, stop after a configurable streak, and allow at most two recovery hypotheses before escalation. Preserve productive long-running tasks by resetting the no-progress counter only when evidence shows goal-relevant state change.

## Relevant sources
- https://github.com/openai/codex/issues/37800
- https://github.com/vercel/ai/issues/17606
- https://github.com/NousResearch/hermes-agent/issues/82304
- https://github.com/openai/codex/issues/38132
