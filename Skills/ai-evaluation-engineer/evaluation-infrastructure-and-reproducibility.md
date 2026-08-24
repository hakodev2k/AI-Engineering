# Evaluation Infrastructure and Reproducibility

## Purpose
Build evaluation infrastructure that produces traceable, repeatable, comparable results across model versions, prompts, datasets, and execution environments.

## When to use
Use when moving from ad hoc notebooks to shared evaluation pipelines, integrating evals into CI/CD, or investigating inconsistent results across runs.

## Inputs
- Evaluation suites and datasets
- Model and system configurations
- Runtime dependencies
- Artifact storage
- CI or orchestration environment

## Context to inspect
Inspect model version pinning, prompt/config versioning, dataset hashes, random seeds, concurrency, retries, caching, dependency versions, and result schemas.

## Core knowledge
Reproducibility requires more than source control. External model APIs can be nondeterministic, so runs must capture enough context to distinguish code changes from provider changes, stochastic variance, data changes, and evaluator changes.

## Procedure
1. Define a canonical evaluation run manifest.
2. Record code revision, model identifiers, prompt/config hashes, dataset version, judge version, and environment metadata.
3. Use immutable or content-addressed evaluation datasets where practical.
4. Pin dependencies and evaluator logic.
5. Control random seeds where the stack supports them.
6. Capture raw requests, responses, traces, scores, and errors with privacy-safe retention.
7. Implement bounded retries and distinguish infrastructure failure from evaluated-system failure.
8. Store per-example outputs before computing aggregates.
9. Make result computation rerunnable from stored raw artifacts.
10. Add smoke tests for evaluators and parsers.
11. Integrate stable suites into CI or release workflows.
12. Monitor runtime, cost, and flaky-test behavior of the evaluation system itself.

## Decision points
Cache deterministic or expensive intermediate artifacts only when cache keys include all behavior-affecting inputs. Re-run stochastic evaluations when variance materially affects decisions rather than pretending a single run is exact.

## Common failure patterns
- Comparing runs with different datasets silently
- Unpinned judge models
- Aggregate-only result storage
- Infinite retry hiding provider failures
- Cache keys missing prompt/model versions

## Verification
Re-run a frozen experiment and confirm manifests, raw artifacts, aggregate metrics, and expected uncertainty are reproducible within documented tolerances.

## Expected output
A repeatable evaluation pipeline with immutable manifests, stored artifacts, deterministic scoring where possible, and explicit variance handling.

## Stop conditions
Stop when model or dataset identity cannot be captured, privacy rules prohibit necessary artifact retention without an alternative, or infrastructure errors cannot be separated from system failures.