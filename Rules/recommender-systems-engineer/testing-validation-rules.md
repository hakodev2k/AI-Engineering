# Testing and Validation Rules

## Purpose
Require deterministic evidence that recommendation pipelines, models, constraints, and serving behavior remain correct across changes.

## Scope
Applies to unit, integration, data, model, contract, end-to-end, replay, and regression testing for recommendation systems.

## MUST
- Critical ranking constraints, eligibility rules, feature transformations, and fallback paths MUST have automated regression coverage.
- Tests MUST include duplicate, delayed, missing, malformed, stale, and out-of-order data scenarios where those conditions are possible.
- Training-serving compatibility MUST be validated for model inputs, feature versions, schemas, and score contracts.
- Production-bound changes MUST pass representative integration or replay tests using realistic traffic distributions without exposing unauthorized personal data.
- Non-deterministic components MUST define tolerances, seeds, repeated-run expectations, or statistical assertions appropriate to the behavior under test.

## MUST NOT
- MUST NOT accept flaky tests as normal evidence for production readiness.
- MUST NOT mock away the integration boundary being validated when the real contract is materially important.
- MUST NOT treat one successful manual example as sufficient regression protection for a systemic change.

## SHOULD
- Golden datasets SHOULD cover high-value, safety-sensitive, cold-start, and historically failure-prone cases.
- Property-based or invariant tests SHOULD be used for ordering, deduplication, eligibility, and monetary or policy constraints when applicable.

## Exceptions
Exceptions require documented testing limitations, alternative evidence, residual risk, owner, and approval when critical coverage is deferred.

## Verification
Inspect CI results, test inventories, flaky-test history, replay reports, contract tests, golden datasets, and traceability from known risks to automated checks.