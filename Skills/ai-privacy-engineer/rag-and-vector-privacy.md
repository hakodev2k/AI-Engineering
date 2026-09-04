# RAG and Vector Privacy

## Purpose
Engineer retrieval-augmented generation and vector-search systems so documents, chunks, embeddings, metadata, and retrieval results preserve tenant and user privacy boundaries.

## When to use
Use when implementing or reviewing RAG, semantic search, vector databases, document assistants, enterprise knowledge retrieval, or embedding migrations.

## Inputs
- Corpus sources and access model
- Chunking and embedding pipeline
- Vector store schema and metadata
- Retrieval and reranking logic
- Authentication/authorization model
- Retention/deletion requirements

## Context to inspect
Inspect ingestion code, ACL synchronization, metadata filters, namespaces, embedding provider configuration, vector backups, query logs, caches, rerankers, and prompt assembly.

## Core knowledge
Embeddings can retain sensitive semantic information and are not inherently anonymous. Retrieval privacy depends on propagating source authorization to chunk-level indexes and enforcing it server-side at query time. Deletion must cover source documents, chunks, embeddings, replicas, caches, and derived indexes.

## Procedure
1. Map source-level permissions and identities.
2. Define chunk-level ownership and authorization metadata.
3. Verify ingestion never drops access-control context.
4. Minimize sensitive metadata stored beside vectors.
5. Scope namespaces or filters to authenticated principals.
6. Ensure authorization filtering occurs before content reaches the model.
7. Test adversarial queries designed to retrieve unauthorized content.
8. Review embedding-provider disclosures and retention.
9. Define source-to-vector lineage for deletion and rebuilds.
10. Purge deleted content from primary indexes, replicas, and caches.
11. Monitor retrieval anomalies and ACL-sync failures.
12. Revalidate privacy boundaries after index or embedding-model migrations.

## Decision points
Use physical index separation for very strong isolation requirements; use metadata filtering when operational efficiency matters and the database provides reliable server-side enforcement. Do not depend on prompt instructions to prevent unauthorized retrieval.

## Common failure patterns
- Missing ACL metadata after chunking
- Client-side filtering only
- Stale permissions in the vector index
- Deleted documents remaining in embeddings or caches
- Cross-tenant nearest-neighbor retrieval
- Treating embeddings as non-personal by default

## Verification
Run positive and negative authorization tests, deletion propagation tests, stale-ACL simulations, and inspect actual vector-store queries to prove server-side scoping.

## Expected output
A privacy-safe RAG design with enforceable authorization, vector lineage, deletion propagation, provider controls, and tested isolation.

## Stop conditions
Escalate when source ACLs cannot be mapped reliably, server-side filtering is unavailable for required isolation, or deletion cannot be propagated through derived indexes.