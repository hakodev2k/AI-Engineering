# Testing

## Purpose
Provide deterministic regression protection for vector data, retrieval semantics, failure handling, and production-critical paths.

## Scope
Applies to unit, integration, end-to-end, relevance, migration, load, and failure tests.

## MUST
- Tests MUST cover schema validation, vector dimension/metric contracts, filters, tenancy boundaries, ingestion retries, updates, and deletes where applicable.
- Production-critical retrieval paths MUST have integration tests against behavior representative of the deployed database engine.
- Relevance regressions MUST be evaluated separately from functional correctness.
- Migration and recovery procedures MUST be tested before high-risk production use.
- Flaky tests MUST be investigated and fixed or explicitly quarantined with ownership and expiry.

## MUST NOT
- MUST NOT use retries to conceal deterministic test failures.
- MUST NOT rely exclusively on mocks for database-specific consistency, indexing, or query behavior.
- MUST NOT accept nondeterministic benchmark results without controlling or reporting variance.

## SHOULD
- Test datasets SHOULD include edge dimensions, malformed metadata, selective filters, duplicate IDs, deletions, and hard relevance cases.
- Failure injection SHOULD validate dependency outages and partial writes.
- Performance tests SHOULD run on representative scale for material changes.

## Exceptions
Exceptions require documented test gap, alternative evidence, risk, owner, and approval when critical coverage is waived.

## Verification
Inspect CI results, test inventory, relevance suites, integration environments, flaky-test records, load reports, and failure-injection evidence.