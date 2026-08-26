# RAG Poisoning and Retrieval Abuse

## Purpose
Assess whether adversarial documents, metadata, or retrieval manipulation can corrupt AI answers, leak data, or inject instructions.

## When to use
Use for systems that index internal, user-uploaded, web, partner, or otherwise mutable content.

## Inputs
Ingestion pipeline, chunking strategy, embedding/search configuration, ACL model, ranking logic, prompts, corpus samples, and provenance data.

## Context to inspect
Trace ingestion through indexing, retrieval, reranking, prompt construction, citation, and authorization. Identify who can create or modify indexed content.

## Core knowledge
RAG expands the attack surface through poisoned content, malicious metadata, ranking manipulation, cross-tenant retrieval, stale ACLs, hidden instructions, and source spoofing. Retrieved text must remain untrusted.

## Procedure
1. Define protected corpora and trust levels.
2. Seed isolated adversarial documents with controlled markers.
3. Test ranking manipulation and query-triggered payloads.
4. Test indirect prompt injection from retrieved chunks.
5. Attempt cross-user and cross-tenant retrieval.
6. Test metadata and citation spoofing.
7. Evaluate deletion, ACL change, and re-index propagation.
8. Measure retrieval quality impact of mitigations.
9. Add poisoning cases to ingestion and retrieval regression suites.

## Decision points
Apply authorization before content reaches the model. Prefer provenance and trust-aware retrieval when mixed-trust corpora are unavoidable.

## Common failure patterns
Filtering only at ingestion; assuming vector similarity implies trust; stale permissions; displaying citations without source validation; letting retrieved instructions control tools.

## Verification
Confirm poisoned content cannot cross authorization boundaries or control privileged actions, and mitigations preserve acceptable retrieval relevance on benign queries.

## Expected output
Evidence-backed poisoning scenarios, affected pipeline stages, mitigations, and regression tests.

## Stop conditions
Stop if testing risks contaminating shared production indexes or exposing data belonging to users outside the authorized scope.