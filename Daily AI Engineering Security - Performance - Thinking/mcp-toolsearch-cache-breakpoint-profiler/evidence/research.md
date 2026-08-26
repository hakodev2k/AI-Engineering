# Research — MCP ToolSearch Cache Breakpoint Profiler

**Category:** Performance  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Prompt-cache continuity regressions around progressive MCP tool discovery.

## Problem
Tool discovery can reduce the number of schemas initially exposed to a model, yet large discovery batches or unstable tool serialization can rebuild the prompt prefix and erase expected cache reuse. The resulting cost/latency penalty is often misdiagnosed as model slowness.

## Why it matters now
Claude Code issue #83756, opened August 4, 2026, reports that a single `ToolSearch` call loading roughly six or more MCP tool schemas can cause the next request to rebuild the entire prompt prefix. Separately, a production-data analysis published August 21, 2026 reports cache reuse around 90% within a coding-agent turn but about 55% across turn boundaries, showing that cache continuity is materially sensitive to agent orchestration boundaries. An August 24 benchmark of progressive tool discovery reports that a fixed reduced tool prefix did not automatically yield the expected cache behavior across 72 benchmark runs.

## Affected users
Coding-agent users with multiple MCP servers, platform builders using progressive tool discovery, teams paying for cached/uncached token usage, and latency-sensitive agent workflows.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #83756, opened August 4, 2026: https://github.com/anthropics/claude-code/issues/83756
2. Production-trace analysis published August 21, 2026: https://bizstack.tech/why-your-ai-coding-agent-keeps-reprocessing-the-same-context/
3. Progressive tool-discovery benchmark published August 24, 2026: https://tpiros.dev/blog/progressive-tool-discovery-prompt-caching/

### Interpretation
The unresolved engineering gap is observability around where cache continuity breaks. Schema-count reduction is useful, but batch size, ordering, serialization and request-boundary behavior must be measured from traces rather than assumed.

## Existing approaches
Progressive tool discovery, static schema pruning, provider prompt caching, tool-catalog compression, generic latency dashboards.

## Remaining limitations
Aggregate cache-hit ratios hide one-request collapses; teams rarely correlate discovery events with subsequent cache creation/read tokens; thresholds can shift across versions; minimizing schemas can degrade tool selection; optimization claims often omit before/after trace evidence.

## Root-cause analysis
Tool discovery mutates a prefix that providers may cache positionally; large batches change serialized schema state at once; ordering/descriptions may be unstable; session metrics aggregate over breakpoints; optimization is guided by raw schema count rather than marginal cache cost.

## Improvement opportunity
Use request-level telemetry to identify discovery events, compare pre/post cache-read and cache-creation tokens, estimate cache-rebuild cost, identify batch-size breakpoints, and recommend a bounded batch size only when measured improvement preserves required tool coverage.

## Trigger
Latency/cost regression after MCP enablement, ToolSearch, progressive discovery, or tool-catalog changes.

## Inputs
JSONL request telemetry with event type, schema count, cache-read tokens, cache-creation tokens, input tokens and latency.

## Outputs
Baseline metrics, detected breakpoints, candidate batch-size recommendation, verification status.

## Metrics
Cache-read ratio; cache-creation/input ratio; p50/p95 latency; input tokens/request; discovery batch size; estimated avoidable rebuild tokens.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83756
- https://bizstack.tech/why-your-ai-coding-agent-keeps-reprocessing-the-same-context/
- https://tpiros.dev/blog/progressive-tool-discovery-prompt-caching/
