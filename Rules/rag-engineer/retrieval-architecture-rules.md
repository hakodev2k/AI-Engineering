# Retrieval Architecture Rules

## Purpose
Define durable boundaries for retrieval-augmented generation systems.

## Scope
Retrievers, indexes, ranking stages, context assembly, model boundaries, and external dependencies.

## MUST
- Retrieval architecture MUST separate ingestion, indexing, retrieval, ranking, and generation responsibilities.
- Each stage MUST expose measurable inputs, outputs, latency, and failure behavior.
- Architecture changes MUST document effects on recall, precision, latency, cost, freshness, and operational risk.
- External dependencies MUST have timeout, retry, and degradation strategies.

## MUST NOT
- MUST NOT couple generation logic directly to storage-specific implementation details.
- MUST NOT introduce hidden retrieval stages that cannot be independently observed or evaluated.

## SHOULD
- Prefer replaceable interfaces for retrievers, rerankers, and embedding providers.
- Prefer reversible architecture changes.

## Exceptions
Exceptions require documented rationale, alternatives considered, risks, and verification evidence.

## Verification
Review architecture diagrams, interfaces, dependency tests, telemetry, and change records.