# Apex Testing Strategy

## Purpose
Create fast, deterministic tests that prove business behavior, security assumptions, bulk safety, async behavior, and integration boundaries rather than merely increasing coverage percentage.

## When to use
Use for every Apex change and when repairing fragile suites or production regressions.

## Inputs
Requirements, Apex code, object model, permission model, integrations, failure scenarios.

## Context to inspect
Existing factories/builders, SeeAllData usage, mocks, runAs tests, async tests, assertion quality, test runtime.

## Core knowledge
Salesforce tests run in isolated data contexts by default. Coverage is only a deployment gate; correctness requires meaningful assertions and representative transaction shapes.

## Procedure
1. Convert acceptance criteria into observable behaviors.
2. Build only required data with reusable factories.
3. Test positive, negative, boundary, bulk, and authorization paths.
4. Mock callouts and assert request/response handling.
5. Wrap async execution with Test.startTest/stopTest appropriately.
6. Use runAs where record-sharing behavior matters.
7. Assert outcomes and side effects, not implementation details.
8. Add regression tests before fixing confirmed defects when practical.

## Decision points
Prefer focused unit-style tests for pure logic and broader integration-style Apex tests for transaction behavior that depends on the platform.

## Common failure patterns
Coverage-only tests, SeeAllData dependency, one-record tests, assertions that only check non-null, brittle IDs, and no failure-path coverage.

## Verification
Run relevant classes and full impacted suite; confirm deterministic results and coverage of realistic bulk/security scenarios.

## Expected output
A regression-resistant test suite with meaningful assertions and stable data setup.

## Stop conditions
Stop when required behavior cannot be reproduced because external contracts or security expectations are undefined.