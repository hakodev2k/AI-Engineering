# RAG Data Exfiltration Detection

## Purpose
Detect attempts to retrieve, infer, or disclose sensitive knowledge through retrieval-augmented generation systems beyond the requester's authorization or intended scope.

## When to use
Use for AI applications backed by enterprise search, vector databases, document stores, knowledge graphs, or tenant-specific corpora.

## Inputs
Retrieval logs, document identifiers, user identity, tenant, authorization outcomes, prompt/response metadata, chunk provenance, sensitivity labels, and query history.

## Preconditions
Retrieved content can be tied to source documents and requesting principals.

## Context to inspect
Inspect ingestion pipelines, ACL propagation, chunking, embeddings, vector search filters, reranking, context assembly, citation logic, and response filtering.

## Core knowledge
RAG exfiltration may occur through direct access-control failure, inference across many permitted fragments, prompt injection inside retrieved documents, or repeated enumeration. Detection must correlate retrieval scope with identity and sensitivity.

## Procedure
1. Classify indexed sources by sensitivity and tenant.
2. Validate that retrieval events preserve source and authorization metadata.
3. Baseline normal retrieval breadth and document-access patterns.
4. Detect cross-tenant results, denied-source probing, high-volume enumeration, and unusual sensitive-source concentration.
5. Correlate retrieved sources with final model output when feasible.
6. Identify document-borne prompt injection indicators.
7. Escalate successful unauthorized retrieval above failed probing.
8. Test with boundary, enumeration, and indirect-injection scenarios.
9. Tune for legitimate research and administrative workflows.

## Decision points
Prefer source-level authorization before retrieval over output-only filtering. Use hard containment for confirmed cross-tenant access; use investigation for unusual but authorized breadth.

## Common failure patterns
Assuming vector search respects source ACLs automatically, logging only final answers, losing document provenance, and treating citations as proof that access was authorized.

## Verification
Implemented means sensitive retrieval patterns are observable. Verified means seeded unauthorized-access tests trigger alerts and authorized equivalent queries remain functional.

## Expected output
RAG detections, sensitivity mappings, test cases, escalation criteria, and documented blind spots.

## Stop conditions
Escalate immediately on confirmed cross-tenant or regulated-data exposure, or when source authorization cannot be reconstructed.