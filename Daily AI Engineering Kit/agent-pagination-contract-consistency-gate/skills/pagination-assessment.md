# Pagination Consistency Assessment Skill

## Purpose
Prove that a paginated API/query preserves deterministic ordering and does not create duplicates, gaps, contract drift, or unbounded reads while records are added or updated between page requests.

## When to use
Use for new or changed REST/GraphQL/list endpoints, EF Core/SQL pagination, cursor/keyset migrations, performance refactors, or incidents involving missing/duplicated list items.

## Inputs
Endpoint/query entry point, pagination request/response contract, ordering fields, continuation-token semantics, page-size limits, data mutation behavior, relevant tests and query plans when available.

## Preconditions
Repository and target endpoint are identifiable. Non-destructive local/test execution is allowed.

## Allowed tools
Repository search/read, bundled scanner, local tests/build, disposable test database, read-only query plans/logs.

## Constraints
Treat scanner findings as hypotheses. Do not change a public pagination contract without explicit approval. Do not expose raw sensitive state in continuation tokens.

## Procedure
1. Identify the public pagination style: cursor, keyset, or offset.
2. Trace request parameters through controller/resolver, service, ORM/query builder, database ordering, and response token/page metadata.
3. List every ordering field and prove the full order is deterministic; add a unique tiebreaker to the hypothesis when multiple rows can share the primary sort value.
4. Confirm page size has a safe default and hard maximum.
5. For cursor/keyset flows, derive exactly which ordered values are encoded/represented and how the next predicate handles ascending/descending order and nulls.
6. For offset flows, identify expected behavior when rows are inserted/deleted between requests; do not claim mutation-stability if the design cannot provide it.
7. Run `python3 scripts/scan-pagination.py <repo> --output pagination-scan.json`; inspect each hit in context.
8. Build boundary tests for empty result, one item, exact page size, page size + 1, last partial page, and invalid/expired continuation input.
9. Build a duplicate/gap test: fetch page 1, mutate data in a representative way, fetch page 2, then verify observed IDs against the documented consistency contract.
10. Verify client-visible contract compatibility: parameter names/types, response fields, token opacity, sorting defaults, and error behavior.
11. Implement the smallest safe fix and rerun focused tests, build/static checks, and diff review.
12. Produce an assessment matching `schemas/assessment.schema.json`; validate using `scripts/validate-assessment.py`.

## Expected output
Structured findings with evidence, risk, recommendation, verification flags, and remaining risks.

## Verification
`pass` requires stable order verified, duplicate/gap behavior tested, boundary pages tested, and contract compatibility confirmed.

## Failure handling
Retry transient test/tool failures at most twice and preserve output. Deterministic test failures require diagnosis/change before rerun. Environment or permission blockers become `blocked`.

## Stop conditions
Stop before breaking API changes, database schema changes, production config/deployment, destructive data operations, or after two repeated transient failures.
