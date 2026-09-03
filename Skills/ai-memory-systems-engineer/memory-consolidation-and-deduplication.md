# Memory Consolidation and Deduplication

## Purpose
Merge redundant or overlapping memories while preserving provenance, recency, and semantic distinctions.

## When to use
Use when repeated extraction creates duplicate preferences, facts, episodes, or summaries.

## Inputs
Stored memories, embeddings, normalized fields, timestamps, confidence, provenance, supersession rules.

## Preconditions
Know which memory types are mergeable and which must remain append-only.

## Context to inspect
Duplicate rates, retrieval noise, user corrections, memory graph relationships, and downstream ranking behavior.

## Core knowledge
Similarity does not imply equivalence. Consolidation must consider type, entity, time, polarity, confidence, and provenance. Episodic events generally should not be collapsed into mutable facts.

## Procedure
1. Partition candidates by identity and memory type.
2. Generate duplicate candidates using deterministic keys and semantic similarity.
3. Compare normalized values and temporal validity.
4. Detect contradiction versus redundancy.
5. Merge provenance and confidence where appropriate.
6. Preserve superseded records when auditability matters.
7. Recompute derived representations.
8. Validate retrieval before deleting redundant records.
9. Record consolidation decisions.
10. Monitor duplicate and false-merge rates.

## Decision points
Prefer exact-key deduplication for structured facts. Use semantic merging only with conservative thresholds and type-aware logic.

## Common failure patterns
Merging temporally distinct facts; deleting provenance; embedding-only equality; combining conflicting preferences; irreversible compaction.

## Verification
Replay representative retrieval queries and confirm consolidation reduces noise without removing distinct or historically relevant information.

## Expected output
A deterministic consolidation policy and auditable merge results.

## Stop conditions
Stop when conflicts cannot be resolved safely or merge semantics are undefined.