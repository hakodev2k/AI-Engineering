# RAG and Retrieval Security Rules

## Purpose
Protect retrieval-augmented AI systems from unauthorized retrieval, poisoned content, cross-tenant leakage, and unsafe context construction.

## Scope
Applies to document ingestion, indexing, embeddings, vector search, metadata filtering, retrieval, reranking, and context assembly.

## MUST
- Authorization filters MUST be enforced before retrieved content is exposed to the model or user.
- Tenant and document permissions MUST be preserved through indexing and retrieval.
- Ingested content MUST be treated as untrusted and evaluated for malicious instructions and sensitive data exposure.
- Retrieval queries and results MUST be bounded to the requesting principal's authorized scope.
- Index updates and deletions MUST propagate access changes within an approved time bound.

## MUST NOT
- MUST NOT rely on the model to ignore unauthorized retrieved content after retrieval.
- MUST NOT mix tenants in a shared retrieval namespace without deterministic isolation controls.
- MUST NOT expose embeddings or metadata that leak protected information without explicit justification.

## SHOULD
- Record provenance for retrieved chunks.
- Test poisoning, permission-change, deletion, and cross-tenant scenarios.

## Exceptions
Exceptions require documented isolation design, risk assessment, compensating controls, and security approval.

## Verification
Run authorization tests, cross-tenant retrieval tests, ingestion adversarial tests, deletion-propagation checks, and inspect indexing metadata and access-control code.