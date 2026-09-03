# Retrieval Trust and Content Provenance

## Purpose
Control how agents trust, rank, and act on retrieved content so untrusted or poisoned sources cannot silently become authoritative instructions.

## When to use
Use for RAG, enterprise search, web retrieval, document agents, knowledge bases, or any workflow that injects external content into model context.

## Inputs
Retrieval architecture, source inventory, access controls, ranking logic, metadata, ingestion pipeline, and downstream actions.

## Preconditions
Classify sources by trust level and determine whether retrieved material is evidence, user data, policy, or executable instruction.

## Context to inspect
Connectors, crawlers, vector stores, indexes, chunk metadata, ACL filtering, reranking, citations, freshness handling, and ingestion permissions.

## Core knowledge
Retrieval quality and security are coupled. A semantically relevant document may still be malicious, stale, unauthorized, or low-authority. Provenance and access control must survive ingestion, indexing, retrieval, and presentation.

## Procedure
1. Inventory sources and assign trust classes.
2. Preserve source identity, timestamps, ownership, and ACL metadata during ingestion.
3. Enforce user/tenant authorization before retrieved content reaches the model.
4. Separate trusted policy from ordinary retrieved evidence.
5. Mark external instructions as untrusted data.
6. Validate freshness requirements for time-sensitive decisions.
7. Prefer higher-authority sources when evidence conflicts.
8. Limit retrieval breadth to reduce attack surface and context pollution.
9. Detect anomalous source changes and suspicious instruction-heavy content as secondary signals.
10. Require citations or source attribution for consequential answers where appropriate.
11. Test poisoned documents, ACL bypass, stale content, duplicate manipulation, and source spoofing.
12. Define removal and re-index procedures for compromised content.

## Decision points
Use trusted curated sources for policy decisions; use open-web or user-provided sources for evidence only unless separately validated. Do not allow relevance score alone to determine authority.

## Common failure patterns
Dropping ACLs during chunking, mixing policy and user documents in one undifferentiated index, trusting top-ranked text, missing deletion propagation, and stale cached embeddings.

## Verification
Prove unauthorized documents never enter model context, removed documents disappear from retrieval, and malicious content cannot override trusted instructions.

## Expected output
A source-trust model, provenance schema, retrieval authorization controls, and poisoning/ACL regression tests.

## Stop conditions
Escalate when provenance or ACL metadata cannot be preserved end to end.