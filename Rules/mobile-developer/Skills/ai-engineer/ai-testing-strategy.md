# AI Testing Strategy

## Purpose
Build a layered test strategy for probabilistic AI systems across deterministic code, prompts, retrieval, tools, integrations, and end-to-end behavior.

## When to use
Use when introducing AI features, changing models/prompts, adding tools, or defining release gates.

## Inputs
Architecture, evaluation set, test environments, tool contracts, schemas, risk categories, acceptance criteria.

## Preconditions
Separate deterministic components from probabilistic components and define expected evidence for each.

## Context to inspect
Unit tests, integration tests, eval harness, provider mocks, sandbox tools, production failure cases, CI configuration.

## Core knowledge
Mocking a model can validate orchestration but not model behavior. AI systems need deterministic tests for code/contracts plus real-model evaluations for semantic quality. Tests should cover variance, malformed output, tool errors, retrieval failures, policy behavior, and regressions.

## Procedure
1. Unit test deterministic parsing, validation, routing, and policy code.
2. Contract test provider/tool adapters.
3. Test retrieval with labeled relevance cases.
4. Run real-model evaluations for semantic behavior.
5. Add adversarial, safety, and historical failure cases.
6. Test timeout, retry, fallback, malformed-output, and partial-failure paths.
7. Use fixed versions/settings where reproducibility matters.
8. Gate releases on critical deterministic tests and evaluation thresholds.
9. Track flaky probabilistic cases separately from true regressions.
10. Add production incidents to the suite.

## Decision points
Use mocks to isolate orchestration; use real calls to validate model behavior. Keep expensive evaluations on targeted release gates while maintaining a smaller fast regression set.

## Common failure patterns
Only mocking models, brittle exact-text assertions, no failure-path tests, uncontrolled model versions, and evaluating on examples seen during prompt tuning.

## Verification
Run the full release suite and confirm deterministic, semantic, safety, and resilience thresholds are met.

## Expected output
A layered, maintainable test portfolio with explicit release gates.

## Stop conditions
Stop when acceptance criteria are absent or test data cannot be handled securely.