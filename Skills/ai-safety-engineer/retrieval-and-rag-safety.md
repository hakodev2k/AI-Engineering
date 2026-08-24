# Retrieval and RAG Safety

## Purpose
Secure retrieval-augmented AI systems against unauthorized access, poisoned content, injection, stale knowledge, and unsafe grounding.

## When to use
Use for systems that index documents, web content, tickets, email, code, or tenant knowledge bases.

## Inputs
Corpus sources, indexing pipeline, ACL model, retrieval configuration, chunking, ranking, prompt construction.

## Context to inspect
Provenance, tenant filters, freshness, ingestion trust, metadata, deletion, caching, and citations.

## Core knowledge
Retrieval expands the attack surface: malicious documents can inject instructions, ACL mistakes can leak data, and stale or low-quality sources can create confident errors.

## Procedure
1. Classify corpus sources by trust and sensitivity.
2. Preserve provenance and access metadata during ingestion.
3. Enforce authorization before returning chunks.
4. Separate retrieved content from trusted instructions.
5. Detect/quarantine suspicious ingestion where feasible.
6. Rank for relevance without discarding security filters.
7. Surface provenance to downstream logic and users when useful.
8. Define freshness and deletion semantics.
9. Test poisoned documents, cross-tenant queries, and indirect injection.
10. Monitor retrieval anomalies and source quality.

## Decision points
Do not retrieve sensitive content the caller cannot access. Prefer curated sources for high-consequence answers.

## Common failure patterns
ACLs applied after retrieval; shared caches leaking chunks; lost provenance; trusting document instructions; stale indexes after deletion.

## Verification
Run cross-tenant, poisoned-source, deletion, and stale-content tests end to end.

## Expected output
A secured RAG pipeline with provenance, authorization, ingestion controls, and adversarial evidence.

## Stop conditions
Block release if retrieval can bypass access controls or poisoned content can drive privileged actions.