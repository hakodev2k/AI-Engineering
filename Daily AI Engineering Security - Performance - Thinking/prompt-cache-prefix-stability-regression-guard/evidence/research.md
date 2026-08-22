# Research — Prompt Cache Prefix Stability Regression Guard

## Topic
Prompt-cache misses and token overhead from unstable prefixes in tool-heavy agents.

## Category
Token / Performance

## Problem
Agents with large system prompts, tool schemas, memory blocks, and repository context can repeatedly pay to process the same input when early request bytes change between otherwise equivalent turns. Tool schemas and volatile fields can dominate input size, and context compaction can rebuild prefixes in ways that invalidate cache reuse.

## Why it matters now
Recent 2026 agent-framework issues report significant uncached tool-schema overhead and request cache-aware context management. Current VS Code and cloud-provider documentation also exposes cache-hit diagnostics and describes exact-prefix stability as a core condition for prompt caching.

## Affected users
Agent platform teams, coding-agent users, RAG/tool orchestration developers, organizations with many registered tools, and teams optimizing model latency/cost.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #20880 reports a real tool-heavy setup with about 11.8K tool-schema tokens repeatedly uncached and describes roughly 70% input-token overhead despite prompt caching: https://github.com/NousResearch/hermes-agent/issues/20880
2. Hermes Agent issue #68489 (July 21, 2026) requests cache-first context management using provider cache-hit/miss telemetry and cites >90% cache-hit behavior as an optimization target for stable prefixes: https://github.com/NousResearch/hermes-agent/issues/68489
3. VS Code documentation approved July 29, 2026 introduces Cache Explorer specifically to diagnose prompt-cache misses by comparing consecutive model requests: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/agent-troubleshooting/cache-explorer.md
4. AWS agent toolkit prompt-caching guidance states that exact content stability matters and lists timestamps, reordered JSON keys, session tokens before cache points, and misplaced cache points as cache-fragmentation causes: https://github.com/awslabs/agent-toolkit-for-aws/blob/main/skills/core-skills/amazon-bedrock/references/prompt-caching.md
5. Azure AI Foundry documentation updated in July 2026 explains that prompt caching reduces latency/cost for longer prompts with identical content at the beginning: https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/openai/includes/how-to-prompt-caching-content.md

### Interpretation
Prompt caching exists, but its benefit is fragile when agent request construction is unstable. The gap is not merely “enable caching”; teams need observable component-level baselines and deterministic regression checks that catch prefix churn introduced by code/config changes.

### Proposed solution
Profile request components, define a correctness-preserving stable prefix, canonicalize deterministic structures such as tool schemas, move volatile metadata after cacheable static content where semantics allow, and fail regressions when the stable-prefix fingerprint unexpectedly changes or cacheable size deteriorates.

## Existing approaches
- Provider-native automatic or explicit prompt caching.
- Manual cache-control breakpoints.
- Prompt reordering and static system prompts.
- Cache diagnostics from provider usage fields and IDE tooling.
- Context compaction/summarization to lower total input size.

## Remaining limitations
- “Caching enabled” does not prove cache hits occur.
- Dynamic timestamps/session IDs before cache points can silently fragment reuse.
- Tool registration order or non-canonical JSON serialization can change prefixes without semantic changes.
- Compaction may save context-window tokens but rebuild the prefix and reduce provider cache reuse.
- Provider metrics show the symptom but may not identify which component changed.
- Removing context to save tokens risks correctness and security regressions.

## Root-cause analysis
1. Stable and volatile request components are not explicitly modeled.
2. Serialization order is not deterministic.
3. Tool schemas are large and often placed in repeatedly processed regions.
4. Context rebuilds can alter early bytes even when task semantics are unchanged.
5. Cache metrics are not tied back to request-component fingerprints.
6. Optimization lacks regression fixtures for output quality and safety.

## Improvement opportunity
Introduce a provider-agnostic preflight profiler that fingerprints ordered components and compares them with a known-good baseline. Pair deterministic checks with provider cache-hit telemetry to distinguish request-construction regressions from provider TTL/model behavior.

## Goal
Reduce uncached repeated input while preserving required context, correctness, and security.

## Metrics
- Stable-prefix fingerprint change rate.
- Stable-prefix bytes and estimated tokens.
- Tool-schema bytes/tokens.
- Cache hit tokens / eligible cacheable tokens.
- Input cost/task and p50/p95 latency/task.
- Quality/security regression rate: 0 critical regressions.

## Trigger
Agent/runtime changes affecting prompt assembly, tool registration, compaction, memory injection, middleware, provider routing, or cache configuration.

## Inputs
Ordered request-component manifest, optional prior baseline, cache policy, optional provider usage telemetry.

## Outputs
Component profile, stable-prefix fingerprint, volatility findings, baseline deltas, pass/fail result, and optimization evidence.

## Relevant sources
- Hermes #20880: https://github.com/NousResearch/hermes-agent/issues/20880
- Hermes #68489: https://github.com/NousResearch/hermes-agent/issues/68489
- VS Code Cache Explorer: https://github.com/microsoft/vscode-docs/blob/main/docs/agents/agent-troubleshooting/cache-explorer.md
- AWS prompt caching guide: https://github.com/awslabs/agent-toolkit-for-aws/blob/main/skills/core-skills/amazon-bedrock/references/prompt-caching.md
- Azure prompt caching guide: https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/openai/includes/how-to-prompt-caching-content.md
