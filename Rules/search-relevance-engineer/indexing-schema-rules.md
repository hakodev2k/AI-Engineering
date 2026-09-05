# Indexing and Schema Rules

## Purpose
Protect retrieval quality and compatibility through controlled index and schema design.

## Scope
Applies to searchable fields, analyzers, mappings, embeddings, stored fields, index versions, and reindexing.

## MUST
- Index schema changes MUST document expected retrieval impact and compatibility requirements.
- Field analyzers and tokenization MUST match the semantics of the indexed content and supported languages.
- Reindexing changes MUST be validated against representative queries before production cutover.
- Index version and source data version MUST be traceable for production results.

## MUST NOT
- MUST NOT remove or repurpose fields used by ranking or filters without dependency analysis.
- MUST NOT change analyzers in place when doing so can make old and new documents incomparable.
- MUST NOT perform irreversible production reindex cutovers without rollback or parallel-index strategy.

## SHOULD
- Prefer immutable index versions with controlled alias or routing switches.
- Keep schema evolution backward-compatible when practical.

## Exceptions
Require documented migration plan, risk, verification, and approval.

## Verification
Inspect mappings, analyzers, index metadata, reindex tests, query diffs, and cutover plans.