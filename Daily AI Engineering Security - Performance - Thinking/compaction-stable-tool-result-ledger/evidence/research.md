# Research — Compaction-Stable Tool Result Ledger

## Topic
Repeated historical tool outputs and lost deduplication state across context compaction.

## Category
Token

## Problem
Agent sessions can accumulate large tool outputs that are resent on later turns. Context compaction may shorten transcript text while discarding the fingerprints needed to avoid reading the same files/resources again.

## Why it matters now
### Observed evidence
1. **Hermes Agent #84857**, opened **2026-08-12**, reports tool outputs being resent every turn and `read_file` dedup state being lost after context compaction. The report cites cache-read versus input ratios around **15–18×** across sessions.  
   https://github.com/NousResearch/hermes-agent/issues/84857
2. **Hermes Agent #77320**, opened **2026-08-03**, reports historical messages replayed with bytes different from what was originally sent, breaking prompt-cache prefixes and causing full long-context re-prefill on follow-up turns.  
   https://github.com/NousResearch/hermes-agent/issues/77320
3. **Vercel AI #14170**, opened **2026-04-06**, reports dynamic `activeTools` changes busting provider prompt caches because request structure changes between steps.  
   https://github.com/vercel/ai/issues/14170
4. **AgentSysBench (arXiv:2608.15127)**, published **2026-08-15**, identifies context/tool-schema overhead as a control-plane tax and reports substantial redundant search/fetch operations.  
   https://arxiv.org/abs/2608.15127

## Affected users
Long-running coding-agent users, RAG/agent platform teams, provider customers paying repeated input/cache traffic, and local-model users suffering long re-prefill latency.

## Existing approaches
Raw-output byte caps, transcript summarization, proactive compaction, prompt/prefix caching, in-memory read deduplication, and retrieval of prior observations.

## Remaining limitations
- In-memory dedup can vanish at compaction/restart.
- Summary-only compression can lose exact provenance/freshness.
- Byte caps do not prevent retransmitting the same capped content.
- Prefix caches are sensitive to reconstructed history/tool structures.
- Re-fetching sources is only safe when freshness/permissions are considered.

## Root-cause analysis
1. Tool-result identity is implicit in transcript text.
2. Transcript compaction and dedup state evolve independently.
3. Prompt assembly is not always replay-stable.
4. Raw results are treated as conversation text instead of addressable artifacts.
5. Relevance/freshness decisions often occur after content is already loaded.

## Interpretation
The engineering gap is state projection: dedup/reference state must survive transcript compaction.

## Proposed solution / Improvement opportunity
Persist stable tool-result fingerprints, provenance, safe summaries, size, freshness, and relevance metadata in a separate ledger. Project unique compact references under a budget and rehydrate raw source only when needed.

## Goal
Lower tokens/cost/latency while preserving correctness and critical context.

## Metrics
Tokens/task, duplicate projected bytes, raw re-injections, cache behavior, latency, retrieval precision, quality regression rate.

## Trigger
High context usage, frequent compaction, repeated file/resource reads, or prompt-cache misses.

## Inputs
Tool results, provenance, task relevance, freshness, provider usage data.

## Outputs
Durable ledger plus bounded context projection.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/84857
- https://github.com/NousResearch/hermes-agent/issues/77320
- https://github.com/vercel/ai/issues/14170
- https://arxiv.org/abs/2608.15127
