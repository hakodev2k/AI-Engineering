# Research

## Topic
Agent Latency Attribution Profiler

## Category
Performance

## Problem
Coarse timing can conflate human approval, queueing, framework overhead, tool execution, propagation, and resume delay.

## Why it matters now
### Observed evidence
1. Codex #38731 (2026-08-15) reports approval-gated elapsed time interpreted as underlying command/request slowness, followed by false technical explanations and plan changes.
2. Codex #40087 (2026-08-22) requests per-tool timing that distinguishes actual execution from Codex overhead/waiting.
3. Claude Code #81258 (2026-07-25) reports ~5–10s fixed latency around MCP calls and built-in `Glob`, including cases with no network I/O.
4. OpenAI Agents SDK traces task/agent/turn/generation/function spans; OpenTelemetry GenAI observability defines model/agent/tool spans and duration metrics. These provide instrumentation foundations but do not automatically prove which sub-phase caused a coarse tool delay.

## Affected users
Agent developers, platform teams, coding-agent users, MCP/tool authors, observability engineers.

## Existing approaches
Wall-clock logs, function spans, OpenTelemetry, OpenAI Agents SDK tracing, LangSmith, manual command timing.

## Remaining limitations
One timer can cover multiple lifecycle states; approval can dwarf command runtime; missing boundaries invite speculative diagnosis; verbose payload tracing can expose sensitive data.

## Root-cause analysis
One span wraps multiple states; approval is modeled as blocked execution; dispatch/result boundaries are absent; displayed elapsed time is treated as causal evidence.

## Improvement opportunity
Capture low-cardinality phase events, derive mutually exclusive durations, require baseline/coverage before optimization, and compare distributions after change.

## Proposed solution
Deterministic JSONL profiler plus measurement rules, bounded optimization, regression verification, independent review.

## Relevant sources
- https://github.com/openai/codex/issues/38731
- https://github.com/openai/codex/issues/40087
- https://github.com/anthropics/claude-code/issues/81258
- https://openai.github.io/openai-agents-js/guides/tracing/
- https://openai.github.io/openai-agents-python/tracing/
- https://opentelemetry.io/blog/2026/genai-observability/
