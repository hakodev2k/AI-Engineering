# React Testing Strategy

## Purpose
Build a balanced test portfolio that protects user-visible behavior without coupling tests to implementation details.

## When to use
Use when defining test strategy, adding features, refactoring, or addressing flaky/slow suites.

## Inputs
Risk profile, user flows, component boundaries, APIs, existing test stack.

## Preconditions
Identify behaviors whose regression would materially harm users or business.

## Context to inspect
Unit/component/integration/E2E suites, mocks, fixtures, coverage gaps, flaky tests.

## Core knowledge
Test behavior at the cheapest layer that provides confidence. Prefer accessible queries and realistic integration over shallow implementation assertions.

## Procedure
1. Rank behaviors by risk.
2. Cover pure logic with focused unit tests.
3. Test components through user interactions and rendered semantics.
4. Integrate real routing/state/data adapters where practical.
5. Reserve E2E for critical cross-system journeys.
6. Minimize network/service mocking at the wrong abstraction layer.
7. Stabilize deterministic test data/time.
8. Track flaky tests as defects.

## Decision points
Use snapshots sparingly for stable structured output, not as primary behavioral verification.

## Common failure patterns
Testing private state, over-mocking, giant snapshots, brittle selectors, duplicate coverage at every layer.

## Verification
Run suites locally/CI, mutate representative code paths mentally or via targeted checks, and confirm failures are diagnostic.

## Expected output
Fast, maintainable tests aligned to product risk.

## Stop conditions
Stop if test environment cannot reproduce critical integration behavior and needs infrastructure work.