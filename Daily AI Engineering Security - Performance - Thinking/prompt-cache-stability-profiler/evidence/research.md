# Research — Prompt Cache Stability Profiler

## Topic
Prompt Cache Stability Profiler

## Category
Performance

## Problem
Agent runtimes repeatedly send large stable prefixes: system instructions, tool schemas, skills, workspace metadata, and conversation history. Prompt caching can reduce latency/cost only while those prefixes remain byte/structure stable and provider cache policy remains valid. Small volatile fields, nondeterministic ordering, history reserialization, hook context mutation, or cache expiry can silently collapse cache hits and force large prefix reprocessing.

## Why it matters now
VS Code added an official Cache Explorer document approved 2026-07-29 specifically to diagnose prompt-cache misses and reduce token cost/latency. Multiple 2026 issues across VS Code and Claude Code report cache invalidation from per-session variables, nondeterministic subagent ordering, post-tool hook reserialization, long-call gaps, and long-session breakpoint movement.

## Affected users
- Developers running long coding-agent sessions.
- Agent-platform teams with large tool/skill/plugin inventories.
- Teams using BYOK/provider prompt caching.
- Multi-agent systems repeatedly sharing the same static prefix.

## Current public evidence

### Observed evidence
1. VS Code's official `Cache Explorer` docs (approved 2026-07-29) explain that prompt caching depends on matching request prefixes and provide tooling to compare consecutive requests for cache misses.
2. VS Code issue #323668 (opened 2026-06-30) reports a volatile per-session template variable inside a cached system prefix causing cold cache misses on BYOK Anthropic.
3. Claude Code issue #81077 (opened 2026-07-25) reports `PostToolUse additionalContext` being reserialized differently on later turns, invalidating cached history after the mutation point.
4. Claude Code issue #49038 reports nondeterministic subagent ordering in a tool description invalidating the static prefix on resume.
5. VS Code issue #321551 reports cache expiry during legitimate >5 minute agent gaps causing a large uncached next request; the issue remains open/backlog-candidate.
6. Claude Code issue #78720 reports dynamic git-status content inside a system prompt invalidating cache on resume when repository state changes.

### Interpretation
The unresolved engineering problem is not simply “use prompt caching.” Teams lack a provider-neutral regression gate that fingerprints static prompt segments, attributes the earliest divergence between two requests, distinguishes expected dynamic changes from accidental prefix drift, and measures the resulting cache-hit/cost/latency impact.

### Proposed solution
A deterministic prompt-cache stability profiler that normalizes request dumps into named segments, fingerprints stable regions, compares consecutive requests, reports the first divergence path, flags volatile fields in declared-static regions, calculates cache-hit metrics when usage telemetry is available, and fails CI/benchmarks when static-prefix stability regresses.

## Existing approaches
- Provider prompt caching.
- VS Code Cache Explorer / agent debug logs.
- Manual comparison of request payloads and token usage.
- Provider-specific cache breakpoints and TTL configuration.
- Prompt reduction/context pruning.

## Remaining limitations
- Cache misses can result from structural drift even when token counts barely change.
- Dynamic data inside static prefixes can invalidate everything after it.
- Nondeterministic list/order serialization is difficult to notice manually.
- Provider telemetry differs; some hosts expose cache-read/write tokens while others do not.
- TTL expiry and prefix mutation are different root causes but often appear only as “cache miss.”
- Existing context-size profilers measure volume, not stability between requests.

## Root-cause analysis
1. Volatile state is mixed into declared-static prompt regions.
2. Serialization order is not canonical.
3. Historical messages/tool results are mutated after first use.
4. Cache breakpoint placement changes with conversation growth.
5. Long tool/user waits exceed provider TTL.
6. Teams lack regression tests for request-prefix stability.

## Improvement opportunity
Make cacheability testable like an API contract: define which request segments should remain stable, fingerprint them, diff adjacent request dumps, and gate regressions before they silently multiply token cost and latency.

## Metrics
- Static-prefix fingerprint stability rate.
- Earliest divergence byte/path/segment.
- Cached input / total cache-eligible input.
- Cache creation tokens per turn.
- Uncached input tokens per turn.
- Latency before/after drift.
- Cost before/after drift when provider rates are supplied.
- Number of volatile keys found in static segments.

## Relevant sources
- VS Code Cache Explorer docs: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/agent-troubleshooting/cache-explorer.md
- VS Code #323668: https://github.com/microsoft/vscode/issues/323668
- VS Code #321551: https://github.com/microsoft/vscode/issues/321551
- Claude Code #81077: https://github.com/anthropics/claude-code/issues/81077
- Claude Code #49038: https://github.com/anthropics/claude-code/issues/49038
- Claude Code #78720: https://github.com/anthropics/claude-code/issues/78720
- Claude Code #76058: https://github.com/anthropics/claude-code/issues/76058

## Evidence status
Implemented: profiler and regression rules are provided by this package. Measured: requires real request dumps/usage telemetry. Verified: only after repeat-run comparison shows declared-static segments stable and cache metrics meet target thresholds.
