# Research — Effective Context Compaction Calibrator

## Topic
Calibrating agent compaction thresholds against effective usable context and response runway.

## Category
Token

## Problem
Coding agents frequently configure compaction using a raw model context window or a static percentage even though the usable prompt budget is smaller because of effective-window scaling, output reserves, hidden tool/system overhead, provider-specific behavior, and model routing. A threshold that is mathematically 90% of the raw window can consume ~95% or more of usable context, leaving insufficient runway and causing repeated large prompts, abrupt compaction failures, or unrecoverable sessions.

## Why it matters now
Recent 2026 reports show this remains active. Codex issue #40095 measured a 244,800-token default threshold derived from a 272,000 raw window even though `/status` reported 258,400 usable tokens; compaction therefore occurred at 94.7% of usable context rather than 90%. Codex #39767 separately reports double-counted all-turn reasoning causing auto-compaction with substantial context remaining. Claude Code #85499 documents fatal compaction behavior after unknown-model window enforcement against third-party endpoints. Recent field research also shows cost grows steeply as accumulated context increases and recommends coupling context limits with response reserve.

## Affected users
- Developers running long coding-agent sessions.
- Platform teams routing across models/providers.
- Agent frameworks implementing compaction, summarization, or eviction.
- Teams paying for repeated large tool-heavy prompts.

## Current public evidence

### Observed evidence
1. **OpenAI Codex #40095, 2026-08-22.** Default auto-compaction used 90% of a raw 272k window while the effective usable window was 258.4k, causing a 94.7368% effective trigger. https://github.com/openai/codex/issues/40095
2. **OpenAI Codex #39767, 2026-08-20.** A separate token-accounting report states GPT-5.6 all-turn reasoning was double-counted, triggering auto-compaction with roughly 20% context remaining. https://github.com/openai/codex/issues/39767
3. **Anthropic Claude Code #85499, 2026-08-10.** New unknown-model window enforcement caused third-party-model sessions to enter a compaction path that could fail fatally and end the session. https://github.com/anthropics/claude-code/issues/85499
4. **LangWatch research, 2026-08-02.** Analysis of 287,748 API calls and 873 compactions found cumulative cost rises steeply with context size and measured a much smaller active-context footprint than accumulated context. https://langwatch.ai/research/finding-the-optimal-context-window
5. **WorkOS engineering article, 2026-08-14.** Recommends deriving effective context from compaction threshold plus response runway rather than blindly maximizing advertised context. https://workos.com/blog/coding-agent-context-window-compaction-settings

### Interpretation
The unresolved issue is not `always compact earlier`. Compaction policy often lacks a normalized model of effective prompt budget and required output runway. Both too-late and too-early compaction are harmful, so the threshold must be model-aware and measured.

## Existing approaches
- Static percentages of advertised context.
- Provider/model context metadata.
- Fixed response-token reserves.
- Manual `/compact`.
- Summarize-and-replace compaction.
- Prompt caching and tool-output trimming.

## Remaining limitations
- Raw and usable windows can differ.
- Hidden/system/tool overhead may not match UI percentages.
- Model/provider routing can change the effective limit mid-session.
- Output runway is often configured independently from compaction.
- Static ratios ignore workload call density and repeated prompt cost.
- Compaction failure may occur too late for recovery to fit.

## Root-cause analysis
1. Threshold arithmetic uses advertised/raw capacity instead of effective capacity.
2. Prompt budget and completion reserve are configured by different components.
3. Token accounting mixes provider usage, local estimates, cached tokens, reasoning tokens, and active occupancy.
4. Long tool loops amplify the cost of every extra token near the ceiling.
5. Model switches and third-party endpoints invalidate hard-coded assumptions.

## Improvement opportunity
Add a deterministic calibration step that computes usable context from model metadata, effective percentage, optional provider hard limit, and response reserve; then calculates a bounded trigger with enough runway to finish the next turn. Recompute when model/provider metadata changes.

## Proposed solution
A standard-library calibrator, reference policy, regression tests, enforceable rules, calibration skill, independent context-budget reviewer, bounded workflow, and preflight hook.

## Goal
Keep compaction in a measurable safe operating band: late enough to avoid unnecessary summary loss, early enough to preserve response runway and avoid high-cost near-ceiling loops.

## Metrics
- tokens/task
- input tokens per sampling call
- compactions/task
- compaction failure rate
- context utilization at compaction
- response runway
- cost/task
- latency/task
- result-quality regression rate

## Trigger
Session start, model/provider switch, context-window metadata change, or before a long tool-heavy phase.

## Inputs
Raw window, effective context percentage, optional provider hard limit, response reserve, target utilization, minimum headroom, current prompt size.

## Outputs
Effective window, safety ceiling, recommended trigger, current headroom, status, and reason codes.

## Relevant sources
- https://github.com/openai/codex/issues/40095
- https://github.com/openai/codex/issues/39767
- https://github.com/anthropics/claude-code/issues/85499
- https://langwatch.ai/research/finding-the-optimal-context-window
- https://workos.com/blog/coding-agent-context-window-compaction-settings
