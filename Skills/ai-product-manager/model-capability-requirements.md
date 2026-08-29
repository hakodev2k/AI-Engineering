# Model Capability Requirements

## Purpose
Translate product requirements into measurable model capability requirements without prescribing a provider prematurely.

## When to use
Use before model selection, major model upgrades, fine-tuning, or when product quality is blocked by model behavior.

## Inputs
User tasks, acceptance criteria, latency targets, context needs, languages, modalities, cost limits, safety constraints.

## Context to inspect
Representative inputs, failure examples, current prompts, evals, model/provider options, tool use, retrieval, and fallback behavior.

## Core knowledge
Model requirements should be expressed as observable behavior: accuracy, grounding, instruction following, tool reliability, structured output, reasoning depth, latency, context handling, and safety.

## Procedure
1. Decompose the user workflow into model-dependent tasks.
2. Define desired and unacceptable behavior for each task.
3. Specify representative input distributions and edge cases.
4. Define quality metrics and minimum thresholds.
5. Set latency, throughput, context, modality, and cost constraints.
6. Identify requirements that can be solved outside the model through retrieval, tools, validation, or UX.
7. Mark hard constraints versus optimization targets.
8. Convert the requirements into an evaluation plan.

## Decision points
Do not require a larger model when deterministic validation, retrieval, or workflow redesign can solve the gap more reliably or cheaply.

## Common failure patterns
Using vague labels such as 'smart enough', optimizing benchmark scores unrelated to user tasks, and conflating model capability with product quality.

## Verification
Ensure every critical requirement maps to an eval or operational metric and representative examples exist.

## Expected output
A provider-neutral capability specification with thresholds, constraints, and evaluation coverage.

## Stop conditions
Stop when task definitions or acceptance criteria are too ambiguous to measure.