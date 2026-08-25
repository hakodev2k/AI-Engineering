# Research — Capability Context Budget Reconciliation Guard

## Topic
Detect whether disabling, hiding, deduplicating, or lazily loading agent capabilities actually reduces effective model context rather than moving the same tokens into another context bucket.

## Category
Token

## Problem
AI coding/agent hosts can eagerly inject tool schemas, skills, plugins, apps, connector metadata, and operating instructions at session start. A UI or configuration may report that a capability is hidden/disabled, yet the effective context can remain unchanged because the same content is serialized elsewhere or another inactive catalog is still injected. Teams therefore optimize the visible bucket without proving total context, cost, latency, or cache behavior improved.

## Why it matters now
Fresh 2026 reports show startup contexts containing large inactive capability catalogs and a Claude Code case where hiding skills reduced the Skills row but the exact token count reappeared under System tools. MCP's July 2026 specification simultaneously added deterministic `tools/list` ordering and cache hints to improve caching, underscoring that capability-catalog serialization and freshness are active protocol-level performance concerns.

## Affected users
Developers with many MCP servers/plugins/skills; agent-platform builders; teams operating long-context coding sessions; users paying for cold-prefix/context costs; maintainers optimizing startup latency or context-window headroom.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #37024 (2026-08-05) reports fresh sessions eagerly injecting inactive tool, plugin, app, and skill catalogs, including duplicate skill entries: https://github.com/openai/codex/issues/37024
2. Claude Code issue #85439 (2026-08-10) reports that hiding skills did not reduce total context; tokens removed from the Skills row reappeared in System tools with an exact 1:1 shift across three configurations: https://github.com/anthropics/claude-code/issues/85439
3. MCP issue #2808 / discussion #2812 (2026-05-28) documents substantial tool-schema token overhead and first-turn/cache-invalidation cost for many MCP tools: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808 and https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2812
4. MCP 2026-07-28 changelog states servers SHOULD return `tools/list` in deterministic order to improve prompt-cache hit rates and introduces `ttlMs`/`cacheScope` for cacheable results: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/changelog.mdx
5. OpenAI Codex issue #37299 (2026-08-06) reports wait/status orchestration repeatedly re-metering an accumulated ~140k-token context, illustrating why apparently small control-plane turns become expensive when effective context remains large: https://github.com/openai/codex/issues/37299

## Existing approaches
- Disable or hide unused skills/tools/plugins.
- Use tool search or lazy capability loading where supported.
- Deduplicate skill catalogs and shorten tool descriptions.
- Rely on prompt caching to amortize stable capability prefixes.
- Inspect UI category token counts such as Skills or System tools.
- Use deterministic capability ordering and protocol cache hints where supported.

## Remaining limitations
- A per-category reduction can be offset by equal growth in another category.
- UI accounting may describe presentation buckets rather than the provider-effective prompt.
- Disabling a capability does not prove its schema/instructions were removed from all serialization paths.
- Prompt caching reduces repeated billing/latency in some cases but does not recover context-window headroom and can be invalidated by catalog churn.
- Tool/skill deduplication can remove duplicate labels while duplicate serialized content survives elsewhere.
- Teams often compare one visible row instead of reconciling total tokens and category deltas before/after a change.

## Root-cause analysis
1. Capability metadata has multiple injection paths: tool schema, system-tool metadata, skill index, plugin/app instructions, connector manifests, and generic behavior contracts.
2. Context-accounting categories are implementation/UI concepts, not necessarily unique ownership boundaries.
3. Feature toggles can change visibility without changing underlying serialization.
4. Dynamic ordering or capability churn reduces prefix-cache reuse even when total tokens stay stable.
5. Optimizations are accepted based on local bucket metrics instead of total effective context plus task-quality regression evidence.

## Interpretation
The engineering gap is an accounting-integrity problem: context optimization needs before/after reconciliation of the whole effective prompt, not trust in one category or toggle state.

## Improvement opportunity
Create a deterministic budget reconciler that compares baseline and candidate context snapshots, enforces a maximum total budget, requires expected removals to produce a minimum effective total-token reduction, and flags compensating growth in unrelated categories. Pair this with quality checks so required context is never removed merely to save tokens.

## Proposed solution
This package provides a no-dependency comparison script, budget policy example, enforceable token rules, a context verifier subagent, a bounded measure-reconcile-optimize workflow, and a regression hook. The guard does not claim semantic equivalence; it requires host teams to attach task-quality regression evidence before completion.

## Goal
Prove that capability-context changes reduce effective context/cost/latency without silently relocating tokens or removing correctness-critical context.

## Metrics
- total_tokens before/after
- effective_reduction_tokens and reduction ratio
- category token deltas
- category displacement count
- cold-start input tokens and latency
- prompt-cache hit/read/create metrics when available
- task quality/pass rate and regression rate
- tokens/task and cost/task

## Trigger
Capability enable/disable changes, skill/tool deduplication, plugin/app installation changes, tool-search/lazy-loading rollout, schema compression, MCP catalog updates, or host upgrades that alter context accounting.

## Inputs
Baseline context snapshot JSON, candidate snapshot JSON, budget policy JSON, and independent task-quality regression results.

## Outputs
Pass/regression status, effective total-token reduction, category growth map, budget violations, and blocking exit code.

## Relevant sources
All sources above are public and summarized. Reported behavior is separated from this package's proposed reconciliation and enforcement design.