# Reindex and Verify

## Purpose
Restore a stale RAG index and prove that retrieval is aligned with the current source.

## When to use
Use only after investigation identifies stale index data and reindexing is an approved remediation.

## Inputs
Stale document IDs, source metadata, ingestion command/API, freshness policy, acceptance queries.

## Preconditions
Root cause identified; scoped reindex method known; production or destructive reindex has explicit human approval.

## Procedure
1. Snapshot failing freshness evidence.
2. Prefer scoped document reindex over full-index rebuild.
3. Confirm the operation does not delete or recreate production indexes unless separately approved.
4. Trigger the scoped ingestion operation.
5. Poll deterministic job status no more than three times; between retries preserve job ID and error payload.
6. Re-read source and index metadata.
7. Run the freshness gate again.
8. Execute representative retrieval queries and verify returned document versions/hashes match current source metadata.
9. Compare before/after evidence and report any residual stale records.

## Verification
Pass requires freshness gate status `pass`, zero stale sampled documents, and successful acceptance retrievals.

## Failure handling
Transient ingestion failures: maximum two retries. Validation failures: no automatic retry. Permission or production-change failures: stop for human action.

## Stop conditions
Stop on approval boundary, repeated ingestion failure, unexplained hash mismatch, or evidence that source data itself is inconsistent.
