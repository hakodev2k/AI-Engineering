# RAG Security

## Purpose
Assess adversarial risks introduced by retrieval-augmented generation.

## Scope
Ingestion, chunking, indexing, metadata, retrieval, reranking, context assembly, citations, and source permissions.

## MUST
- Test poisoned documents, malicious metadata, permission bypass, stale authorization, retrieval manipulation, and indirect injection.
- Verify source-level access controls survive indexing and retrieval.
- Distinguish retrieval failure from model failure in findings.

## MUST NOT
- Assume vector similarity provides trust or authorization.
- Allow untrusted retrieved text to silently acquire higher instruction authority.

## SHOULD
Test adversarial content across supported document types and ingestion paths.

## Exceptions
Excluded sources require documented reachability and authorization rationale.

## Verification
Inspect ingestion records, index metadata, retrieval traces, permission decisions, assembled context, and generated output.