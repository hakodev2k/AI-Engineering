# Hybrid Memory Retrieval

## Purpose
Combine structured lookup, keyword search, vector similarity, recency, graph relationships, and task context to retrieve the most useful memories.

## When to use
Use when pure vector search misses exact facts or pure structured search misses semantic relationships.

## Inputs
Memory schema, query intents, indexes, metadata, relevance judgments, latency and cost budgets.

## Preconditions
Have stable scope enforcement and representative retrieval queries.

## Context to inspect
Exact keys, full-text indexes, vector indexes, temporal fields, entity links, rerankers, and retrieval logs.

## Core knowledge
Different memory questions require different retrieval signals. Exact preferences may be keyed; historical episodes may need semantic search; temporal facts may need time filters. Fusion should be measured rather than assumed.

## Procedure
1. Classify retrieval intents.
2. Map each intent to candidate retrieval strategies.
3. Generate candidates from independent indexes.
4. Normalize scores and preserve source signals.
5. Apply authorization and validity constraints.
6. Deduplicate candidates.
7. Rerank using intent, recency, confidence, and relevance.
8. Set result and context budgets.
9. Log per-signal contribution.
10. Evaluate against single-strategy baselines.

## Decision points
Prefer deterministic lookup for known keys. Use hybrid fusion when query ambiguity or heterogeneous memory types justify it.

## Common failure patterns
Adding retrieval methods without evaluation; incomparable score scales; duplicate results; recency dominating durable facts; excessive context stuffing.

## Verification
Show hybrid retrieval improves task-level relevance or downstream answer quality over simpler baselines within latency targets.

## Expected output
A documented hybrid retrieval policy with measurable routing and ranking behavior.

## Stop conditions
Stop when evaluation data is too weak to distinguish retrieval strategies.