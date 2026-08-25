# Research

## Topic
Silent reasoning / stream stalls in coding agents

## Category
Performance

## Problem
Long agent turns can remain in `Thinking` with no visible or tool progress. Some cases continue consuming tokens; others stop receiving useful stream events. Operators cannot reliably distinguish productive long reasoning from a stuck transport/runtime path using only a spinner.

## Why it matters now
Recent August 2026 reports affect both Codex and Claude Code, including fresh-chat reproduction and large time/token loss. The failure recurs across unrelated projects/backends.

## Affected users
Developers using desktop/CLI coding agents, multi-agent coordinators, platform teams running long agents, and teams paying for reasoning-heavy turns.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39859, opened **2026-08-21**, reports repeated Desktop tasks stuck on `Thinking`; 14 interrupted turns ran at least one minute, seven exceeded five minutes, and three long turns recorded about 237k local model-request tokens with only 834 output tokens. https://github.com/openai/codex/issues/39859
2. Anthropic Claude Code issue #82996, opened **2026-07-31**, reports recurring indefinite thinking while usage keeps increasing and no output/tool calls appear. https://github.com/anthropics/claude-code/issues/82996
3. Claude Code issue #87116, opened **2026-08-16**, reports intermittent silent mid-turn stalls with no error/timeout across native Anthropic API and DeepInfra, including a case lasting over 13 hours. https://github.com/anthropics/claude-code/issues/87116
4. Codex issue #38160, opened **2026-08-12**, shows a distinct observability condition: reasoning tokens can be non-zero while the UI has no readable reasoning summary because only encrypted content/empty summary is exposed. https://github.com/openai/codex/issues/38160

### Interpretation
A visible `Thinking` state is not sufficient evidence of progress. Token-active/action-silent work, event/transport silence, and missing human-readable reasoning telemetry need separate handling. A watchdog should use event/timing/usage metadata, never hidden reasoning text.

## Existing approaches
Manual interrupt/retry; provider/request timeout; `max_tokens`; UI spinner/live token counter; generic task/token spend caps; client-specific reconnect logic.

## Remaining limitations
Long timeouts waste time; short timeouts cancel legitimate reasoning. Token caps react after burn. Reasoning summaries are not guaranteed visible and are not progress or correctness oracles. Blind retry can repeat the same stall. Event formats differ across runtimes.

## Root-cause analysis
1. UI activity and backend event activity are conflated.
2. Private/encrypted reasoning cannot be used as visible progress.
3. Stream liveness, model compute, and action progress are not separately measured.
4. Recovery starts without evidence classification, causing identical retries.
5. No-progress budgets are often whole-task rather than per-turn/event-gap.

## Improvement opportunity
Normalize observable metadata into a small ledger, classify silent-token burn separately from event-stream silence, enforce bounded recovery, and compare identical workloads before/after.

## Goal
Detect silent stalls early without cancelling known-good long reasoning; reduce wasted latency/tokens with measurable evidence.

## Metrics
p95 visible-progress gap, stalled turns/100 turns, silent tokens/turn, time-to-interrupt, false-cancel rate.

## Trigger
Any turn exceeding the team's normal visible-progress gap or a report of `Thinking` with no output/tool activity.

## Inputs
Timestamped event ledger with event kind and optional cumulative token usage.

## Outputs
Classification (`healthy`, `silent_token_burn`, `event_stream_stall`, `terminal`), evidence summary, deterministic exit code.

## Proposed solution
Use the package workflow and watchdog implementation; no chain-of-thought is inspected.

## Relevant sources
- https://github.com/openai/codex/issues/39859
- https://github.com/anthropics/claude-code/issues/82996
- https://github.com/anthropics/claude-code/issues/87116
- https://github.com/openai/codex/issues/38160
