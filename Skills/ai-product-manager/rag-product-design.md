# RAG Product Design

## Purpose
Design retrieval-augmented AI experiences that improve grounding, freshness, provenance, and domain usefulness without treating retrieval as a universal fix.

## When to use
Use when product answers depend on private, fast-changing, or domain-specific knowledge that the base model should not be expected to know reliably.

## Inputs
Knowledge sources, user questions, freshness requirements, access controls, retrieval metrics, model context limits, citation requirements.

## Context to inspect
Source quality, document structure, permissions, chunking/indexing approach, retrieval logs, failure cases, update frequency, and downstream generation behavior.

## Core knowledge
RAG quality depends on ingestion, chunking, metadata, retrieval, ranking, context assembly, model synthesis, and access control. Better retrieval does not guarantee better answers if generation ignores evidence.

## Procedure
1. Define which user questions require external knowledge.
2. Identify authoritative source systems and ownership.
3. Specify freshness and permission requirements.
4. Define retrieval success metrics such as recall at k and evidence coverage.
5. Design citations or provenance appropriate to user trust needs.
6. Evaluate chunking, ranking, query rewriting, and context construction on representative cases.
7. Test no-answer and conflicting-source behavior.
8. Measure answer quality separately from retrieval quality.
9. Add production feedback cases to evals.

## Decision points
Use RAG for knowledge access; use fine-tuning primarily for behavior or style. Prefer deterministic search when users need exact record retrieval rather than synthesized answers.

## Common failure patterns
Indexing low-quality sources, missing ACL enforcement, excessive context, stale documents, hallucinated citations, and measuring answer fluency instead of evidence use.

## Verification
Verify source permissions, retrieval recall, citation correctness, answer groundedness, and graceful behavior when evidence is absent.

## Expected output
A product-level RAG design with source policy, retrieval requirements, trust UX, metrics, and failure handling.

## Stop conditions
Stop when source rights, access-control semantics, or authoritative ownership are unresolved.