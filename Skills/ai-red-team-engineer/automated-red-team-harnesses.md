# Automated Red-Team Harnesses

## Purpose
Build reliable automation for repeatedly executing adversarial AI tests, collecting evidence, and detecting regressions.

## When to use
Use once attack cases are stable enough for repeatable execution or when model/prompt releases require continuous security evaluation.

## Inputs
Test cases, target interface, credentials for isolated test accounts, scoring rules, model configuration, budgets, and CI environment.

## Context to inspect
Inspect API contracts, rate limits, nondeterminism, retry behavior, tracing, secret handling, artifact storage, and deployment gates.

## Core knowledge
LLM tests are probabilistic. Harnesses need controlled sampling, repeat runs, robust parsers, immutable test definitions, cost limits, provenance, and separation between generation and judging where appropriate.

## Procedure
1. Define a versioned test-case schema.
2. Capture target model, prompt, parameters, environment, and seed where supported.
3. Implement bounded execution with timeouts and cost limits.
4. Store raw inputs/outputs and structured metadata securely.
5. Implement deterministic assertions where possible.
6. Add rubric/model judging only where necessary and calibrate it.
7. Repeat stochastic cases enough to estimate failure rate.
8. Produce trendable metrics and failure artifacts.
9. Integrate critical regressions into release gates.

## Decision points
Use deterministic checks for explicit leaks/actions; use calibrated semantic judges for nuanced policy behavior. Avoid blocking releases on noisy metrics without confidence thresholds.

## Common failure patterns
Unbounded retries; hidden test mutation; judge-model drift; no raw evidence; shared production credentials; treating one sample as definitive.

## Verification
Re-run known pass/fail fixtures, confirm reproducibility, validate cost/time bounds, and compare automated labels against expert review samples.

## Expected output
A repeatable harness with auditable artifacts, metrics, and actionable regression signals.

## Stop conditions
Stop runs when budget, rate, safety, or environment limits are exceeded rather than retrying indefinitely.