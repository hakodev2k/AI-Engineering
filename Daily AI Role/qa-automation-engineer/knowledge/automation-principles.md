# Automation Engineering Principles

## Test pyramid as an economic model
The point is not to force a shape. It is to place verification at the cheapest reliable layer. Unit/component checks give fast local feedback; API/integration checks prove service boundaries; UI E2E checks prove user-critical cross-system behavior. Excess UI coverage raises runtime, diagnosis cost, and brittleness.

## Risk-based coverage
Prioritize behavior by user/business impact and failure likelihood, then account for detectability and reversibility. A low-frequency irreversible data-loss path may deserve more evidence than a common cosmetic path.

## Determinism
A trustworthy test produces the same result for the same relevant state. Control mutable data, clock/randomness where practical, asynchronous completion, environment dependencies, and worker collisions. Determinism does not mean mocking everything; it means understanding controlled versus external variables.

## Behavioral assertions
Assert what a consumer cares about. Strong checks verify state transitions, permissions, persistence, contract semantics, or visible outcomes. Weak checks merely confirm that a page loaded or a status was 200.

## Isolation
Each test should create or own the state it mutates. Parallel workers should not compete for one account, record, filename, or queue item unless concurrency itself is the behavior under test.

## Idempotency and retries
Retries can duplicate side effects. Only retry operations known to be safe or designed idempotently. Runtime retries are diagnostics/availability mechanisms, not proof of correctness.

## Test data
Prefer generated unique data with explicit ownership and safe cleanup. Avoid hard-coded shared records. Seed only stable reference data. Never use real personal information when synthetic data can prove the behavior.

## Evidence quality
A pass/fail count is insufficient for high-risk work. Useful evidence includes build/commit identity, environment, command/scope, assertions executed, failures/skips, logs/traces where needed, and known exclusions.

## Maintenance economics
Automation is code. Remove duplicated helpers, keep fixtures focused, avoid giant page objects, and delete obsolete tests when the requirement is removed. A test that nobody trusts has negative value.

## Common failure patterns
- Arbitrary sleeps hide synchronization races.
- Shared credentials/data create order dependence.
- Full JSON snapshots fail on irrelevant volatility.
- CSS/XPath chains couple tests to layout.
- Blanket retries hide defects and increase CI time.
- Mock-heavy E2E tests claim integration confidence they do not provide.
- Tests verify setup mechanics more than business behavior.
