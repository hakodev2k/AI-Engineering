# Flaky Test Triage Report

## Test

- **Test ID:** `Orders.IntegrationTests.CheckoutTests::SubmitOrder_returns_201`
- **Behavioral contract:** submitting a valid order returns HTTP 201 and persists exactly one order.
- **Commit:** `<commit-sha>`

## Observations

| Run | Outcome | Signature | Notes |
|---|---|---|---|
| 1 | failed | `duplicate key value violates unique constraint` | first failure preserved |
| 2 | passed | — | same commit/environment |
| 3 | failed | `duplicate key value violates unique constraint` | parallel worker active |

All observations are recorded in `artifacts/flaky-summary.json`.

## Hypotheses

### H1 — shared fixture state between parallel tests

**Evidence for**
- Both failures have the same duplicate-key signature.
- Neighboring tests write the same fixed external ID.
- Failures only appear when the suite runs in parallel.

**Evidence against**
- Single-test reruns are stable, so the exact interfering test is not yet proven.

**Discriminating check**
- Run the affected group with isolated unique fixture IDs while preserving parallelism.

### H2 — product regression in duplicate-order handling

**Evidence for**
- The production path surfaces a database uniqueness violation.

**Evidence against**
- The same code path succeeds when fixture data is isolated.
- No production behavior change exists in the recent diff.

## Classification

- **Classification:** `shared-state`
- **Confidence:** medium-high
- **Quarantine evaluation allowed:** yes

The result is not classified as `product-regression` because evidence ties occurrence to test fixture collision. If the isolated-fixture experiment does not remove the instability, classification returns to `unknown`.

## Recommended remediation

1. Generate a unique external order ID per test execution.
2. Remove reliance on cross-test cleanup ordering.
3. Re-run the affected group repeatedly under parallel execution.
4. Run neighboring integration tests.
5. Remove quarantine only after stability evidence is recorded.

## Proposed temporary quarantine

- **Owner:** `team-orders`
- **Issue:** `ENG-1842`
- **Critical path:** false
- **Expiry:** `2026-08-28`
- **Evidence:** this report + aggregated JUnit summary

## Verification status

- **Task completed:** triage classification produced.
- **Task verified:** not yet; verification requires reviewer approval, valid registry metadata, and deterministic registry validation.
