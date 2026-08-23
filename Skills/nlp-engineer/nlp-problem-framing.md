# NLP Problem Framing

## Purpose
Translate a language-product requirement into a measurable NLP task, evaluation plan, data contract, and deployment constraint set.

## When to use
Use before selecting models for classification, extraction, ranking, generation, retrieval, summarization, moderation, or conversational systems. Do not use when the task is already specified with validated metrics and acceptance criteria.

## Inputs
Business requirement, user journeys, examples, failure costs, languages, latency/cost constraints, privacy constraints, existing data and models.

## Preconditions
Stakeholders can describe desired behavior and unacceptable failures.

## Context to inspect
Current product flow, labels, APIs, model outputs, logs, user feedback, compliance constraints, baseline metrics, traffic distribution.

## Core knowledge
NLP tasks fail when the proxy task, label schema, or metric does not reflect user value. Senior framing separates semantic objective, operational constraints, data availability, ambiguity, and error asymmetry.

## Procedure
1. Define the user decision or workflow affected by the model.
2. Identify input/output units and languages.
3. Enumerate important error classes and their costs.
4. Choose task formulation: classification, tagging, retrieval, ranking, structured generation, free generation, or hybrid.
5. Define measurable acceptance metrics and slices.
6. Establish human or rule-based baseline.
7. Identify data, privacy, latency, throughput, and cost constraints.
8. Define abstention/escalation behavior where uncertainty is material.
9. Document assumptions and unresolved risks.
10. Obtain agreement on evaluation before implementation.

## Decision points
Prefer simpler discriminative tasks when outputs are bounded and auditable. Use generative formulations when output space or reasoning flexibility materially improves value.

## Common failure patterns
Optimizing BLEU/F1 without user relevance, ignoring multilingual slices, vague labels, evaluating only averages, no baseline, and treating generation quality as a single scalar.

## Verification
Acceptance criteria map to product outcomes, important slices have metrics, failure costs are explicit, and a baseline can be measured.

## Expected output
Task definition, data contract, metric suite, baseline, constraints, risk list, and evaluation slices.

## Stop conditions
Stop when requirements conflict, target behavior cannot be labeled or judged consistently, or compliance/data access blocks evaluation.