# NLP Testing and Release Gates

## Purpose
Create layered tests and release criteria that prevent NLP quality, safety, integration, and performance regressions from reaching production.

## When to use
Use when introducing a model, prompt, tokenizer, retriever, dataset, preprocessing change, or serving optimization.

## Inputs
Task contract, model pipeline, benchmark, production failure cases, API/schema contract, SLOs, safety requirements.

## Preconditions
Expected behavior and critical failure classes are known.

## Context to inspect
Unit tests, golden cases, offline benchmarks, integration tests, model versions, prompt versions, deployment pipeline, rollback process.

## Core knowledge
NLP tests must cover deterministic software and probabilistic behavior differently. Exact assertions suit parsing and schemas; distributional or threshold gates suit model quality; curated regression cases protect known semantic failures.

## Procedure
1. Identify deterministic components and add exact unit tests.
2. Build immutable golden cases for critical semantic behaviors.
3. Maintain a broader benchmark for statistical quality gates.
4. Add slice tests for language, domain, length, rarity, and high-risk cases.
5. Test malformed, empty, oversized, adversarial, and out-of-distribution inputs.
6. Validate output schemas and downstream contracts.
7. Run safety/privacy checks required by the product.
8. Load-test latency, throughput, and resource use.
9. Compare candidate against current production version using fixed data.
10. Define pass/fail thresholds with tolerances for nondeterminism.
11. Canary the release and monitor leading indicators.
12. Exercise rollback before full promotion.

## Decision points
Block releases on deterministic contract failures and critical safety regressions. Use statistically meaningful tolerances for stochastic quality metrics rather than brittle exact output matching.

## Common failure patterns
Snapshotting free-form text verbatim, no slice gates, evaluating only happy paths, changing benchmark and model simultaneously, and allowing latency improvements to bypass quality tests.

## Verification
All deterministic tests pass, quality/safety gates meet thresholds, load tests satisfy SLOs, canary metrics are stable, and rollback is confirmed.

## Expected output
Layered test suite, release scorecard, thresholds, regression corpus, canary criteria, and rollback evidence.

## Stop conditions
Stop release when critical gates fail, benchmark integrity is uncertain, or rollback cannot be executed safely.