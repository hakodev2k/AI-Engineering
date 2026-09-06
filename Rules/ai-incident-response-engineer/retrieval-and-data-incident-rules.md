# Retrieval and Data Incident Rules

## Purpose
Investigate AI failures caused or amplified by retrieval, indexing, source data, embeddings, permissions, or data freshness.

## Scope
Applies to RAG systems, vector search, knowledge stores, indexing pipelines, grounding data, and model input datasets.

## MUST
- Investigation MUST identify source documents, index/version, retrieval query, filters, ranking results, and authorization context when relevant.
- Data freshness, ingestion failures, stale indexes, missing records, duplication, and permission leakage MUST be considered for retrieval incidents.
- Security incidents involving retrieval MUST verify whether access controls were enforced before content entered model context.
- Remediation MUST preserve data lineage and avoid silently changing authoritative source meaning.
- Reindexing or bulk deletion in production MUST have impact analysis, rollback/rebuild strategy, and approval when destructive.

## MUST NOT
- Retrieved content MUST NOT be assumed correct merely because it came from an approved store.
- Sensitive source content MUST NOT be copied into unrestricted incident artifacts.
- Investigators MUST NOT modify source data solely to make a failing test pass without validating business correctness.

## SHOULD
- Compare retrieval results before and after remediation using representative queries.
- Maintain reproducible snapshots or version identifiers for critical indexes where feasible.

## Exceptions
If historical index state cannot be recovered, document the limitation and use available logs or snapshots to bound the failure.

## Verification
Inspect retrieval traces, source permissions, index metadata, ingestion health, query results, data lineage, and regression evaluations.