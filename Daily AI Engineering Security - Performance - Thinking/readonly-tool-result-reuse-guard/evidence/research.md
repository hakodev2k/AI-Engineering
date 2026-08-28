# Research — Read-Only Tool Result Reuse Guard

**Topic:** Repeated unchanged read-only tool results consume context and trigger unnecessary compaction  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
AI coding and agent runtimes often re-read the same files, directories, diagnostics, or search results and append the full payload again even when unchanged.

## Why it matters now
Tool-heavy workloads are long-running and stateful; recent public evidence shows repeated observations and control-plane context are material costs.

## Affected users
AI coding-assistant users, framework maintainers, platform teams, and operators paying for model input tokens.

## Current public evidence

### Observed evidence
1. Docker Agent issue #3939, opened 2026-08-07, reports unchanged read-only results being resent in full across turns; it explicitly identifies repeated file reads, directory listings, and diagnostics as token/context waste. https://github.com/docker/docker-agent/issues/3939
2. AgentSysBench (arXiv:2608.15127, 2026-08-15) reports heavy cross-request redundancy in search/web fetches and a control-plane tax from tool schemas and observations. Its tool-result caching exploration removed 35.2% of redundant search calls and saved 19.3% aggregate search latency. https://arxiv.org/abs/2608.15127
3. GitHub's 2026 agentic-workflow token audits, reported by InfoQ, identify duplicated reads/shared intermediate artifacts as an optimization target after observed workflow-level token reductions. https://www.infoq.com/news/2026/05/github-agentic-token-savings/

## Existing approaches
Truncation, compaction, provider prompt caching, generic caches, manual avoidance.

## Remaining limitations
Truncation bounds a single result, not repetition. Compaction happens after waste enters context. Prompt caching does not prove freshness. Generic caches can be stale without dependency-aware invalidation.

## Root-cause analysis
Tool/result identity is not first-class context metadata; dependency versions are often absent; context assembly treats each result as novel; optimization is reactive rather than preventive.

## Improvement opportunity
Add a deterministic gate before context append. Canonicalize eligible tool+arguments, fingerprint payload and dependencies, and replace only exact unchanged repeats with a compact stable reference. Fall back to full content on uncertainty.

## Goal
Reduce tokens and latency without critical context loss.

## Metrics
Tokens/task, repeated bytes, hit rate, avoided bytes, compactions, latency, quality regression, stale-reuse incidents.

## Trigger
Before appending a read-only tool result.

## Inputs
Tool, arguments, payload, dependency fingerprint, timestamp, policy.

## Outputs
`send_full` or `reuse_reference` with reason and hashes.

## Relevant sources
- https://github.com/docker/docker-agent/issues/3939
- https://arxiv.org/abs/2608.15127
- https://www.infoq.com/news/2026/05/github-agentic-token-savings/

### Interpretation
The unresolved problem is not merely oversized output; it is repeated unchanged evidence entering context without a freshness contract.

### Proposed solution
Dependency-aware exact-result reuse with correctness-preserving fallback.
