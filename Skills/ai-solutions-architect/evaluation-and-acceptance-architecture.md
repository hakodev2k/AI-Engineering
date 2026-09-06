# Evaluation and Acceptance Architecture

## Purpose
Design an evaluation system that determines whether AI behavior is good enough for release and detects regressions after changes.

## When to use
Use before model, prompt, retrieval, tool, or workflow changes reach production.

## Inputs
Task taxonomy, acceptance criteria, representative data, risk classes, baseline system, human-review capacity, and release process.

## Context to inspect
Inspect production examples, known failures, existing tests, model/provider versioning, analytics, user feedback, and business metrics.

## Core knowledge
AI evaluation needs multiple layers: deterministic tests, task-quality metrics, human judgment, safety tests, retrieval tests, operational NFRs, and production monitoring. A single aggregate score can hide severe regressions.

## Procedure
1. Partition workload into meaningful task and risk classes.
2. Build representative and adversarial evaluation sets.
3. Define pass/fail thresholds per class.
4. Choose automated metrics only where they correlate with desired outcomes.
5. Add calibrated human review for subjective quality.
6. Evaluate retrieval, model output, and tool behavior separately.
7. Compare candidates against a stable baseline.
8. Define release gates for quality, safety, latency, and cost.
9. Version datasets, prompts, models, and evaluators.
10. Feed production failures back into regression suites.

## Decision points
Use deterministic checks for structured requirements; human evaluation for nuanced quality; model-based judges only after validating agreement with trusted human labels.

## Common failure patterns
Testing only curated examples, changing the evaluation set with the candidate, averaging away critical failures, and declaring implementation complete without verification.

## Verification
A release candidate independently passes defined gates and produces reproducible evaluation evidence.

## Expected output
An evaluation architecture with datasets, metrics, reviewers, thresholds, versioning, release gates, and regression workflow.

## Stop conditions
Stop when acceptance thresholds are undefined, evaluation data is not representative, or critical outcomes cannot be reliably assessed.