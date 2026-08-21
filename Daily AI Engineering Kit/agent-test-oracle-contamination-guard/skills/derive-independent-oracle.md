# Derive Independent Test Oracle

## Purpose
Build expected behavior from evidence that is independent of the implementation under test, so generated tests can detect defects instead of merely copying current behavior.

## When to use
Use before generating or rewriting assertions for bug fixes, feature work, refactors, public API behavior, security rules, money calculations, migrations, or production regressions.

## Inputs
- Requirement or acceptance criteria.
- Public contract or domain rule.
- Historical regression evidence when applicable.
- Relevant reference examples or golden fixtures.
- Risk classification: `low`, `medium`, `high`, or `critical`.

## Preconditions
- The behavior under test is identifiable.
- At least one evidence source can be named.
- Implementation code is not treated as the primary truth source.

## Allowed tools
Repository read/search, issue/requirement read, official documentation read, test runner, mutation tool, deterministic scripts in `scripts/`.

## Constraints
- Do not derive expected values from private helpers or the exact branch being tested.
- Do not record current runtime output as a golden value unless independently validated.
- Keep facts, hypotheses, decisions, and evidence separate.

## Procedure
1. Name one behavior per oracle claim.
2. Classify its risk.
3. Locate the strongest independent source: acceptance criterion, public contract, domain rule, reference example, official documentation, or historical regression evidence.
4. Write the expected result without copying implementation expressions.
5. Record the source path/identifier and concrete evidence text or reference.
6. Mark `independent=true` only when the source can stand without the current implementation.
7. List implementation symbols consulted only for navigation, never as proof.
8. Store claims as a JSON array following `schemas/oracle-claim.schema.json`.
9. Run `scripts/fingerprint-oracle.py` to bind claims to the current policy.
10. Generate tests from those claims.
11. Run `scripts/extract-test-assertions.py` and `scripts/detect-oracle-contamination.py`.
12. For high/critical claims, produce mutation evidence before final verification.

## Expected output
A machine-readable claim set with explicit provenance and risk.

## Verification
- Every claim has non-empty evidence.
- High-risk claims have at least one independent claim.
- No claim uses `implementation-code`, `private-helper`, `generated-output`, or `current-branch-behavior` as an independent source.
- Contamination detector has no blockers.

## Failure handling
If no independent source exists, stop and report `oracle-source-missing`; do not invent expected behavior. Ask for a human/product/domain decision outside this autonomous workflow.

## Stop conditions
Stop before changing a public contract, security rule, production configuration, schema, destructive data behavior, or other approval-required action without explicit approval.
