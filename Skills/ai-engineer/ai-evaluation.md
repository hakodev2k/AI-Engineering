# AI Evaluation

## Purpose
Create repeatable evaluations that measure whether an AI system actually satisfies user and business requirements before and after changes.

## When to use
Use for model, prompt, RAG, agent, fine-tuning, safety, or architecture changes and before production releases.

## Inputs
Task definition, representative examples, expected behavior, production failures, risk categories, latency/cost targets, candidate system versions.

## Preconditions
Define what success and unacceptable failure mean for each important task class.

## Context to inspect
Production traces, support incidents, prompt versions, model versions, retrieval outputs, current tests, human review criteria, business impact.

## Core knowledge
Generative systems require distribution-aware testing. Evaluation should combine deterministic checks, task-specific scoring, human judgment where needed, and production monitoring. A single average score can hide catastrophic failures in critical slices.

## Procedure
1. Split the product into meaningful task and risk categories.
2. Build a versioned dataset from representative, edge, adversarial, and historical failure cases.
3. Define deterministic assertions where possible.
4. Define rubrics for semantic quality, groundedness, completeness, safety, and style as relevant.
5. Calibrate model-based judges against human judgments before trusting them.
6. Record latency, token use, cost, and schema/tool reliability alongside quality.
7. Compare candidate and baseline using identical inputs and settings.
8. Analyze results by slice, not only aggregate score.
9. Establish release thresholds and regression budgets.
10. Add newly discovered production failures to the suite.

## Decision points
Use exact assertions for schemas, citations, tool calls, and known facts. Use human or calibrated judge evaluation for nuanced usefulness. Require stricter thresholds for high-impact failures.

## Common failure patterns
Tiny cherry-picked datasets, judging only happy paths, uncalibrated LLM judges, changing test data between candidates, ignoring variance, and optimizing a metric disconnected from user value.

## Verification
Re-run evaluation reproducibly, inspect disagreements manually, confirm critical slices meet thresholds, and retain artifacts for comparison.

## Expected output
A versioned evaluation suite, scorecard, release thresholds, and categorized failure evidence.

## Stop conditions
Stop when acceptance criteria are undefined, evaluation data is not representative, or sensitive examples cannot be handled safely.