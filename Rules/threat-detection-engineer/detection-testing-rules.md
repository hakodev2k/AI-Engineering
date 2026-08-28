# Detection Testing Rules

## Purpose
Require deterministic validation of detection logic before and after production deployment.

## Scope
Applies to unit-style query tests, replay tests, integration tests, regression cases, and production validation.

## MUST
- Every material detection MUST have representative positive and negative test cases.
- Test fixtures MUST encode expected alert outcome and key evidence fields.
- Regression tests MUST cover previously fixed false positives and missed detections when reproducible.
- Tests MUST run against the same parsing and normalization assumptions used in production.
- Production changes MUST fail validation when required test cases fail.

## MUST NOT
- MUST NOT treat query compilation alone as proof of detection correctness.
- MUST NOT remove failing malicious test cases merely to make a deployment pass.
- MUST NOT use production secrets or sensitive data in test fixtures.

## SHOULD
- Test suites SHOULD include boundary conditions, duplicates, missing fields, delayed events, and benign lookalikes.
- Critical detections SHOULD be exercised periodically end-to-end.

## Exceptions
Exceptions require documented test limitation, risk, compensating validation, owner, and review date.

## Verification
Inspect automated test results, fixtures, CI gates, regression history, and periodic end-to-end exercise evidence.