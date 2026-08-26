# Research — Prompt Cache Collapse Session Profiler

**Category:** Token  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Detecting and verifying prompt-cache collapse in large AI coding sessions.

## Problem
Long sessions can abruptly stop reusing most of an existing prompt prefix and begin rewriting very large context segments. This increases token consumption and latency and is difficult to diagnose from ordinary UI behavior.

## Why it matters now
Independent August 2026 reports describe repeated large cache rewrites, TTL regressions, and context-management disruption across current coding-agent clients.

## Affected users
Developers using long-context coding agents, platform teams monitoring LLM cost/latency, and agent-framework maintainers.

## Current public evidence
### Observed evidence
1. Claude Code issue #85326, opened August 9, 2026, reports a ~950k-token session repeatedly dropping cache reuse to a much smaller prefix and rewriting nearly the full context: https://github.com/anthropics/claude-code/issues/85326
2. Claude Code issue #83542, opened August 3, 2026, reports 17 prompt-cache drops in roughly three hours and about 10.4M redundant cache-write tokens in one affected session: https://github.com/anthropics/claude-code/issues/83542
3. Claude Code issue #84253, opened August 5, 2026, reports that versions 2.1.218+ stopped requesting a 1-hour prompt-cache TTL, causing full rewrites after gaps longer than the shorter cache window: https://github.com/anthropics/claude-code/issues/84253
4. OpenAI Codex issue #40326, opened August 24, 2026, reports repeated context compaction/reconnection disrupting active threads, showing that large-session context lifecycle remains an active engineering problem beyond one client: https://github.com/openai/codex/issues/40326

### Interpretation
These signals do not prove a single vendor-independent root cause. They do establish a recurring engineering need for request-level observability that distinguishes normal incremental cache writes from sustained collapse and correlates the anomaly with version, TTL, context and orchestration events.

## Existing approaches
- Provider prompt caching and TTL controls.
- Context compaction and summarization.
- Session restarts.
- Manual transcript inspection.
- OpenTelemetry/token usage fields where available.

## Remaining limitations
- Cache miss causes are often opaque.
- Large absolute token counts obscure whether reuse ratios are healthy.
- Manual inspection is slow and error-prone.
- One anomalous request may be expected, while repeated collapses are materially expensive.
- Aggressive context deletion can reduce correctness and is not an acceptable default fix.

## Root-cause analysis
Potential root causes must be separated rather than assumed: TTL expiry or regression; prompt-prefix mutation; tool/schema changes; compaction/reconnect behavior; client version mismatch; provider-side cache eviction. The shared diagnostic weakness is missing normalized telemetry and episode detection.

## Improvement opportunity
Create a deterministic profiler that computes cache-read and cache-write ratios per request, detects consecutive low-read/high-write requests above a context-size floor, estimates redundant rewritten tokens, and records event markers for root-cause correlation. Optimize only after a baseline and verify quality does not regress.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85326
- https://github.com/anthropics/claude-code/issues/83542
- https://github.com/anthropics/claude-code/issues/84253
- https://github.com/openai/codex/issues/40326
