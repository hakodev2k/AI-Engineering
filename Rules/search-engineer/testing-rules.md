# Search Testing

## Purpose
Prevent regressions across correctness, relevance, security, and production behavior.

## Scope
Unit, integration, end-to-end, regression, load, and failure testing.

## MUST
- Test query semantics, filters, authorization, indexing, ranking, and failure behavior at the appropriate layer.
- Keep deterministic golden cases for critical query transformations and contracts.
- Add regression coverage for production defects where a stable test is practical.
- Test with representative corpus characteristics rather than toy documents alone.

## MUST NOT
- Depend exclusively on snapshot tests that cannot explain meaningful ranking changes.
- mask flaky search tests with unbounded retries.
- Use production-sensitive data in test environments without approved controls.

## SHOULD
- Separate deterministic contract tests from statistical relevance evaluation.
- Include malformed, adversarial, empty, long, multilingual, and high-cardinality cases.

## Exceptions
Exceptions require documented coverage gap, alternate evidence, and risk acceptance.

## Verification
Review CI results, test data provenance, flaky-test trends, coverage of critical paths, and regression suites.