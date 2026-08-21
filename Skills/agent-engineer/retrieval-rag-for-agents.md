# Retrieval and RAG for Agents

## Purpose
Give agents grounded access to large or changing knowledge without flooding context or confusing authority.

## When to use
Use when required knowledge exceeds prompt limits, changes frequently, or must be sourced from controlled repositories.

## Inputs
Corpus, query patterns, metadata, permissions, freshness requirements, evaluation questions.

## Context to inspect
Document structure, ingestion pipeline, chunking, indexes, ACLs, ranking, citation/provenance support, and update cadence.

## Core knowledge
Retrieval quality depends on corpus quality, chunking, query formulation, filtering, ranking, and permission enforcement. Vector similarity alone is not sufficient for every corpus.

## Procedure
1. Define answerable task classes and authoritative sources.
2. Clean and segment documents around semantic units.
3. Preserve metadata, provenance, timestamps, and ACLs.
4. Choose lexical, vector, hybrid, or structured retrieval by evidence.
5. Apply metadata filters before exposing results.
6. Retrieve a bounded candidate set and rerank when justified.
7. Instruct the agent to distinguish evidence from inference.
8. Handle missing/conflicting evidence explicitly.
9. Evaluate retrieval recall separately from answer quality.
10. Monitor stale indexes and permission regressions.

## Decision points
Use structured queries for structured facts; semantic retrieval for fuzzy text; hybrid approaches when both matter.

## Common failure patterns
Bad chunk boundaries, stale indexes, ACL leakage, retrieving too much, no provenance, and blaming generation for retrieval misses.

## Verification
Measure retrieval recall, grounded answer accuracy, permission isolation, freshness, and citation correctness.

## Expected output
A retrieval pipeline with measurable quality and enforceable access controls.

## Stop conditions
Stop when source authority or access rules cannot be established.