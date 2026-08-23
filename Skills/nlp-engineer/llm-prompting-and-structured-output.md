# LLM Prompting and Structured Output

## Purpose
Design reliable LLM instruction and output contracts for NLP workflows, with schema enforcement, bounded context, and measurable behavior.

## When to use
Use for extraction, classification, transformation, summarization, or controlled generation with an LLM.

## Inputs
Task contract, representative inputs, output schema, model capabilities, context and cost limits, risk constraints.

## Preconditions
Expected outputs and failure behavior can be specified and tested.

## Context to inspect
Existing prompts, model/version, tool interfaces, examples, schema validators, production errors, token budgets.

## Core knowledge
Prompt quality is an interface-design problem. Reliability improves when instructions, evidence, examples, output schema, refusal behavior, and validation are explicit and versioned.

## Procedure
1. State task objective and decision boundaries.
2. Separate trusted instructions from untrusted input.
3. Define output schema and required fields.
4. Add examples only for meaningful ambiguities.
5. Define missing-data, refusal, and uncertainty behavior.
6. Bound context and remove irrelevant text.
7. Validate outputs syntactically and semantically.
8. Build regression cases from real failures.
9. Compare prompt/model variants on fixed evaluation data.
10. Version prompt, model, and schema together.

## Decision points
Prefer schema-constrained outputs over free text for machine consumers. Use few-shot examples when they clarify edge cases; avoid them when they bias diverse inputs unnecessarily.

## Common failure patterns
Mixing data with instructions, no schema validation, relying on wording intuition instead of tests, unbounded context, silent model-version changes, and treating parse success as semantic correctness.

## Verification
Regression suite, schema validation, semantic checks, cost/latency measurements, and adversarial-input tests pass.

## Expected output
Versioned prompt contract, schema, evaluation cases, validation logic, and failure policy.

## Stop conditions
Stop when required behavior cannot be expressed consistently or output errors create unacceptable downstream risk without human review.